import type {Metadata, Viewport} from 'next';
import {Fraunces} from 'next/font/google';
import './globals.css';

// Serif for headlines, as in the reference design. Body text stays on the system font.
const serif = Fraunces({subsets: ['latin'], variable: '--font-serif', display: 'swap', axes: ['SOFT', 'opsz']});

export const metadata: Metadata = {
  title: {default: 'yizelearn: short, practical courses', template: '%s · yizelearn'},
  description: 'Short, practical courses with live classes and certificates.',
};

export const viewport: Viewport = {
  themeColor: [{media: '(prefers-color-scheme: light)', color: '#FDF8F1'}, {media: '(prefers-color-scheme: dark)', color: '#15171B'}],
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en" className={serif.variable}><body>{children}</body></html>;
}
