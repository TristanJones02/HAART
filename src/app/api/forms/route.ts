/**
 * POST /api/forms
 *
 * Accepts every website form, as JSON (from DynamicForm) or form-encoded
 * (the no-JavaScript fallback). Order of operations:
 *
 *   1. honeypot: filled means a bot; reply 200 ok and do nothing
 *   2. validate with the form's zod schema; 400 with field messages
 *   3. best-effort rate limit per IP
 *   4. deliver: email through Resend, and a copy in Sanity as a `submission`
 *
 * Error responses never include what was submitted. Form-encoded posts get a
 * 303 back to the page they came from with `?sent=1` or `?error=1`.
 */
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { Submission } from '@/lib/content/types';
import { env } from '@/lib/env';
import { getFormDefinition, isFormId, type FormDefinition } from '@/lib/forms/definitions';
import { emailSubject, formatSubmissionText, submitterEmail } from '@/lib/forms/format';
import { FORM_ID_FIELD, REDIRECT_FIELD, isHoneypotFilled, parseSubmission, type SubmissionData } from '@/lib/forms/schema';
import { getWriteClient } from '@/lib/sanity/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 64 * 1024;
const NOT_CONNECTED = 'This form is not connected yet. Email info@haart.org.au instead.';
const DELIVERY_FAILED = 'We could not send your form just now. Please try again in a few minutes, or email info@haart.org.au.';
const SERVER_ERROR = 'Something went wrong. Please try again, or email info@haart.org.au.';
const TOO_MANY = 'Too many forms sent from your connection. Please wait ten minutes and try again.';

// ---------------------------------------------------------------------------
// Rate limit. In-memory, so each serverless instance keeps its own counter
// and instances do not share it: this is best-effort protection against a
// runaway script, not a hard cap. The honeypot and Resend's own limits do
// the rest.
// ---------------------------------------------------------------------------

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 10;
const hits = new Map<string, number[]>();

function allow(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (!times.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(key);
  }
  return true;
}

function clientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip')?.trim() || 'unknown';
}

// ---------------------------------------------------------------------------
// Request and response plumbing
// ---------------------------------------------------------------------------

type Body = Record<string, unknown>;
type Mode = 'json' | 'redirect';

