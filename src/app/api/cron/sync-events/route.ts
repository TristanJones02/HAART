import { timingSafeEqual } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { syncEvents, writeSyncStatus, type SyncResult } from '@/lib/events/upsert';
import { getWriteClient } from '@/lib/sanity/client';

/**
 * Cron entry point: pulls the Facebook iCal export and upserts events into
 * Sanity (docs/decisions.md D5). Vercel calls it every six hours with
 * `Authorization: Bearer $CRON_SECRET`; it can also be run by hand with the
 * same header. Every outcome is written to the `syncStatus` document so a
 * broken feed is visible in the Studio, not just in the logs.
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const FETCH_TIMEOUT_MS = 15000;
const USER_AGENT = 'haart.org.au events sync (+https://haart.org.au; Next.js cron)';

export async function GET(request: Request): Promise<Response> {
  return handle(request);
}

export async function POST(request: Request): Promise<Response> {
  return handle(request);
}

async function handle(request: Request): Promise<Response> {
  const secret = env.events.cronSecret;
  if (!secret) {
    return json(503, { ok: false, error: 'CRON_SECRET is not set. Set it in the environment so the cron route can be called safely.' });
  }
  if (!authorised(request.headers.get('authorization'), secret)) {
    return json(401, { ok: false, error: 'Unauthorised' });
  }

  const client = getWriteClient();
  if (!client) {
    return json(503, { ok: false, error: 'Sanity write access is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN.' });
  }

  const now = new Date();
  let icsText: string;
  let source: string;

  if (env.events.icalUrl) {
    source = 'feed';
    try {
      icsText = await fetchIcs(env.events.icalUrl);
    } catch (err) {
      const message = `Could not fetch the Facebook iCal feed: ${err instanceof Error ? err.message : String(err)}`;
      await writeSyncStatus(client, { ok: false, message, count: 0, now });
      return json(502, { ok: false, error: message });
    }
  } else if (!env.isProduction) {
    source = 'fixture';
    icsText = await readFile(path.join(process.cwd(), 'fixtures', 'sample-events.ics'), 'utf8');
  } else {
    const message = 'FACEBOOK_EVENTS_ICAL_URL is not set';
    await writeSyncStatus(client, { ok: false, message, count: 0, now });
    return json(200, { ok: false, skipped: true, error: message });
  }

  const result: SyncResult = await syncEvents({ icsText, client, now });

  if (result.ok) {
    try {
      revalidateTag('events', 'max');
      revalidatePath('/');
      revalidatePath('/events');
    } catch (err) {
      result.warnings.push(`Revalidation failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return json(result.ok ? 200 : 500, { ...result, source, ranAt: now.toISOString() });
}

async function fetchIcs(url: string): Promise<string> {
  const res = await fetch(url, {
    cache: 'no-store',
    redirect: 'follow',
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { 'user-agent': USER_AGENT, accept: 'text/calendar, text/plain;q=0.9, */*;q=0.5' },
  });
  if (!res.ok) throw new Error(`feed responded ${res.status} ${res.statusText}`.trim());
  return res.text();
}

function authorised(header: string | null, secret: string): boolean {
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(header ?? '');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function json(status: number, body: Record<string, unknown>): Response {
  return NextResponse.json(body, { status, headers: { 'cache-control': 'no-store' } });
}
