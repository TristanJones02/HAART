const TZ = 'Australia/Perth';

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }): string {
  return new Intl.DateTimeFormat('en-AU', { timeZone: TZ, ...opts }).format(new Date(iso));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: amount % 1 === 0 ? 0 : 2 }).format(amount);
}
