import {redirect} from 'next/navigation';
import type {Metadata} from 'next';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {Footer} from '@/components/Footer';
import {SUPPORT_EMAIL} from '@/lib/support';

export const metadata: Metadata = {title: 'Verify a certificate', description: 'Check that a yizelearn certificate is genuine.'};

/** /verify?code=CERT-... forwards to /verify/CERT-...; with no code it shows the lookup form. Certificate checks are not wired to the API yet. */
export default async function VerifyIndex({searchParams}: {searchParams: Promise<{code?: string}>}) {
  const {code} = await searchParams;
  const clean = (code ?? '').trim();
  if (clean) redirect(`/verify/${encodeURIComponent(clean)}`);

  return <>
    <OfferBar />
    <SiteNav />
    <main className="verify">
      <h1>Verify a certificate</h1>
      <section className="verdict" aria-live="polite">
        <p className="tag">Certificate checking is not available yet</p>
        <p>If you need to confirm a certificate now, email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
      </section>
      <form className="lookup" action="/verify" method="get">
        <label htmlFor="code">Certificate number</label>
        <div>
          <input id="code" name="code" placeholder="CERT-0000000001" autoComplete="off" />
          <button type="submit">Check</button>
        </div>
      </form>
    </main>
    <Footer />
  </>;
}
