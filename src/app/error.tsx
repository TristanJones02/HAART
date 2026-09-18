'use client';

import { useEffect } from 'react';
import { Container, Section } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FolioBar, RuleLink } from '@/components/art';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section canvas="paper">
      <Container className="max-w-[62ch]">
        <FolioBar rubric="Something went wrong" />
        <h1 className="text-masthead-2">This page hit an error</h1>
        <p className="mt-6 text-deck italic text-[color:var(--text-muted)]">
          Reloading usually fixes it. If it keeps happening, email info@haart.org.au and mention which page you were on.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Button onClick={reset}>Try again</Button>
          <RuleLink href="/">Back to the home page</RuleLink>
        </div>
        {error.digest ? <p className="mt-10 text-catalogue uppercase text-[color:var(--text-caption)]">Reference {error.digest}</p> : null}
      </Container>
    </Section>
  );
}
