import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  // Deployed separately from the website to keep it off the hosting bill.
  studioHost: process.env.SANITY_STUDIO_HOST ?? 'haart',
  autoUpdates: true,
});
