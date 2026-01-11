import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from './ConditionalLayout';

export const metadata = {
  metadataBase: new URL('https://www.zybodybuilding.space'),
  title: {
    default: 'ZY Bodybuilding - Gym & Fitness Center en Tunisie',
    template: '%s | ZY Bodybuilding'
  },
  description: 'ZY Bodybuilding - Votre salle de musculation et fitness en Tunisie. Transformez votre corps avec nos programmes personnalisés, équipements modernes et coachs professionnels.',
  keywords: ['gym tunisie', 'musculation', 'fitness', 'bodybuilding', 'salle de sport', 'ZY Bodybuilding', 'coaching sportif', 'remise en forme'],
  authors: [{ name: 'ZY Bodybuilding' }],
  creator: 'Rayen Troudi',
  publisher: 'ZY Bodybuilding',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_TN',
    url: 'https://www.zybodybuilding.space',
    title: 'ZY Bodybuilding - Gym & Fitness Center en Tunisie',
    description: 'Transformez votre corps avec nos programmes personnalisés de musculation et fitness.',
    siteName: 'ZY Bodybuilding',
    images: [
      {
        url: 'https://www.zybodybuilding.space/images/logoNobg.png',
        width: 1200,
        height: 630,
        alt: 'ZY Bodybuilding Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZY Bodybuilding - Gym & Fitness Center',
    description: 'Transformez votre corps avec nos programmes personnalisés.',
    images: ['https://www.zybodybuilding.space/images/logoNobg.png'],
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ZY Bodybuilding',
    description: 'Salle de musculation et fitness en Tunisie',
    url: 'https://www.zybodybuilding.space',
    logo: 'https://www.zybodybuilding.space/images/logoNobg.png',
    image: 'https://www.zybodybuilding.space/images/logoNobg.png',
    telephone: '+21658800554',
    email: 'zybodybuildingstudio@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TN',
      addressLocality: 'Tunisia',
    },
    sameAs: [
      'https://www.facebook.com/p/ZY-Bodybuilding-61577705828873/',
      'https://www.instagram.com/zy_bodybuilding/',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+21658800554',
      contactType: 'Customer Service',
      email: 'zybodybuildingstudio@gmail.com',
    },
  };

  return (
    // suppressHydrationWarning is added to prevent warnings from browser extensions
    // like MetaMask, which inject attributes into the HTML before React hydrates
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-black text-white antialiased" suppressHydrationWarning>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
