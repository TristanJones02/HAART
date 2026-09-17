import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes, SINGLETON_TYPES, HIDDEN_FROM_CREATE } from './schemas';
import { structure } from './structure';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? '';
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';

if (!projectId) {
  // Surfaced in the terminal and the browser console; the Studio will not load without it.
  console.warn('SANITY_STUDIO_PROJECT_ID is not set. Copy studio/.env.example to studio/.env and fill it in.');
}

export default defineConfig({
  name: 'haart',
  title: 'HAART',
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: '2026-09-01' })],
  schema: {
    types: schemaTypes,
    // Keep the singleton and machine-written types out of the "create new" menu.
    templates: (templates) => templates.filter((t) => !HIDDEN_FROM_CREATE.has(t.schemaType)),
  },
  document: {
    // Singletons cannot be duplicated, deleted or unpublished.
    actions: (actions, context) =>
      SINGLETON_TYPES.has(context.schemaType) ? actions.filter((a) => !['duplicate', 'delete', 'unpublish'].includes(a.action ?? '')) : actions,
    newDocumentOptions: (prev, { creationContext }) => (creationContext.type === 'global' ? prev.filter((t) => !HIDDEN_FROM_CREATE.has(t.templateId)) : prev),
  },
});
