import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Habitaciones en Zúrich para Migrantes | Alojamiento Verificado | Migrante Global',
  description:
    'Habitaciones amuebladas disponibles en Wetzikon (cantón de Zúrich) desde 1.150 CHF/mes. Acompañamiento en español: contrato, depósito y llegada sin riesgos. 200 CHF consultoría única.',
  keywords: [
    'habitaciones en Zúrich',
    'alojamiento en Suiza para migrantes',
    'habitación amueblada Wetzikon',
    'alquilar habitación Suiza',
    'vivienda para migrantes latinoamericanos Suiza',
    'contrato de alquiler suizo español',
    'depósito de garantía Suiza Kaution',
    'WG Zimmer Zürich hispanohablantes',
    'piso compartido Suiza migrantes',
  ],
  alternates: {
    canonical: 'https://migranteglobal.ch/servicios/alojamiento',
  },
  openGraph: {
    title: 'Habitaciones en Zúrich para Migrantes | Desde 1.150 CHF/mes',
    description:
      'Habitaciones amuebladas en Wetzikon con acompañamiento en español: revisión de contrato, guía del proceso y soporte 30 días. 200 CHF consultoría única.',
    url: 'https://migranteglobal.ch/servicios/alojamiento',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Habitación amueblada en Zúrich para migrantes',
      },
    ],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Consultoría de Alojamiento en Suiza',
  description:
    'Acompañamiento para encontrar y gestionar habitaciones amuebladas en Zúrich. Revisión de contratos, orientación sobre depósitos y soporte en español.',
  provider: {
    '@type': 'Person',
    name: 'Kevin García',
    url: 'https://migranteglobal.ch',
  },
  areaServed: {
    '@type': 'Place',
    name: 'Cantón de Zúrich, Suiza',
  },
  offers: {
    '@type': 'Offer',
    price: '200',
    priceCurrency: 'CHF',
    description: 'Consultoría de acompañamiento · pago único',
  },
  serviceType: 'Consultoría de alojamiento para migrantes',
  availableLanguage: { '@type': 'Language', name: 'Spanish' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
