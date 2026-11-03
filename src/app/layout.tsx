import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://therealciso.in'),
  title: {
    default: 'THEREALCISO | Cybersecurity Intelligence & Executive Risk Insights',
    template: '%s | THEREALCISO',
  },
  description:
    'The independent cybersecurity newsroom, threat intelligence journal, and risk leadership platform for CISOs, DPOs, and enterprise IT risk leaders in India.',
  keywords: [
    'CISO',
    'Cybersecurity India',
    'DPDP Act',
    'CERT-In',
    'Ransomware Defense',
    'Zero Trust',
    'BFSI Security',
    'Threat Intelligence',
    'Executive Risk',
  ],
  authors: [{ name: 'THEREALCISO Editorial Board' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'THEREALCISO',
    title: 'THEREALCISO | Cybersecurity Intelligence & Executive Risk Insights',
    description:
      'Independent cybersecurity news, threat intelligence, and executive risk analysis for CISOs in India.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@therealciso',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
