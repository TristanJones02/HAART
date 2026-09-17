import Link from 'next/link';
import { Container, Section } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <Section surface="paper-50">
      <Container className="max-w-prose py-12">
        <p className="mb-2 text-tiny uppercase tracking-caps text-red-600">Page not found</p>
        <h1 className="text-h1">That page has moved or never existed</h1>
        <p className="mt-4 text-lead text-charcoal-700">If you followed a link from Facebook or an old bookmark, the animal may have been adopted or the page renamed. Try one of these.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/adopt">Animals for adoption</Button>
          <Button href="/foster" variant="secondary">
            Fostering
          </Button>
          <Button href="/donate" variant="secondary">
            Donate
          </Button>
        </div>
        <p className="mt-8 text-small text-charcoal-550">
          Still stuck? <Link href="/contact" className="underline underline-offset-4 hover:text-red-600">Contact us</Link> and say which page you were after.
        </p>
      </Container>
    </Section>
  );
}
