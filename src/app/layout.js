import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from './ConditionalLayout';
import { LanguageProvider } from '@/contexts/LanguageContext';

export const metadata = {
  metadataBase: new URL('https://www.zybodybuilding.space'),
  title: {
    default: 'ZY Bodybuilding — Salle de Sport Mrezga & Nabeul | Gym Tunisie',
    template: '%s | ZY Bodybuilding Nabeul'
  },
  description: 'ZY Bodybuilding — la meilleure salle de sport à Mrezga, Nabeul. Musculation, fitness, cours collectifs et coaching personnalisé. Rejoignez-nous dès aujourd\'hui à Nabeul, Tunisie.',
  keywords: [
    'gym mrezga', 'gym nabeul', 'salle de sport mrezga', 'salle de sport nabeul',
    'fitness nabeul', 'musculation nabeul', 'salle de musculation nabeul',
    'meilleure salle de sport nabeul', 'fitness club nabeul', 'gym tunisie',
    'bodybuilding nabeul', 'coaching sportif nabeul', 'cours collectifs nabeul',
    'remise en forme nabeul', 'ZY Bodybuilding', 'salle de sport tunisie',
    'gym near me nabeul', 'personal trainer nabeul', 'fitness center nabeul',
    'sport nabeul', 'entraînement nabeul', 'abonnement salle de sport nabeul'
  ],
  authors: [{ name: 'ZY Bodybuilding' }],
  creator: 'Rayen Troudi',
  publisher: 'ZY Bodybuilding',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://www.zybodybuilding.space',
    languages: {
      'fr-TN': 'https://www.zybodybuilding.space',
      'en': 'https://www.zybodybuilding.space/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_TN',
    alternateLocale: 'en_US',
    url: 'https://www.zybodybuilding.space',
    title: 'ZY Bodybuilding — Salle de Sport Mrezga & Nabeul | Gym Tunisie',
    description: 'La meilleure salle de musculation et fitness à Mrezga, Nabeul. Programmes personnalisés, équipements modernes, coachs certifiés. Inscrivez-vous maintenant.',
    siteName: 'ZY Bodybuilding',
    images: [
      {
        url: 'https://www.zybodybuilding.space/images/og-gym-nabeul.jpg',
        width: 1200,
        height: 630,
        alt: 'ZY Bodybuilding — Salle de sport à Mrezga, Nabeul, Tunisie',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZY Bodybuilding — Gym Mrezga & Nabeul, Tunisie',
    description: 'La meilleure salle de sport à Nabeul. Musculation, fitness, coaching personnalisé à Mrezga, Tunisie.',
    images: ['https://www.zybodybuilding.space/images/og-gym-nabeul.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.png' },
      { url: '/images/logoNobg.png', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  // JSON-LD structured data for Google Search Console
  const jsonLdBusiness = {
      '@context': 'https://schema.org',
      '@type': ['HealthClub', 'LocalBusiness', 'SportsActivityLocation'],
      '@id': 'https://www.zybodybuilding.space/#gym',
      name: 'ZY Bodybuilding',
      alternateName: ['ZY Bodybuilding Nabeul', 'ZY Gym Mrezga', 'ZY Bodybuilding Mrezga'],
      description: 'Salle de musculation et fitness à Mrezga, Nabeul, Tunisie. Programmes personnalisés, cours collectifs, coaching certifié et équipements modernes.',
      url: 'https://www.zybodybuilding.space',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.zybodybuilding.space/images/logoNobg.png',
        width: 200,
        height: 200,
      },
      image: 'https://www.zybodybuilding.space/images/logoNobg.png',
      telephone: '+21658800554',
      email: 'zybodybuildingstudio@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Mrezga',
        addressLocality: 'Nabeul',
        addressRegion: 'Nabeul',
        postalCode: '8000',
        addressCountry: 'TN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 36.4272843,
        longitude: 10.673816,
      },
      hasMap: 'https://www.google.com/maps/place/ZY.bodybuilding/@36.4272886,10.6763909,17z',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '07:00',
          closes: '22:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '08:00',
          closes: '20:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Sunday',
          opens: '09:00',
          closes: '18:00',
        },
      ],
      priceRange: '$$',
      currenciesAccepted: 'TND',
      paymentAccepted: 'Cash, Credit Card',
      areaServed: [
        { '@type': 'City', name: 'Nabeul' },
        { '@type': 'City', name: 'Mrezga' },
        { '@type': 'City', name: 'Hammamet' },
        { '@type': 'City', name: 'Hammamet Nord' },
        { '@type': 'City', name: 'Korba' },
        { '@type': 'AdministrativeArea', name: 'Gouvernorat de Nabeul' },
      ],
      sameAs: [
        'https://www.facebook.com/p/ZY-Bodybuilding-61577705828873/',
        'https://www.instagram.com/zy_bodybuilding/',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+21658800554',
        contactType: 'Customer Service',
        email: 'zybodybuildingstudio@gmail.com',
        availableLanguage: ['French', 'Arabic', 'English'],
      },
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Où se trouve ZY Bodybuilding ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZY Bodybuilding est situé à Mrezga, Nabeul, Tunisie. C\'est la meilleure salle de sport de la région de Nabeul.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quels sont les tarifs de la salle de sport à Nabeul ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZY Bodybuilding propose plusieurs formules d\'abonnement adaptées à tous les budgets à Nabeul. Consultez notre page tarifs ou contactez-nous au +216 58 800 554.',
        },
      },
      {
        '@type': 'Question',
        name: 'Est-ce qu\'il y a des cours collectifs à ZY Bodybuilding Nabeul ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oui, ZY Bodybuilding propose des cours collectifs animés par des coachs certifiés à Mrezga, Nabeul. Consultez notre planning hebdomadaire en ligne.',
        },
      },
      {
        '@type': 'Question',
        name: 'What gym is near me in Nabeul Tunisia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZY Bodybuilding is the top-rated gym in Mrezga, Nabeul, Tunisia. We offer weightlifting, fitness classes, and personal coaching. Located at Mrezga, Nabeul 8000, TN.',
        },
      },
      {
        '@type': 'Question',
        name: 'Comment contacter ZY Bodybuilding à Nabeul ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vous pouvez nous contacter par téléphone au +216 58 800 554 ou par email à zybodybuildingstudio@gmail.com. Notre salle est à Mrezga, Nabeul.',
        },
      },
      {
        '@type': 'Question',
        name: 'Y a-t-il une salle de sport près de Hammamet ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oui ! ZY Bodybuilding est situé à Mrezga, à quelques minutes de Hammamet. C\'est la salle de sport la plus proche et la mieux équipée pour les habitants de Hammamet, Tunisie.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the best gym near Hammamet Tunisia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZY Bodybuilding in Mrezga is the closest and best-equipped gym near Hammamet, Tunisia. We offer weightlifting, fitness classes, and personal coaching just minutes from Hammamet.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quelle est la meilleure salle de sport à Hammamet ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZY Bodybuilding à Mrezga est la meilleure salle de sport à proximité de Hammamet. Située à quelques minutes du centre de Hammamet, notre salle propose musculation, fitness, cardio et coaching personnalisé.',
        },
      },
    ],
  };

  const jsonLdWebsite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.zybodybuilding.space/#website',
    url: 'https://www.zybodybuilding.space',
    name: 'ZY Bodybuilding — Gym Mrezga Nabeul Tunisie',
    description: 'Site officiel de ZY Bodybuilding, salle de sport à Mrezga, Nabeul, Tunisie.',
    inLanguage: ['fr-TN', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.zybodybuilding.space/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    // suppressHydrationWarning silences browser-extension attribute injection.
    <html lang="fr" suppressHydrationWarning>
      <head suppressHydrationWarning>
        {/* Geo meta tags for local search */}
        <meta name="geo.region" content="TN-21" />
        <meta name="geo.placename" content="Mrezga, Nabeul, Tunisie" />
        <meta name="geo.position" content="36.4272843;10.673816" />
        <meta name="ICBM" content="36.4272843, 10.673816" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBusiness) }}
          suppressHydrationWarning
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
          suppressHydrationWarning
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
          suppressHydrationWarning
        />
      </head>
      <body className="bg-black text-white antialiased" suppressHydrationWarning>
        <LanguageProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
