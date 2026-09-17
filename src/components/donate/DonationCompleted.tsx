'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

/** Fires the completed-donation event once when Stripe redirects back here. */
export function DonationCompleted() {
  useEffect(() => {
    track('donation_completed');
  }, []);
  return null;
}
