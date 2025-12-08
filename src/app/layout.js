import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from './ConditionalLayout';

export const metadata = {
  title: 'ZY Bodybuilding - Gym & Fitness Center',
  description: 'ZY Bodybuilding - Votre salle de musculation et fitness en Tunisie. Transformez votre corps avec nos programmes personnalisés.',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning is added to prevent warnings from browser extensions
    // like MetaMask, which inject attributes into the HTML before React hydrates
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/globals.css" as="style" />
      </head>
      <body className="bg-black text-white antialiased" suppressHydrationWarning>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
