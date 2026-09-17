import { EXISTING_EVENTS_QUERY, STALE_FUTURE_EVENTS_QUERY, type EventsClient, type EventsTransaction, type SanityDoc } from '@/lib/events/upsert';

/**
 * An in-memory `EventsClient` for tests and `pnpm sync:events --dry-run`.
 * It answers exactly the two GROQ queries the sync issues and applies
 * transactions atomically, which is all the sync relies on.
 */
export type MemoryClient = EventsClient & {
  /** Live view of the store, keyed by `_id`. */
  docs: Map<string, SanityDoc>;
  /** Every query issued, for assertions. */
  queries: Array<{ query: string; params?: Record<string, unknown> }>;
  /** Number of committed transactions. */
  commits: number;
  /** Make the next `commit` fail, to test failure handling. */
  failNextCommit?: Error;
};

export function createMemoryClient(seed: SanityDoc[] = []): MemoryClient {
  const docs = new Map(seed.map((d) => [d._id, structuredClone(d)]));
  const client: MemoryClient = {
    docs,
    queries: [],
    commits: 0,
    async fetch(query, params) {
      client.queries.push({ query, params });
      const ids = new Set(((params?.ids as string[] | undefined) ?? []).map(String));
      if (query === EXISTING_EVENTS_QUERY) {
        return [...docs.values()].filter((d) => d._type === 'event' && ids.has(d._id)).map((d) => structuredClone(d));
      }
      if (query === STALE_FUTURE_EVENTS_QUERY) {
        const now = Date.parse(String(params?.now));
        const cutoff = Date.parse(String(params?.cutoff));
        return [...docs.values()]
          .filter((d) => d._type === 'event' && d.source === 'facebook' && d.cancelled !== true && !ids.has(d._id))
          .filter((d) => Date.parse(String(d.start)) > now)
          .filter((d) => d.lastSeenAt == null || Date.parse(String(d.lastSeenAt)) < cutoff)
          .map((d) => ({ _id: d._id, title: d.title }));
      }
      throw new Error(`Memory client does not understand this query: ${query}`);
    },
    transaction() {
      const ops: Array<(store: Map<string, SanityDoc>) => void> = [];
      const tx: EventsTransaction = {
        createOrReplace(doc) {
          ops.push((store) => store.set(doc._id, structuredClone(doc)));
          return tx;
        },
        patch(id, { set }) {
          ops.push((store) => {
            const current = store.get(id);
            if (!current) throw new Error(`Cannot patch missing document ${id}`);
            store.set(id, { ...current, ...structuredClone(set) });
          });
          return tx;
        },
        async commit() {
          if (client.failNextCommit) {
            const err = client.failNextCommit;
            client.failNextCommit = undefined;
            throw err;
          }
          // Apply to a copy first so a failing patch leaves the store untouched.
          const next = new Map([...docs].map(([k, v]) => [k, structuredClone(v)]));
          for (const op of ops) op(next);
          docs.clear();
          for (const [k, v] of next) docs.set(k, v);
          client.commits += 1;
          return { transactionId: `tx-${client.commits}`, results: ops.map((_, i) => ({ id: String(i), operation: 'update' })) };
        },
      };
      return tx;
    },
    async createOrReplace(doc) {
      docs.set(doc._id, structuredClone(doc));
      return doc;
    },
  };
  return client;
}
