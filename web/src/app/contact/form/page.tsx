import type {Metadata} from 'next';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {Footer} from '@/components/Footer';
import {SupportForm} from '@/components/SupportForm';

export const metadata: Metadata = {title: 'Support form', description: 'Send a message to the yizelearn support team.'};

export default function ContactFormPage() {
  return <>
    <OfferBar />
    <SiteNav />
    <main className="contact">
      <section className="contact-hero compact">
        <div>
          <p className="eyebrow">Support form</p>
          <h1>Tell us what happened</h1>
          <p className="lead">Fill in the details below. We will open an email to our team with your message already written.</p>
        </div>
      </section>
      <SupportForm />
    </main>
    <Footer />
  </>;
}
