import type {Metadata, Viewport} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {default: 'yizelearn', template: '%s · yizelearn'},
  description: 'Short, practical courses with live classes and certificates.',
};

export const viewport: Viewport = {
  themeColor: [{media: '(prefers-color-scheme: light)', color: '#FDF8F1'}, {media: '(prefers-color-scheme: dark)', color: '#15171B'}],
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
