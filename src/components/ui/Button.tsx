import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { Quad } from '@/components/art/Quad';

/**
 * Square, quad-prefixed, no radius, no shadow. The old bordered `secondary`
 * variant is retired in favour of `RuleLink`, which is the secondary call to
 * action everywhere on the site.
 *
 * `ink` is the variant for a button sitting on an ink band: a cream hairline
 * box rather than red, because red-600 on ink measures 2.33:1.
 */
type Variant = 'primary' | 'ink';
type Size = 'md' | 'lg';

type BaseProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
  className?: string;
  /** The printer's quad before the label. On by default for primary. */
  quad?: boolean;
};

type AnchorProps = BaseProps & { href: string; external?: boolean } & Omit<ComponentProps<'a'>, 'href' | 'children' | 'className'>;
type ButtonProps = BaseProps & { href?: undefined } & Omit<ComponentProps<'button'>, 'children' | 'className'>;

export type ButtonLikeProps = AnchorProps | ButtonProps;

const base =
  'inline-flex items-center justify-center gap-2.5 rounded-none border font-display font-extrabold leading-none whitespace-nowrap select-none transition-colors duration-150 ease-standard disabled:cursor-not-allowed disabled:opacity-60 motion-safe:active:translate-y-px';

const variants: Record<Variant, string> = {
  primary: 'border-transparent bg-red-600 text-paper-0 hover:bg-red-700',
  ink: 'border-sand-100 bg-transparent text-sand-100 hover:bg-sand-100 hover:text-ink-950',
};

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-[1rem]',
  lg: 'h-13 px-7 text-[1.125rem]',
};

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className = '') {
  return [base, variants[variant], sizes[size], className].filter(Boolean).join(' ');
}

export function Button(props: ButtonLikeProps) {
  const { variant = 'primary', size = 'md', loading, children, className = '', quad = true, ...rest } = props;
  const classes = buttonClasses(variant, size, className);
  const content = (
    <>
      {quad ? <Quad className={variant === 'primary' ? '!bg-paper-0' : '!bg-sand-100'} /> : null}
      <span>{children}</span>
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
