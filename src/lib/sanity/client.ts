import { createClient, type SanityClient } from '@sanity/client';
import { env } from '@/lib/env';

/**
 * Sanity clients. Both return null when the project is not configured so
 * callers can fall back to mock content instead of throwing. Never import
 * the write client from a client component.
 */
let readClient: SanityClient | null | undefined;
let writeClient: SanityClient | null | undefined;

export function getReadClient(): SanityClient | null {
  if (readClient !== undefined) return readClient;
  if (!env.sanity.projectId) return (readClient = null);
  readClient = createClient({
    projectId: env.sanity.projectId,
    dataset: env.sanity.dataset,
    apiVersion: env.sanity.apiVersion,
    useCdn: env.isProduction,
    token: env.sanity.readToken,
    perspective: 'published',
  });
  return readClient;
}

export function getWriteClient(): SanityClient | null {
  if (writeClient !== undefined) return writeClient;
  if (!env.sanity.projectId || !env.sanity.writeToken) return (writeClient = null);
  writeClient = createClient({
    projectId: env.sanity.projectId,
    dataset: env.sanity.dataset,
    apiVersion: env.sanity.apiVersion,
    useCdn: false,
    token: env.sanity.writeToken,
  });
  return writeClient;
}

/** Identity tag so GROQ strings get syntax highlighting without importing `groq`. */
export const groq = (strings: TemplateStringsArray, ...values: unknown[]) =>
  strings.reduce((acc, s, i) => acc + s + (i < values.length ? String(values[i]) : ''), '');

/** Deterministic document id from a stable key (event UID, HAART ID), safe for Sanity ids. */
export function stableId(prefix: string, key: string): string {
  const safe = key.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 100);
  return `${prefix}-${safe || 'x'}`;
}
