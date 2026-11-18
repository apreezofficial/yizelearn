import {pageMetadata} from '@/lib/metadata';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {Footer} from '@/components/Footer';
import {LegalPage} from '@/components/Legal';
import {privacy} from '@/lib/legal';

export const metadata = pageMetadata("/privacy");

export default function PrivacyPage() {
  return <>
    <OfferBar />
    <SiteNav />
    <LegalPage doc={privacy} />
    <Footer />
  </>;
}
