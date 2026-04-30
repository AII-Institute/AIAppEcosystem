import type { Metadata } from 'next';
import { Nunito, Fraunces } from 'next/font/google';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Teachly — Where kids, parents & teachers learn together',
  description:
    'Live classes, async activities, and a community that keeps families close — even when they're apart.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${fraunces.variable}`}>
      <body style={{ fontFamily: 'var(--font-nunito), sans-serif' }}>{children}</body>
    </html>
  );
}
