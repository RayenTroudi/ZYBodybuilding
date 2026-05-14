import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Gym Nabeul & Mrezga — ZY Bodybuilding | Salle de Sport Nabeul Tunisie',
  description: 'ZY Bodybuilding est la meilleure salle de sport à Nabeul et Mrezga, Tunisie. Musculation, fitness, cours collectifs et coaching personnalisé. Abonnements à partir de prix accessibles. Appelez le +216 58 800 554.',
  keywords: [
    'gym nabeul', 'salle de sport nabeul', 'gym mrezga', 'salle de sport mrezga',
    'fitness nabeul', 'musculation nabeul', 'meilleure salle de sport nabeul',
    'fitness club nabeul', 'bodybuilding nabeul', 'coaching sportif nabeul',
    'cours collectifs nabeul', 'personal trainer nabeul', 'gym tunisie nabeul',
    'salle de musculation nabeul', 'remise en forme nabeul',
  ],
  alternates: {
    canonical: 'https://www.zybodybuilding.space/gym-nabeul',
  },
  openGraph: {
    title: 'Gym Nabeul & Mrezga — ZY Bodybuilding | Salle de Sport Nabeul',
    description: 'La meilleure salle de sport à Nabeul et Mrezga. Musculation, fitness, cours collectifs, coaching certifié. Rejoignez ZY Bodybuilding dès aujourd\'hui.',
    url: 'https://www.zybodybuilding.space/gym-nabeul',
    type: 'website',
    locale: 'fr_TN',
    images: [
      {
        url: 'https://www.zybodybuilding.space/images/logoNobg.png',
        width: 1200,
        height: 630,
        alt: 'ZY Bodybuilding — Gym Nabeul Mrezga Tunisie',
      },
    ],
  },
};

const localJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://www.zybodybuilding.space/gym-nabeul',
  name: 'Gym Nabeul & Mrezga — ZY Bodybuilding',
  description: 'Page dédiée à la salle de sport ZY Bodybuilding à Mrezga, Nabeul, Tunisie.',
  url: 'https://www.zybodybuilding.space/gym-nabeul',
  about: {
    '@type': 'HealthClub',
    name: 'ZY Bodybuilding',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Mrezga',
      addressLocality: 'Nabeul',
      postalCode: '8000',
      addressCountry: 'TN',
    },
    telephone: '+21658800554',
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 36.4272843,
      longitude: 10.673816,
    },
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://www.zybodybuilding.space',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Gym Nabeul',
        item: 'https://www.zybodybuilding.space/gym-nabeul',
      },
    ],
  },
};

const services = [
  {
    title: 'Musculation & Bodybuilding',
    description: 'Espace musculation complet avec équipements professionnels à Mrezga, Nabeul. Haltères, barres, machines guidées et câbles pour tous les niveaux.',
    icon: '💪',
  },
  {
    title: 'Cours Collectifs Nabeul',
    description: 'Planning hebdomadaire de cours collectifs animés par des coachs certifiés : cardio, HIIT, stretching et plus encore à Nabeul.',
    icon: '🏃',
  },
  {
    title: 'Coaching Personnalisé',
    description: 'Nos coachs experts à Nabeul créent des programmes sur mesure adaptés à vos objectifs : prise de masse, perte de poids, remise en forme.',
    icon: '🎯',
  },
  {
    title: 'Suivi & Progression',
    description: 'Application de suivi intégrée pour tracker vos progrès, entraînements et objectifs. Disponible pour tous les membres ZY Bodybuilding Nabeul.',
    icon: '📈',
  },
  {
    title: 'Boutique Sportive',
    description: 'Compléments alimentaires, vêtements et accessoires de sport disponibles en ligne et à notre salle de Mrezga, Nabeul.',
    icon: '🛒',
  },
  {
    title: 'Ambiance & Communauté',
    description: 'Rejoignez une communauté sportive motivante à Nabeul. Partagez vos progrès et dépassez vos limites dans une ambiance bienveillante.',
    icon: '🤝',
  },
];

const faqs = [
  {
    q: 'Où se trouve ZY Bodybuilding à Nabeul ?',
    a: 'ZY Bodybuilding est situé à Mrezga, Nabeul 8000, Tunisie. Retrouvez-nous sur Google Maps pour l\'itinéraire.',
  },
  {
    q: 'Quels sont les horaires de la salle de sport à Nabeul ?',
    a: 'Nous sommes ouverts du lundi au vendredi de 7h à 22h, le samedi de 8h à 20h, et le dimanche de 9h à 18h.',
  },
  {
    q: 'Quels types d\'abonnements proposez-vous à Nabeul ?',
    a: 'ZY Bodybuilding Nabeul propose des abonnements hebdomadaires, mensuels, trimestriels et annuels. Consultez notre page tarifs ou appelez le +216 58 800 554.',
  },
  {
    q: 'Y a-t-il des cours collectifs à Mrezga ?',
    a: 'Oui ! Notre salle de sport à Mrezga propose un planning complet de cours collectifs animés par des instructeurs certifiés. Consultez notre programme en ligne.',
  },
  {
    q: 'Est-ce que ZY Bodybuilding propose du coaching personnalisé ?',
    a: 'Absolument. Nos coachs certifiés à Nabeul créent des programmes d\'entraînement et nutritionnels 100% personnalisés selon vos objectifs.',
  },
  {
    q: 'Comment s\'inscrire à la salle de sport de Nabeul ?',
    a: 'Inscrivez-vous directement sur notre site web, contactez-nous au +216 58 800 554, ou venez nous rendre visite à Mrezga, Nabeul.',
  },
];

