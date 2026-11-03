import type {Metadata, Viewport} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';

const sans = Inter({subsets: ['latin'], variable: '--font-sans', display: 'swap'});

export const metadata: Metadata = {
  title: {default: 'yizelearn: learn the skills that grow your career', template: '%s · yizelearn'},
  description: 'Short, practical courses with live classes and certificates.',
};

export const viewport: Viewport = {
  themeColor: [{media: '(prefers-color-scheme: light)', color: '#FFFFFF'}, {media: '(prefers-color-scheme: dark)', color: '#0B1A2E'}],
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en" className={sans.variable}><body>{children}</body></html>;
}
