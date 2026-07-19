import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tour por Zúrich con Guía Local Latino | Migrante Global',
  description:
    'Descubre el Zúrich auténtico en un tour de 3 horas desde Letten hasta Zúrich-West. Guiado en español e inglés por un latino que vive aquí. 55 CHF por persona. Disponible en Airbnb y GetYourGuide.',
  keywords: [
    'tour Zúrich español',
    'guía turístico Zúrich latino',
    'tour Zúrich Airbnb Experience',
    'visita guiada Zúrich hispanohablantes',
    'tour Letten Zúrich',
    'GetYourGuide Zúrich tour',
    'qué hacer en Zúrich',
    'tour Zúrich río Limmat',
  ],
  alternates: {
    canonical: 'https://migranteglobal.ch/servicios/tour-zurich',
  },
  openGraph: {
    title: 'Tour por Zúrich con Guía Local Latino | 55 CHF · 3 horas',
    description:
      'El Zúrich real: Letten, el Limmat, Zúrich-West y un café local. Guiado en español o inglés por alguien que emigró y conoce la ciudad desde adentro.',
    url: 'https://migranteglobal.ch/servicios/tour-zurich',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Tour por Zúrich — vista del río Limmat',
      },
    ],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TouristAttraction',
  name: 'Hidden Zürich: Real Local Walk Along the Limmat',
  description:
    'Tour de 3 horas por Zúrich desde Letten hasta Zúrich-West. Guiado en español o inglés por un latino que vive en Suiza. Incluye café local.',
  url: 'https://migranteglobal.ch/servicios/tour-zurich',
  image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1200&q=80',
  touristType: ['Cultural', 'Local experience', 'Walking tour'],
  availableLanguage: [
    { '@type': 'Language', name: 'Spanish' },
    { '@type': 'Language', name: 'English' },
  ],
  offers: {
    '@type': 'Offer',
    price: '55',
    priceCurrency: 'CHF',
    availability: 'https://schema.org/InStock',
    description: '3 horas · 2–8 personas · café incluido',
  },
  location: {
    '@type': 'Place',
    name: 'Flussbad Oberer Letten',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Lettensteg',
      postalCode: '8037',
      addressLocality: 'Zürich',
      addressCountry: 'CH',
    },
  },
  provider: {
    '@type': 'Person',
    name: 'Kevin García',
    url: 'https://migranteglobal.ch',
    jobTitle: 'Local guide & migration consultant',
  },
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
