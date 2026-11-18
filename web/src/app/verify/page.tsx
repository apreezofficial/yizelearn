import {redirect} from 'next/navigation';

/** /verify?code=CERT-... forwards to the canonical /verify/CERT-... page. */
export default async function VerifyIndex({searchParams}: {searchParams: Promise<{code?: string}>}) {
  const {code} = await searchParams;
  const clean = (code ?? '').trim();
  if (clean) redirect(`/verify/${encodeURIComponent(clean)}`);
  redirect('/');
}
