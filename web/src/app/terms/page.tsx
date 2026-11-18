import {pageMetadata} from '@/lib/metadata';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {Footer} from '@/components/Footer';
import {LegalPage} from '@/components/Legal';
import {terms} from '@/lib/legal';

export const metadata = pageMetadata("/terms");

export default function TermsPage() {
  return <>
    <OfferBar />
    <SiteNav />
    <LegalPage doc={terms} />
    <Footer />
  </>;
}
