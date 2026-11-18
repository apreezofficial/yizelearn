import type {Metadata} from 'next';
import Link from 'next/link';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {Footer} from '@/components/Footer';
import {SUPPORT_EMAIL} from '@/lib/support';

export const metadata: Metadata = {title: 'Contact us', description: 'Get help from the yizelearn support team.'};

const FAQ = [
  {q: 'How quickly will you reply?', a: 'We reply to every email within one working day. Messages sent on weekends are answered on the next working day.'},
  {q: 'What should I include?', a: 'Your account email, the course or order involved, what you expected to happen, and what actually happened. A screenshot helps.'},
  {q: 'Can I get a refund?', a: 'Refund requests are handled by the support team. Include the order number and the reason, and we will reply with the decision.'},
  {q: 'I have not received my certificate. What now?', a: 'Certificates are issued after a course is complete. Check your certificates page first, then send us the course name if it is still missing.'},
];

export default function ContactPage() {
  return <>
    <OfferBar />
    <SiteNav />
    <main className="contact">
      <section className="contact-hero">
        <div>
          <p className="eyebrow">Support</p>
          <h1>Get in touch</h1>
          <p className="lead">Stuck on a lesson, a payment or a certificate? Pick the route that suits you. A real person reads every message.</p>
        </div>
      </section>

      <section className="contact-cards" aria-label="Ways to reach us">
        <a className="contact-card" href={`mailto:${SUPPORT_EMAIL}`}>
          <span className="card-tag">Email</span>
          <h2>Write to us</h2>
          <p className="address">{SUPPORT_EMAIL}</p>
          <p>Send an email from your own mail app. We reply within one working day.</p>
        </a>
        <Link className="contact-card" href="/contact/form">
          <span className="card-tag">Form</span>
          <h2>Fill in the support form</h2>
          <p>Describe the problem on one page. It opens a ready-made email to our team with everything filled in.</p>
        </Link>
        <Link className="contact-card" href="/dashboard/support">
          <span className="card-tag">Signed in</span>
          <h2>Open a ticket</h2>
          <p>Log in to start a support ticket and follow every reply from your dashboard.</p>
        </Link>
      </section>

      <section className="contact-faq" aria-labelledby="faq-title">
        <h2 id="faq-title">Frequently asked questions</h2>
        {FAQ.map(item => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>
    </main>
    <Footer />
  </>;
}
