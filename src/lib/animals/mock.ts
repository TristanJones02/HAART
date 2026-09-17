/**
 * Mock adapter: serves `MOCK_ANIMALS` in development and in tests. Never
 * used in production unless ALLOW_MOCK_CONTENT=true (see ./index.ts).
 */
import type { Animal } from '@/lib/content/types';
import { MOCK_ANIMALS } from '@/lib/mock/animals';
import { type AnimalFilters, type AnimalSource, applySourceFilters, normaliseHaartId, sortAnimals } from './types';

export type MockSourceOptions = {
  animals?: Animal[];
  /** Artificial latency so loading states can be seen. Default 0. */
  delayMs?: number;
};

const wait = (ms: number) => (ms > 0 ? new Promise<void>((resolve) => setTimeout(resolve, ms)) : Promise.resolve());

export function createMockSource(options: MockSourceOptions = {}): AnimalSource {
  const animals = options.animals ?? MOCK_ANIMALS;
  const delayMs = options.delayMs ?? 0;
  return {
    name: 'mock',
    async list(filters?: AnimalFilters) {
      await wait(delayMs);
      return applySourceFilters(sortAnimals(animals, 'newest'), filters);
    },
    async get(slug: string) {
      await wait(delayMs);
      return animals.find((a) => a.slug === slug) ?? null;
    },
    async getByHaartId(id: string) {
      await wait(delayMs);
      const wanted = normaliseHaartId(id);
      return animals.find((a) => a.haartId === wanted) ?? null;
    },
  };
}

export const mockSource: AnimalSource = createMockSource();