function isPlainObject(v: unknown): v is Body {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

async function readBody(req: Request): Promise<{ body: Body; mode: Mode } | null> {
  const type = (req.headers.get('content-type') ?? '').toLowerCase();
  const accept = (req.headers.get('accept') ?? '').toLowerCase();
  const wantsJson = accept.includes('application/json') && !accept.includes('text/html');

  if (type.includes('application/json')) {
    const parsed: unknown = await req.json();
    return isPlainObject(parsed) ? { body: parsed, mode: 'json' } : null;
  }

  if (type.includes('application/x-www-form-urlencoded') || type.includes('multipart/form-data')) {
    const fd = await req.formData();
    const body: Body = {};
    for (const key of new Set(fd.keys())) {
      const values = fd.getAll(key).filter((v): v is string => typeof v === 'string');
      body[key] = values.length > 1 ? values : (values[0] ?? '');
    }
    return { body, mode: wantsJson ? 'json' : 'redirect' };
  }

  return null;
}

/** Only a same-site path is ever used as a redirect target; anything else goes to the home page. */
function safeRedirectPath(value: unknown): string {
  if (typeof value !== 'string') return '/';
  const path = value.split(/[?#]/)[0];
  return /^\/(?!\/)[A-Za-z0-9._~%/-]*$/.test(path) && path.length <= 500 ? path : '/';
}

type Reply = { status: number; body: Body; outcome: 'sent' | 'error' };

function respond(reply: Reply, mode: Mode, redirectPath: string): NextResponse {
  if (mode === 'json') return NextResponse.json(reply.body, { status: reply.status, headers: { 'cache-control': 'no-store' } });
  const location = `${redirectPath}?${reply.outcome === 'sent' ? 'sent=1' : 'error=1'}`;
  return new NextResponse(null, { status: 303, headers: { location, 'cache-control': 'no-store' } });
}

// ---------------------------------------------------------------------------
// Delivery
// ---------------------------------------------------------------------------

type Delivery = { attempted: boolean; emailSent: boolean; stored: boolean; text: string };

async function deliver(def: FormDefinition, data: SubmissionData): Promise<Delivery> {
  const receivedAt = new Date();
  const text = formatSubmissionText(def, data, receivedAt);
  let attempted = false;
  let emailSent = false;
  let stored = false;

  if (env.forms.resendApiKey) {
    attempted = true;
    try {
      const resend = new Resend(env.forms.resendApiKey);
      const { error } = await resend.emails.send({
        from: `HAART website <${env.forms.fromEmail}>`,
        to: env.forms.toEmail,
        replyTo: submitterEmail(def, data),
        subject: emailSubject(def, data),
        text,
      });
      if (error) console.error('[forms] email not sent', def.id, error.name, error.message);
      else emailSent = true;
    } catch (err) {
      console.error('[forms] email failed', def.id, err instanceof Error ? err.message : String(err));
    }
  }

  const client = getWriteClient();
  if (client) {
    attempted = true;
    try {
      const doc: Submission = {
        _type: 'submission',
        form: def.id,
        receivedAt: receivedAt.toISOString(),
        data: JSON.stringify(data, null, 2),
        emailSent,
        status: 'new',
      };
      await client.create(doc);
      stored = true;
    } catch (err) {
      console.error('[forms] sanity copy failed', def.id, err instanceof Error ? err.message : String(err));
    }
  }

  return { attempted, emailSent, stored, text };
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function POST(req: Request): Promise<NextResponse> {
  const length = Number(req.headers.get('content-length') ?? 0);
  if (length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, message: 'That form is too large to send.' }, { status: 413 });
  }

  let mode: Mode = 'json';
  let redirectPath = '/';
  try {
    const read = await readBody(req).catch(() => null);
    if (!read) return NextResponse.json({ ok: false, message: 'Unsupported request.' }, { status: 415 });
    const { body } = read;
    mode = read.mode;
    redirectPath = safeRedirectPath(body[REDIRECT_FIELD]);

    // 1. Honeypot: pretend it worked.
    if (isHoneypotFilled(body)) return respond({ status: 200, body: { ok: true }, outcome: 'sent' }, mode, redirectPath);

    // 2. Validate.
    const id = typeof body[FORM_ID_FIELD] === 'string' ? body[FORM_ID_FIELD] : '';
    const parsed = parseSubmission(id, body);
    if (!parsed.ok) {
      return respond(
        { status: 400, body: { ok: false, message: 'Check the highlighted fields and try again.', errors: parsed.errors }, outcome: 'error' },
        mode,
        redirectPath,
      );
    }
    if (!isFormId(id)) return respond({ status: 400, body: { ok: false, message: 'Unknown form.' }, outcome: 'error' }, mode, redirectPath);
    const def = getFormDefinition(id);

    // 3. Rate limit.
    if (!allow(clientIp(req))) return respond({ status: 429, body: { ok: false, message: TOO_MANY }, outcome: 'error' }, mode, redirectPath);

    // 4. Deliver.
    const result = await deliver(def, parsed.data);

    if (!result.attempted) {
      if (env.isProduction) {
        console.error('[forms] no delivery configured: set RESEND_API_KEY or SANITY_API_WRITE_TOKEN');
        return respond({ status: 503, body: { ok: false, message: NOT_CONNECTED }, outcome: 'error' }, mode, redirectPath);
      }
      console.info(`[forms] ${def.id} submission (no email or Sanity configured; logging instead)\n${result.text}`);
      return respond({ status: 200, body: { ok: true, delivery: 'console' }, outcome: 'sent' }, mode, redirectPath);
    }

    if (!result.emailSent && !result.stored) {
      return respond({ status: 502, body: { ok: false, message: DELIVERY_FAILED }, outcome: 'error' }, mode, redirectPath);
    }

    const delivery = [result.emailSent ? 'email' : null, result.stored ? 'sanity' : null].filter(Boolean).join('+');
    return respond({ status: 200, body: { ok: true, delivery }, outcome: 'sent' }, mode, redirectPath);
  } catch (err) {
    console.error('[forms] unhandled', err instanceof Error ? err.message : String(err));
    return respond({ status: 500, body: { ok: false, message: SERVER_ERROR }, outcome: 'error' }, mode, redirectPath);
  }
}
