import type { Metadata } from 'next';
import { Inter, Source_Serif_4, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CaseProvider } from '@/context/CaseContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'CaseIntel — Analisis & Pemetaan Perkara Pidana (Gelar Perkara)',
  description:
    'Sistem analisis dan pemetaan perkara pidana terstruktur untuk Advokat, Penyidik, dan Jaksa: graph relasi intelijen, skor kekuatan berkas, kalkulator yurisdiksi, daluwarsa, dan audit formil praperadilan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen font-sans bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
        <AuthProvider>
          <CaseProvider>{children}</CaseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
