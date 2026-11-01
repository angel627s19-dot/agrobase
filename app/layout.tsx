import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { TopProgressBar } from '@/components/layout/TopProgressBar';
import { SITE_CONFIG } from '@/lib/constants';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Agro Base | Complete Agricultural & Plumbing Solutions',
    template: '%s | Agro Base',
  },
  description: SITE_CONFIG.description || 'Quality pipes, fittings, irrigation products and hardware for farms, businesses and everyday projects.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} scroll-smooth`}>
      <body className="font-body text-brand-dark antialiased min-h-screen flex flex-col selection:bg-brand-green-700 selection:text-white">
        <TopProgressBar />
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
