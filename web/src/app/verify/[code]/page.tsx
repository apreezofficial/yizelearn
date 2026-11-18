import type {Metadata} from 'next';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {Footer} from '@/components/Footer';

export const metadata: Metadata = {title: 'Verify a certificate', description: 'Check that a yizelearn certificate is genuine.'};

const CODE = /^CERT-[0-9]{4,}$/;

/** Certificate checking is not wired to the API yet, so this page never calls it. */
export default async function VerifyPage({params}: {params: Promise<{code: string}>}) {
  const {code: raw} = await params;
  const code = raw.trim().toUpperCase();
  const wellFormed = CODE.test(code);

  return <>
    <OfferBar />
    <SiteNav />
    <main className="verify">
      <h1>Verify a certificate</h1>
      <form className="lookup" action="/verify" method="get">
        <label htmlFor="code">Certificate number</label>
        <div>
          <input id="code" name="code" placeholder="CERT-0000000001" defaultValue={code} autoComplete="off" />
          <button type="submit">Check</button>
        </div>
      </form>
    </main>
    <Footer />
  </>;
}
