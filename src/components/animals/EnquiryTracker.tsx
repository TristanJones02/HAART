'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

/** Counts a profile view as the top of the adoption funnel (the enquiry itself is tracked on form submit). */
export function EnquiryTracker({ animal }: { animal: string }) {
  useEffect(() => {
    track('animal_viewed', { animal });
  }, [animal]);
  return null;
}
