import type {Metadata} from 'next';
import {redirect} from 'next/navigation';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {Footer} from '@/components/Footer';

export const metadata: Metadata = {title: 'Verify a certificate', description: 'Check that a yizelearn certificate is genuine.'};

/** /verify?code=CERT-... forwards to /verify/CERT-...; with no code it shows the lookup form. */
export default async function VerifyIndex({searchParams}: {searchParams: Promise<{code?: string}>}) {
  const {code} = await searchParams;
  const clean = (code ?? '').trim();
  if (clean) redirect(`/verify/${encodeURIComponent(clean)}`);

  return <>
    <OfferBar />
    <SiteNav />
    <main className="verify">
      <h1>Verify a certificate</h1>
      <p className="form-note">Enter the certificate number printed on the certificate to check that it is genuine.</p>
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
