import type {Metadata} from 'next';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {Footer} from '@/components/Footer';
import {LegalPage} from '@/components/Legal';
import {privacy} from '@/lib/legal';

export const metadata: Metadata = {title: 'Privacy Policy', description: 'How yizelearn collects, uses and protects your information.'};

export default function PrivacyPage() {
  return <>
    <OfferBar />
    <SiteNav />
    <LegalPage doc={privacy} />
    <Footer />
  </>;
}
