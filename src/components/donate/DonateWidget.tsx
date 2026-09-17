'use client';

import { useId, useState, useSyncExternalStore } from 'react';
import type { SiteSettings } from '@/lib/content/types';
import { track } from '@/lib/analytics';
import { UiIcon } from '@/components/ui/Icon';

type Frequency = 'once' | 'monthly';

const noopSubscribe = () => () => {};
/** ?frequency=monthly from a campaign link, read after hydration; null on the server. */
const readUrlFrequency = (): Frequency | null => {
  const f = new URLSearchParams(window.location.search).get('frequency');
  return f === 'monthly' || f === 'once' ? f : null;
};

/**
 * Amount presets and a one-off / monthly choice with equal weight. Nothing is
 * preselected on first load unless a campaign link asks for it. The cover-fees
 * option swaps to the grossed-up payment link; if that link does not exist,
 * the option is not shown. A missing link never renders a dead button.
 */
export function DonateWidget({ amounts, links }: { amounts: number[]; links: SiteSettings['donate'] }) {
  const id = useId();
  const urlFrequency = useSyncExternalStore(noopSubscribe, readUrlFrequency, () => null);
  const [chosenFrequency, setFrequency] = useState<Frequency | null>(null);
  const frequency = chosenFrequency ?? urlFrequency;
  const [amount, setAmount] = useState<number | null>(null);
  const [custom, setCustom] = useState('');
  const [coverFees, setCoverFees] = useState(false);

  const canCover = frequency === 'once' ? !!links.oneOffCoverFeesLink : frequency === 'monthly' ? !!links.monthlyCoverFeesLink : false;
  const baseLink = frequency === 'once' ? links.oneOffLink : frequency === 'monthly' ? links.monthlyLink : undefined;
  const feeLink = frequency === 'once' ? links.oneOffCoverFeesLink : links.monthlyCoverFeesLink;
  const link = coverFees && canCover ? feeLink : baseLink;
  const chosen = amount ?? (custom ? Number(custom) : null);
  const feePct = links.processingFeePercent ?? 1.75;
  const feeFixed = (links.processingFeeFixed ?? 30) / 100;
  const fee = chosen ? Math.round((chosen * (feePct / 100) + feeFixed) * 100) / 100 : null;

  const href = link && chosen ? `${link}${link.includes('?') ? '&' : '?'}${new URLSearchParams({ prefilled_amount: String(Math.round(chosen * 100)), utm_source: 'website', utm_medium: 'donate_page' })}` : null;

  const freqBtn = (f: Frequency, label: string, sub: string) => (
    <button
      type="button"
      role="radio"
      aria-checked={frequency === f}
      onClick={() => setFrequency(f)}
      className={`flex flex-1 flex-col items-start rounded-control border px-4 py-3 text-left transition-colors duration-150 ${frequency === f ? 'border-red-600 bg-red-50' : 'border-border bg-paper-0 hover:border-charcoal-700'}`}
    >
      <span className="font-display text-lead font-bold text-charcoal-900">{label}</span>
      <span className="text-small text-charcoal-550">{sub}</span>
    </button>
  );

  return (
    <form className="rounded-card border border-border bg-paper-0 p-5 shadow-card sm:p-6" onSubmit={(e) => e.preventDefault()} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="text-h3">
        Choose your gift
      </h2>

      <div role="radiogroup" aria-label="How often" className="mt-4 flex gap-3">
        {freqBtn('once', 'One-off', 'A single gift today')}
        {freqBtn('monthly', 'Monthly', 'Keeps a foster place open')}
      </div>

      <fieldset className="mt-5">
        <legend className="text-small font-semibold text-charcoal-700">Amount</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {amounts.map((a) => (
            <button
              key={a}
              type="button"
              role="radio"
              aria-checked={amount === a}
              onClick={() => {
                setAmount(a);
                setCustom('');
              }}
              className={`h-12 rounded-control border font-display text-lead font-bold transition-colors duration-150 ${amount === a ? 'border-red-600 bg-red-50 text-red-700' : 'border-border bg-paper-0 text-charcoal-900 hover:border-charcoal-700'}`}
            >
              ${a}
            </button>
          ))}
        </div>
        <label className="mt-3 block text-small font-semibold text-charcoal-700">
          Or another amount
          <span className="mt-1 flex h-12 items-center rounded-control border border-border bg-paper-0 px-3 focus-within:border-charcoal-700">
            <span aria-hidden="true" className="text-charcoal-550">
              $
            </span>
            <input
              type="number"
              inputMode="decimal"
              min={2}
              step={1}
              value={custom}
              onChange={(e) => {
                setCustom(e.target.value);
                setAmount(null);
              }}
              className="ml-1 h-full w-full bg-transparent text-body font-normal text-charcoal-900 outline-none"
              placeholder="0"
            />
          </span>
        </label>
      </fieldset>

      {canCover ? (
        <label className="mt-5 flex items-start gap-3 text-body">
          <input type="checkbox" className="mt-1 size-5 accent-red-600" checked={coverFees} onChange={(e) => setCoverFees(e.target.checked)} />
          <span>
            Add {fee ? `$${fee.toFixed(2)}` : 'the processing fee'} so HAART receives the full amount
            <span className="block text-small text-charcoal-550">Card processing costs about {feePct}% plus {Math.round(feeFixed * 100)} cents. Optional.</span>
          </span>
        </label>
      ) : null}

      <div className="mt-6">
        {!baseLink ? (
          <div className="rounded-control border border-border bg-paper-100 p-4 text-body text-charcoal-700" role="status">
            <p className="font-semibold text-charcoal-900">Online donations are being set up.</p>
            <p className="mt-1">Bank transfer details are below, or email info@haart.org.au and we will help.</p>
          </div>
        ) : href ? (
          <a
            href={href}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-control bg-red-600 px-6 font-body text-lead font-semibold text-paper-0 hover:bg-red-700"
            onClick={() => track('donation_started', { frequency: frequency ?? 'unset', amount: chosen ?? 0, coverFees })}
          >
            Donate ${chosen}
            {frequency === 'monthly' ? ' a month' : ''}
            <UiIcon name="ArrowRight" size={20} />
          </a>
        ) : (
          <button type="button" disabled className="inline-flex h-12 w-full items-center justify-center rounded-control bg-red-600 px-6 text-lead font-semibold text-paper-0 opacity-60" aria-disabled="true">
            {frequency ? 'Choose an amount' : 'Choose one-off or monthly'}
          </button>
        )}
        <p className="mt-3 text-small text-charcoal-550">You will finish on a secure Stripe page. No account needed. Monthly gifts can be stopped any time.</p>
      </div>
    </form>
  );
}
