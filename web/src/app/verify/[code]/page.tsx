import {pageMetadata} from '@/lib/metadata';
import {Suspense} from 'react';import {SiteNav} from '@/components/Chrome';import {Footer} from '@/components/Footer';import {CertificatePublic} from '@/components/CertificatePublic';import s from '@/components/PublicPages.module.css';
async function Detail({params}:{params:Promise<{code:string}>}){const{code}=await params;return <CertificatePublic code={code.trim().toUpperCase()}/>}
export default function Page({params}:{params:Promise<{code:string}>}){return <><SiteNav/><main className={s.wrap}><Suspense fallback={<p>Loading certificate…</p>}><Detail params={params}/></Suspense></main><Footer/></>}

export function generateStaticParams() {return [{code: 'DEMO'}];}
export async function generateMetadata({params}: {params: Promise<{code: string}>}) {
  const {code} = await params;
  return code.toUpperCase() === 'DEMO' ? pageMetadata('/verify/DEMO') : pageMetadata('/verify', {title: 'Certificate details', description: 'Look up the recipient, course and completion details associated with a yizelearn certificate.', noindex: true});
}
