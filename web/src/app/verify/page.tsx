import {Suspense} from 'react';
import {redirect} from 'next/navigation';
import {SiteNav} from '@/components/Chrome';
import {Footer} from '@/components/Footer';
import {CertificateLookup} from '@/components/CertificatePublic';
import s from '@/components/PublicPages.module.css';
async function Lookup({searchParams}:{searchParams:Promise<{code?:string}>}){const{code}=await searchParams;if(code?.trim())redirect('/verify/'+encodeURIComponent(code.trim().toUpperCase()));return <CertificateLookup/>}
export default function Page({searchParams}:{searchParams:Promise<{code?:string}>}){return <><SiteNav/><main className={s.wrap}><Suspense fallback={<p>Loading certificate lookup…</p>}><Lookup searchParams={searchParams}/></Suspense></main><Footer/></>}
