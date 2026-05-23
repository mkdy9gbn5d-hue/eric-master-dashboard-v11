import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GROK ORCHESTRATOR',
  description: 'Eric Schrader Master Dashboard v10',
  manifest: '/manifest.json',
  themeColor: '#0a0a0a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0a] text-white font-sans">{children}</body>
    </html>
  );
}
