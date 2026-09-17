'use client';

import { useEffect } from 'react';
import { Container, Section } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <Section surface="paper-50">
      <Container className="max-w-prose py-12">
        <h1 className="text-h1">Something went wrong</h1>
        <p className="mt-4 text-lead text-charcoal-700">The page hit an error. Reloading usually fixes it. If it keeps happening, email info@haart.org.au and mention the page.</p>
        <div className="mt-8 flex gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button href="/" variant="secondary">
            Home
          </Button>
        </div>
        {error.digest ? <p className="mt-6 text-tiny text-charcoal-550">Reference {error.digest}</p> : null}
      </Container>
    </Section>
  );
}
