import type {Metadata} from 'next';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {Footer} from '@/components/Footer';
import {LegalPage} from '@/components/Legal';
import {terms} from '@/lib/legal';

export const metadata: Metadata = {title: 'Terms of Service', description: 'The terms for using yizelearn.'};

export default function TermsPage() {
  return <>
    <OfferBar />
    <SiteNav />
    <LegalPage doc={terms} />
    <Footer />
  </>;
}
