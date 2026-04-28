import type { Metadata } from 'next';
import './globals.css';
import MigranteChat from "@/components/migranteChat";
import { CookieBanner } from '@/components/cookie-banner';
import { Providers } from './providers';
import { Inter, Outfit } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://migranteglobal.com'),
  title: 'Migrante Global | Asesoría de Migración a Suiza para Hispanohablantes',
  description:
    'Orientación profesional y honesta para emigrar a Suiza. Ayudamos a hispanohablantes con trámites, empleo, alojamiento, CV suizo y adaptación. Sin promesas falsas.',
  keywords: [
    'migración a Suiza',
    'emigrar a Suiza',
    'cómo migrar a Suiza',
    'asesoría migración Suiza',
    'trabajo en Suiza hispanohablantes',
    'visa Suiza latinoamericanos',
    'trámites Suiza',
    'alojamiento Suiza migrantes',
    'CV formato suizo',
    'permiso trabajo Suiza',
    'migrante global',
    'orientación laboral Suiza',
    'consultoría migración Europa',
  ],
  authors: [{ name: 'Migrante Global' }],
  creator: 'Migrante Global',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Migrante Global | Tu camino a Suiza empieza aquí',
    description:
      'Acompañamiento profesional para hispanohablantes que quieren emigrar a Suiza. Orientación laboral, trámites, alojamiento y comunidad de apoyo.',
    images: ['/og-image.png'],
    type: 'website',
    locale: 'es_ES',
    siteName: 'Migrante Global',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Migrante Global | Migración a Suiza',
    description:
      'Orientación honesta para emigrar a Suiza. Sin promesas falsas.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Migrante Global',
  description:
    'Servicio de orientación y acompañamiento para hispanohablantes que desean emigrar a Suiza. Ofrecemos asesoría en trámites, empleo, alojamiento y adaptación cultural.',
  url: 'https://migranteglobal.com',
  serviceType: 'Consultoría de Migración',
  areaServed: {
    '@type': 'Country',
    name: 'Suiza',
  },
  availableLanguage: 'Spanish',
  priceRange: 'CHF 80 - CHF 1280',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '150',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className={`dark ${inter.variable} ${outfit.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>

        <MigranteChat />
        <CookieBanner />

      </body>
    </html>
  );
}
