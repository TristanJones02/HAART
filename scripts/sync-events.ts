/**
 * Runs the Facebook events sync from the command line.
 *
 *   pnpm sync:events              FACEBOOK_EVENTS_ICAL_URL → Sanity (falls back to the fixture when unset)
 *   pnpm sync:events --fixture    fixtures/sample-events.ics → Sanity
 *   pnpm sync:events --dry-run    parse and print what would be written, no Sanity needed
 *
 * Reads .env.local if present. Exits non-zero when the sync fails.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const FIXTURE = path.join(process.cwd(), 'fixtures', 'sample-events.ics');

function loadDotEnv(): void {
  for (const file of ['.env.local', '.env']) {
    try {
      process.loadEnvFile(path.join(process.cwd(), file));
    } catch {
      // Missing file: nothing to load.
    }
  }
}

async function main(): Promise<number> {
  loadDotEnv();
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has('--dry-run');
  const useFixture = args.has('--fixture');

  // Imported after the env file is loaded because `env` reads process.env at import time.
  const { env } = await import('@/lib/env');
  const { syncEvents } = await import('@/lib/events/upsert');
  const { getWriteClient } = await import('@/lib/sanity/client');

  let icsText: string;
  let from: string;
  if (!useFixture && env.events.icalUrl) {
    from = 'FACEBOOK_EVENTS_ICAL_URL';
    const res = await fetch(env.events.icalUrl, {
      signal: AbortSignal.timeout(15000),
      headers: { 'user-agent': 'haart.org.au events sync (+https://haart.org.au; CLI)', accept: 'text/calendar, text/plain;q=0.9, */*;q=0.5' },
    });
    if (!res.ok) {
      console.error(`Feed responded ${res.status} ${res.statusText}`);
      return 1;
    }
    icsText = await res.text();
  } else {
    from = path.relative(process.cwd(), FIXTURE);
    if (!useFixture) console.warn('FACEBOOK_EVENTS_ICAL_URL is not set; using the fixture.');
    icsText = await readFile(FIXTURE, 'utf8');
  }

  let client;
  if (dryRun) {
    const { createMemoryClient } = await import('@/lib/events/memory-client');
    client = createMemoryClient();
  } else {
    client = getWriteClient();
    if (!client) {
      console.error('Sanity write access is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN, or pass --dry-run.');
      return 1;
    }
  }

  const now = new Date();
  const result = await syncEvents({ icsText, client, now });

  console.log(`Source: ${from}${dryRun ? ' (dry run, nothing written to Sanity)' : ''}`);
  console.log(`Result: ${result.ok ? 'ok' : 'FAILED'}`);
  console.log(`Events in feed: ${result.count}; created ${result.created}, updated ${result.updated}, unchanged ${result.skipped}, marked cancelled ${result.cancelled}`);
  for (const warning of result.warnings) console.log(`Warning: ${warning}`);
  if (result.error) console.error(`Error: ${result.error}`);

  if (dryRun && 'docs' in client) {
    console.log('');
    for (const doc of client.docs.values()) {
      if (doc._type !== 'event') continue;
      const loc = doc.location as { address?: string } | undefined;
      console.log(`  ${String(doc.start)}  ${doc.cancelled ? '[cancelled] ' : ''}${String(doc.title)}${loc?.address ? `  @ ${loc.address}` : ''}`);
    }
    const status = client.docs.get('syncStatus-facebook-events');
    if (status) console.log(`\nsyncStatus: ${String(status.message)}`);
  }

  return result.ok ? 0 : 1;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(err instanceof Error ? err.stack ?? err.message : err);
    process.exit(1);
  });
