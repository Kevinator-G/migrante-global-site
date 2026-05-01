import type { Metadata } from 'next';
import './globals.css';
import MigranteChat from "@/components/migranteChat";
import { WhatsappFlotante } from '@/components/whatsapp-flotante';
import { CookieBanner } from '@/components/cookie-banner';
import { GaScript } from '@/components/ga-script';
import { Providers } from './providers';
import { Inter, Outfit } from 'next/font/google';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

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
  metadataBase: new URL('https://migranteglobal.ch'),
  title: 'Migrante Global | Asesoría de Migración a Suiza para Hispanohablantes',
  description:
    'Orientación profesional y honesta para emigrar a Suiza. Ayudamos a hispanohablantes con trámites, empleo, alojamiento, CV suizo y adaptación. Más de 150 personas acompañadas. Sin promesas falsas.',
  keywords: [
    'migración a Suiza',
    'emigrar a Suiza hispanohablantes',
    'cómo migrar a Suiza desde latinoamérica',
    'asesoría migración Suiza',
    'trabajo en Suiza para latinoamericanos',
    'visa Suiza latinoamericanos',
    'trámites migración Suiza',
    'alojamiento Suiza migrantes',
    'CV formato suizo',
    'permiso de trabajo Suiza',
    'consultoría migración Europa',
    'orientación laboral Suiza en español',
    'emigrar a Suiza desde Argentina',
    'emigrar a Suiza desde Colombia',
    'emigrar a Suiza desde México',
    'Migrante Global Kevin',
  ],
  authors: [{ name: 'Kevin García — Migrante Global', url: 'https://migranteglobal.ch' }],
  creator: 'Kevin García',
  alternates: {
    canonical: 'https://migranteglobal.ch',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Migrante Global | Tu camino a Suiza empieza aquí',
    description:
      'Acompañamiento real para hispanohablantes que quieren emigrar a Suiza. Orientación laboral, trámites, alojamiento y comunidad de apoyo. Más de 150 personas acompañadas.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Migrante Global — Asesoría de migración a Suiza' }],
    type: 'website',
    locale: 'es_ES',
    siteName: 'Migrante Global',
    url: 'https://migranteglobal.ch',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Migrante Global | Migración a Suiza para hispanohablantes',
    description:
      'Orientación honesta para emigrar a Suiza. +150 personas acompañadas. Sin promesas falsas.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const faqs = [
  {
    pregunta: '¿Necesito hablar alemán para trabajar en Suiza?',
    respuesta:
      'Depende del sector. En hostelería, construcción, logística y algunos trabajos técnicos puedes empezar sin alemán. Para oficina, salud o educación necesitas mínimo A2-B1. Lo primero que hacemos contigo es identificar tu sector y qué nivel real necesitas.',
  },
  {
    pregunta: '¿Cuánto tiempo tarda conseguir trabajo desde fuera de Suiza?',
    respuesta:
      'El proceso realista es 2–6 meses desde que empiezas a buscar en serio. Factores clave: tu profesión, nivel de alemán, red de contactos y si tienes el CV adaptado al formato suizo. Con orientación correcta se acorta bastante.',
  },
  {
    pregunta: '¿Qué permiso de residencia necesito para trabajar en Suiza?',
    respuesta:
      'Los ciudadanos de la UE/AELC tienen acceso simplificado mediante el Acuerdo de Libre Circulación. Si tienes contrato de trabajo, el permiso B (residencia temporal) se tramita en la oficina de migración de tu cantón. Para no comunitarios el proceso es más complejo.',
  },
  {
    pregunta: '¿Cuánto cuesta vivir en Suiza?',
    respuesta:
      'Un soltero en Zúrich necesita entre 2.500 y 3.500 CHF/mes para vivir cómodamente (alquiler, comida, transporte, seguros). El salario mínimo sectorial suele superar los 3.500–4.500 CHF, así que la ecuación funciona si tienes trabajo.',
  },
  {
    pregunta: '¿Puedo contratar vuestros servicios desde Latinoamérica?',
    respuesta:
      'Sí, todos nuestros servicios son 100% remotos. Trabajamos con personas desde España, México, Colombia, Argentina y el resto de Latinoamérica. Las sesiones son por videollamada y los documentos se revisan online.',
  },
  {
    pregunta: '¿Qué diferencia a Migrante Global de otras asesorías?',
    respuesta:
      'No somos una agencia — soy Kevin, una persona real que vivió el proceso. Llevo más de 10 años en Europa y 3 en Suiza. No te vendo un sueño: te doy orientación honesta, incluyendo cuándo Suiza no es la mejor opción para tu caso.',
  },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Migrante Global',
    description:
      'Servicio de orientación y acompañamiento para hispanohablantes que desean emigrar a Suiza. Asesoría en trámites, empleo, alojamiento y adaptación cultural.',
    url: 'https://migranteglobal.ch',
    logo: 'https://migranteglobal.ch/favicon.svg',
    serviceType: 'Consultoría de Migración',
    areaServed: [
      { '@type': 'Country', name: 'Suiza' },
      { '@type': 'Country', name: 'España' },
      { '@type': 'Country', name: 'México' },
      { '@type': 'Country', name: 'Argentina' },
      { '@type': 'Country', name: 'Colombia' },
    ],
    availableLanguage: { '@type': 'Language', name: 'Spanish' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Zúrich',
      addressCountry: 'CH',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+41772337353',
      contactType: 'customer service',
      availableLanguage: 'Spanish',
    },
    sameAs: [
      'https://www.youtube.com/@migranteglobal',
      'https://www.instagram.com/kevin.migranteglobal/',
      'https://linkedin.com/company/migranteglobal',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Kevin García',
    jobTitle: 'Consultor de Migración',
    description:
      'Fundador de Migrante Global. Más de 10 años recorriendo Europa y 3+ años viviendo y trabajando en Suiza. Especialista en orientación para hispanohablantes que desean emigrar a Suiza.',
    url: 'https://migranteglobal.ch',
    worksFor: { '@type': 'Organization', name: 'Migrante Global' },
    sameAs: [
      'https://www.youtube.com/@migranteglobal',
      'https://www.instagram.com/kevin.migranteglobal/',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.pregunta,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.respuesta,
      },
    })),
  },
];

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
        <WhatsappFlotante />
        {/* GA4 — solo carga tras consentimiento explícito del usuario */}
        {GA_ID && <GaScript gaId={GA_ID} />}
      </body>
    </html>
  );
}
