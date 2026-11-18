import {pageMetadata} from '@/lib/metadata';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {Faq} from '@/components/Faq';
import {Footer} from '@/components/Footer';
import s from './faq.module.css';

export const metadata = pageMetadata("/faq");

export default function FaqPage() {
  return <div className={s.page}>
    <OfferBar />
    <SiteNav />
    <header className={s.head}>
      <div>
        <p className={s.kicker}>Help</p>
        <h1>Frequently asked questions</h1>
        <p className={s.sub}>Everything people ask before they pay, learn and teach on yizelearn.</p>
      </div>
    </header>
    <Faq page />
    <Footer />
  </div>;
}
