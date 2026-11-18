import {pageMetadata} from '@/lib/metadata';
import {SiteNav} from '@/components/Chrome';import {Footer} from '@/components/Footer';import {GuideLibrary} from '@/components/GuideLibrary';import s from '@/components/PublicPages.module.css';export default function Guides(){return <><SiteNav/><main className={s.wrap}><section className={s.hero}><small>Guides</small><h1>A little guidance.<br/>A lot of possibility.</h1><p>Practical guides to help you start learning, share your achievements and teach what you know.</p></section><GuideLibrary/></main><Footer/></>}

export const metadata = pageMetadata("/guides");
