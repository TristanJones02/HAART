import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

type BaseProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
  className?: string;
  /** Leading or trailing icon; keep it decorative (aria-hidden). */
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
};

type AnchorProps = BaseProps & { href: string; external?: boolean } & Omit<ComponentProps<'a'>, 'href' | 'children' | 'className'>;
type ButtonProps = BaseProps & { href?: undefined } & Omit<ComponentProps<'button'>, 'children' | 'className'>;

export type ButtonLikeProps = AnchorProps | ButtonProps;

const base =
  'inline-flex items-center justify-center gap-2 rounded-control font-body font-semibold leading-none whitespace-nowrap select-none transition-[background-color,color,border-color,box-shadow] duration-150 ease-standard disabled:cursor-not-allowed disabled:opacity-60 motion-safe:active:translate-y-px';

const variants: Record<Variant, string> = {
  primary: 'bg-red-600 text-paper-0 hover:bg-red-700 border border-transparent',
  secondary: 'bg-paper-0 text-charcoal-900 border border-charcoal-300 hover:border-charcoal-700 hover:bg-paper-50',
  ghost: 'bg-transparent text-charcoal-900 border border-transparent hover:bg-paper-100 underline-offset-4 hover:underline',
};

const sizes: Record<Size, string> = {
  md: 'h-11 px-4 text-body',
  lg: 'h-12 px-6 text-lead',
};

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className = '') {
  return [base, variants[variant], sizes[size], className].filter(Boolean).join(' ');
}

export function Button(props: ButtonLikeProps) {
  const { variant = 'primary', size = 'md', loading, children, className = '', icon, iconPosition = 'end', ...rest } = props;
  const classes = buttonClasses(variant, size, className);
  const content = (
    <>
      {icon && iconPosition === 'start' ? <span aria-hidden="true" className="shrink-0">{icon}</span> : null}
      <span>{children}</span>
      {icon && iconPosition === 'end' ? <span aria-hidden="true" className="shrink-0">{icon}</span> : null}
    </>
  );

  if ('href' in rest && typeof rest.href === 'string') {
    const { href, external, ...anchorRest } = rest as AnchorProps;
    const isExternal = external ?? /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...anchorRest}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {content}
      </Link>
    );
  }

  const { type = 'button', disabled, ...buttonRest } = rest as ButtonProps;
  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...buttonRest}>
      {loading ? <span className="sr-only">Working</span> : null}
      {content}
    </button>
  );
}
