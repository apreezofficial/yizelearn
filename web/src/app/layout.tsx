import type {Metadata, Viewport} from 'next';
import {Fredoka, Inter} from 'next/font/google';
import {Help} from '@/components/Help';
import './globals.css';

const sans = Inter({subsets: ['latin'], variable: '--font-sans', display: 'swap'});
// Rounded face closest to the logo's lettering, used for the big footer wordmark.
const logo = Fredoka({subsets: ['latin'], weight: ['600'], variable: '--font-logo', display: 'swap'});

export const metadata: Metadata = {
  title: {default: 'yizelearn: learn the skills that grow your career', template: '%s · yizelearn'},
  description: 'Short, practical courses with live classes and certificates.',
};

export const viewport: Viewport = {
  themeColor: [{media: '(prefers-color-scheme: light)', color: '#FFFFFF'}, {media: '(prefers-color-scheme: dark)', color: '#0B1A2E'}],
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en" className={`${sans.variable} ${logo.variable}`}><body>{children}<Help /></body></html>;
}
