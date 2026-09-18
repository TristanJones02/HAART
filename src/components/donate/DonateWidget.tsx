'use client';

import { useId, useState, useSyncExternalStore } from 'react';
import type { SiteSettings } from '@/lib/content/types';

type Frequency = 'once' | 'monthly';

const noopSubscribe = () => () => {};
/** ?frequency=monthly from a campaign link, read after hydration; null on the server. */
const readUrlFrequency = (): Frequency | null => {
  const f = new URLSearchParams(window.location.search).get('frequency');
  return f === 'monthly' || f === 'once' ? f : null;
};

/*
 * The widget is the lit object: paper-0 whatever canvas it sits on, inside a
 * 2px charcoal box. Every control is square; only the custom-amount field
 * keeps the 6px radius, so a form still reads as a form.
 */
const CONTROL = 'border transition-colors duration-150';
const ON = 'border-red-600 bg-red-600 text-paper-0';
const OFF = 'border-charcoal-900 bg-paper-0 text-charcoal-900 hover:bg-paper-100';

/**
 * Amount presets and a one-off / monthly choice with equal weight. Nothing is
 * preselected on first load unless a campaign link asks for it.
 *
 * **Non-functional by constraint.** This is a concept rebuild of someone
 * else's charity: it must never be able to take a person's money. There is no
 * payment provider, no payment link, no redirect and no card field anywhere in
 * this component — the settings still carry link fields, and this deliberately
 * does not read them. The submit control is permanently disabled and says why.
 *
 * The controls above it stay live so the interaction can still be judged, and
 * so the day this becomes a real site the only change is a link and a button.
 */
export function DonateWidget({ amounts }: { amounts: number[]; links?: SiteSettings['donate'] }) {
  const id = useId();
  const urlFrequency = useSyncExternalStore(noopSubscribe, readUrlFrequency, () => null);
  const [chosenFrequency, setFrequency] = useState<Frequency | null>(null);
  const frequency = chosenFrequency ?? urlFrequency;
  const [amount, setAmount] = useState<number | null>(null);
  const [custom, setCustom] = useState('');

  const chosen = amount ?? (custom ? Number(custom) : null);

  const freqBtn = (f: Frequency, label: string, sub: string) => (
    <button key={f} type="button" role="radio" aria-checked={frequency === f} onClick={() => setFrequency(f)} className={`flex flex-1 flex-col items-start px-4 py-3 text-left ${CONTROL} ${frequency === f ? ON : OFF}`}>
      <span className="font-display text-[1.125rem] font-extrabold leading-tight">{label}</span>
      <span className={`mt-1 text-small ${frequency === f ? 'text-paper-0' : 'text-charcoal-550'}`}>{sub}</span>
    </button>
  );

  return (
    <form className="border-2 border-charcoal-900 bg-paper-0 p-5 text-charcoal-900 sm:p-7" onSubmit={(e) => e.preventDefault()} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="text-feature">
        Choose your gift
      </h2>

      <div role="radiogroup" aria-label="How often" className="mt-5 flex gap-3">
        {freqBtn('once', 'One-off', 'A single gift today')}
        {freqBtn('monthly', 'Monthly', 'Keeps a foster place open')}
      </div>

      <fieldset className="mt-6">
        <legend className="text-rubric uppercase text-charcoal-700">Amount</legend>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
              className={`h-12 font-display text-[1.25rem] font-extrabold tabular-nums ${CONTROL} ${amount === a ? ON : OFF}`}
            >
              ${a}
            </button>
          ))}
        </div>
        <label className="mt-4 block">
          <span className="block text-rubric uppercase text-charcoal-700">Or another amount</span>
          <span className="mt-2 flex h-12 items-center rounded-control border border-charcoal-900 bg-paper-0 px-3 focus-within:border-charcoal-700">
            <span aria-hidden="true" className="font-display text-[1.125rem] font-bold text-charcoal-550">
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
              className="ml-2 h-full w-full bg-transparent font-display text-[1.125rem] font-bold tabular-nums text-charcoal-900 outline-none"
              placeholder="0"
            />
          </span>
        </label>
      </fieldset>

      <div className="mt-7">
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="flex min-h-[52px] w-full cursor-not-allowed items-center justify-center border border-charcoal-300 bg-paper-100 px-6 font-body text-[1.1875rem] font-semibold leading-tight text-charcoal-700"
        >
          {chosen ? `Donate $${chosen}${frequency === 'monthly' ? ' a month' : ''}` : frequency ? 'Choose an amount' : 'Choose one-off or monthly'}
        </button>
        <p className="mt-4 border border-charcoal-300 bg-paper-100 p-4 text-small text-charcoal-900" role="status">
          <strong className="font-semibold">Donations are switched off in this concept build.</strong>{' '}
          Nothing here can take a payment, and this site is not connected to HAART. To give to the rescue, go to their own website or their Facebook page.
        </p>
      </div>
    </form>
  );
}