export default function GymNabeulPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localJsonLd) }}
      />

      <main className="bg-black text-white">

        {/* Hero Section */}
        <section className="relative py-24 px-6 lg:px-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black pointer-events-none" />
          <div className="relative max-w-4xl mx-auto space-y-6">
            <nav aria-label="Breadcrumb" className="text-sm text-neutral-500 mb-4">
              <ol className="flex items-center justify-center gap-2">
                <li><Link href="/" className="hover:text-red-500 transition-colors">Accueil</Link></li>
                <li className="text-neutral-600">/</li>
                <li className="text-neutral-300">Gym Nabeul</li>
              </ol>
            </nav>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="text-red-600">Gym Nabeul</span> &amp; Mrezga
              <br />
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-200">
                ZY Bodybuilding — Salle de Sport Tunisie
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto">
              La meilleure salle de musculation et fitness à <strong className="text-white">Mrezga, Nabeul</strong>.
              Équipements professionnels, coachs certifiés et programmes personnalisés pour atteindre vos objectifs en Tunisie.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/register"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                S&apos;inscrire Maintenant
              </Link>
              <Link
                href="/#pricing"
                className="inline-block border border-red-600 text-red-500 hover:bg-red-600 hover:text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                Voir les Tarifs
              </Link>
            </div>

            <p className="text-neutral-500 text-sm pt-2">
              📍 Mrezga, Nabeul 8000, Tunisie &nbsp;·&nbsp; 📞{' '}
              <a href="tel:+21658800554" className="hover:text-red-500 transition-colors">
                +216 58 800 554
              </a>
            </p>
          </div>
        </section>

        {/* Why ZY Bodybuilding Nabeul */}
        <section className="py-16 px-6 lg:px-16 bg-neutral-950">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              Pourquoi choisir <span className="text-red-600">ZY Bodybuilding</span> à Nabeul ?
            </h2>
            <p className="text-neutral-400 text-center text-lg mb-12 max-w-2xl mx-auto">
              Nous sommes la salle de sport de référence à Mrezga et dans toute la région de Nabeul, Tunisie.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <div
                  key={i}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-red-600 transition-colors"
                >
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-white">{service.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About / Local signals section */}
        <section className="py-16 px-6 lg:px-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                La Salle de Sport <span className="text-red-600">N°1 à Nabeul</span>
              </h2>
              <p className="text-neutral-300 leading-relaxed">
                Située au cœur de <strong>Mrezga, Nabeul</strong>, ZY Bodybuilding est accessible à tous les habitants
                de Nabeul, Hammamet, Korba et de toute la région du Gouvernorat de Nabeul.
              </p>
              <p className="text-neutral-300 leading-relaxed">
                Notre salle de sport à Nabeul offre une expérience fitness complète : <strong>musculation</strong>,
                <strong> cours collectifs</strong>, <strong>cardio</strong>, <strong>coaching personnel</strong> et
                un espace 100% dédié à votre progression.
              </p>
              <ul className="space-y-3 text-neutral-300">
                {[
                  'Équipements professionnels dernière génération',
                  'Coachs certifiés avec expérience internationale',
                  'Ambiance motivante et bienveillante',
                  'Abonnements flexibles adaptés à tous les budgets',
                  'Application de suivi des progrès incluse',
                  'Parking disponible à Mrezga, Nabeul',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-red-600 font-bold mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-red-600">Informations Pratiques</h3>
                <div className="space-y-3 text-neutral-300 text-sm">
                  <p><strong className="text-white">Adresse :</strong> Mrezga, Nabeul 8000, Tunisie</p>
                  <p><strong className="text-white">Téléphone :</strong>{' '}
                    <a href="tel:+21658800554" className="hover:text-red-500 transition-colors">+216 58 800 554</a>
                  </p>
                  <p><strong className="text-white">Email :</strong>{' '}
                    <a href="mailto:zybodybuildingstudio@gmail.com" className="hover:text-red-500 transition-colors">
                      zybodybuildingstudio@gmail.com
                    </a>
                  </p>
                  <div>
                    <strong className="text-white block mb-1">Horaires :</strong>
                    <p>Lun–Ven : 07h00 – 22h00</p>
                    <p>Samedi : 08h00 – 20h00</p>
                    <p>Dimanche : 09h00 – 18h00</p>
                  </div>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/place/ZY.bodybuilding/@36.4272886,10.6763909,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-neutral-900 hover:bg-red-600 border border-neutral-700 hover:border-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                📍 Voir sur Google Maps — Mrezga, Nabeul
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-6 lg:px-16 bg-neutral-950">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              Questions Fréquentes — <span className="text-red-600">Gym Nabeul</span>
            </h2>
            <p className="text-neutral-400 text-center mb-10">
              Tout ce que vous devez savoir sur ZY Bodybuilding, votre salle de sport à Mrezga, Nabeul.
            </p>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-white hover:text-red-500 transition-colors list-none">
                    <span>{faq.q}</span>
                    <span className="text-red-600 text-xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-5 pb-5 text-neutral-400 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6 lg:px-16 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Prêt à rejoindre le meilleur <span className="text-red-600">gym de Nabeul</span> ?
            </h2>
            <p className="text-neutral-400 text-lg">
              Inscrivez-vous dès aujourd&apos;hui à ZY Bodybuilding — Mrezga, Nabeul — et commencez votre transformation
              avec des coachs certifiés et des équipements professionnels.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                S&apos;inscrire à la Salle de Sport
              </Link>
              <a
                href="tel:+21658800554"
                className="inline-block border border-neutral-600 hover:border-red-600 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                📞 Appeler : +216 58 800 554
              </a>
            </div>
            <p className="text-neutral-600 text-sm">
              ZY Bodybuilding — Mrezga, Nabeul 8000, Tunisie
            </p>
          </div>
        </section>

      </main>
    </>
  );
}
