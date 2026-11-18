import type {Metadata, Viewport} from 'next';
import {siteUrl} from '@/lib/metadata';
import {Fredoka, Inter} from 'next/font/google';
import {CookieConsent} from '@/components/CookieConsent';
import {PrefsHost} from '@/components/FooterPrefs';
import {Help} from '@/components/Help';
import {Translator} from '@/components/Translator';
import './globals.css';

const sans = Inter({subsets: ['latin'], variable: '--font-sans', display: 'swap'});
// Rounded face closest to the logo's lettering, used for the big footer wordmark.
const logo = Fredoka({subsets: ['latin'], weight: ['600'], variable: '--font-logo', display: 'swap'});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {default: 'Learn practical skills. Build your next chapter. · yizelearn', template: '%s · yizelearn'},
  description: 'Build useful skills with practical online courses in tech, creativity and business on yizelearn.',
  applicationName: 'yizelearn',
  referrer: 'strict-origin-when-cross-origin',
};

export const viewport: Viewport = {
  themeColor: [{media: '(prefers-color-scheme: light)', color: '#FFFFFF'}, {media: '(prefers-color-scheme: dark)', color: '#0B1A2E'}],
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en" className={`${sans.variable} ${logo.variable}`}><body>{children}<Help /><CookieConsent /><PrefsHost /><Translator /></body></html>;
}
