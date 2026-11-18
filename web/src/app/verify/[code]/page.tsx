import type {Metadata} from 'next';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {Footer} from '@/components/Footer';
import {ApiError, apiGet} from '@/lib/api';

export const metadata: Metadata = {title: 'Verify a certificate', description: 'Check that a yizelearn certificate is genuine.'};

type Verification = {
  code: string;
  valid: boolean;
  status: string;
  learnerName: string;
  courseTitle: string;
  issuedAt: string;
  issuer: string;
};

const CODE = /^CERT-[0-9]{4,}$/;

async function lookup(code: string): Promise<{state: 'ok'; data: Verification} | {state: 'notfound' | 'unavailable'}> {
  try {
    const data = await apiGet<Verification>(`/certificates/verify/${encodeURIComponent(code)}`);
    return {state: 'ok', data};
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      // 404 also covers "the server does not have this route yet", so only report it as not found when the code is well formed.
      return {state: 'notfound'};
    }
    return {state: 'unavailable'};
  }
}

export default async function VerifyPage({params}: {params: Promise<{code: string}>}) {
  const {code: raw} = await params;
  const code = raw.trim().toUpperCase();
  const wellFormed = CODE.test(code);
  const result = wellFormed ? await lookup(code) : {state: 'notfound' as const};

  return <>
    <OfferBar />
    <SiteNav />
    <main className="verify">
      <h1>Verify a certificate</h1>
      {result.state === 'ok' && result.data.valid && (
        <section className="verdict ok" aria-live="polite">
          <p className="tag">Valid certificate</p>
          <p className="learner">{result.data.learnerName}</p>
          <p>has completed <strong>{result.data.courseTitle}</strong></p>
          <dl>
            <dt>Certificate no</dt><dd>{result.data.code}</dd>
            <dt>Issued</dt><dd>{new Date(result.data.issuedAt).toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'})}</dd>
            <dt>Issued by</dt><dd>{result.data.issuer}</dd>
          </dl>
        </section>
      )}
      {result.state === 'ok' && !result.data.valid && (
        <section className="verdict bad" aria-live="polite">
          <p className="tag">This certificate is no longer valid</p>
          <p>Certificate {result.data.code} has status &ldquo;{result.data.status}&rdquo;. Contact yizelearn if you think this is a mistake.</p>
        </section>
      )}
      {result.state === 'notfound' && (
        <section className="verdict bad" aria-live="polite">
          <p className="tag">Certificate not found</p>
          <p>We could not find a certificate with that number. Check the code printed on the certificate and try again.</p>
        </section>
      )}
      {result.state === 'unavailable' && (
        <section className="verdict" aria-live="polite">
          <p className="tag">Verification is not available right now</p>
          <p>We could not reach the certificate service. Please try again in a few minutes.</p>
        </section>
      )}
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
