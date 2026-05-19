import Link from 'next/link';

export const metadata = {
  title: 'Gym Hammamet — ZY Bodybuilding | Salle de Sport Hammamet Tunisie',
  description: 'ZY Bodybuilding est la salle de sport la plus proche de Hammamet, à Mrezga, Nabeul. Musculation, fitness, cours collectifs et coaching personnalisé. Appelez le +216 58 800 554.',
  keywords: [
    'gym hammamet', 'salle de sport hammamet', 'fitness hammamet',
    'musculation hammamet', 'meilleur gym hammamet', 'club de fitness hammamet',
    'bodybuilding hammamet', 'coaching sportif hammamet', 'salle de musculation hammamet',
    'remise en forme hammamet', 'cours collectifs hammamet', 'personal trainer hammamet',
    'gym près de hammamet', 'sport hammamet tunisie',
  ],
  alternates: {
    canonical: 'https://www.zybodybuilding.space/gym-hammamet',
    languages: {
      'fr-TN': 'https://www.zybodybuilding.space/gym-hammamet',
      'en': 'https://www.zybodybuilding.space/en/gym-hammamet',
    },
  },
  openGraph: {
    title: 'Gym Hammamet — ZY Bodybuilding | Salle de Sport près de Hammamet',
    description: 'La meilleure salle de sport à proximité de Hammamet, à Mrezga, Nabeul. Musculation, fitness, cours collectifs et coaching certifié. Rejoignez ZY Bodybuilding.',
    url: 'https://www.zybodybuilding.space/gym-hammamet',
    type: 'website',
    locale: 'fr_TN',
    images: [
      {
        url: 'https://www.zybodybuilding.space/images/og-gym-nabeul.jpg',
        width: 1200,
        height: 630,
        alt: 'ZY Bodybuilding — Gym près de Hammamet, Mrezga, Nabeul, Tunisie',
      },
    ],
  },
};

const localJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://www.zybodybuilding.space/gym-hammamet',
    name: 'Gym Hammamet — ZY Bodybuilding Mrezga',
    description: 'Page dédiée aux habitants de Hammamet cherchant une salle de sport. ZY Bodybuilding est situé à Mrezga, Nabeul, à quelques minutes de Hammamet.',
    url: 'https://www.zybodybuilding.space/gym-hammamet',
    inLanguage: 'fr-TN',
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
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.zybodybuilding.space' },
        { '@type': 'ListItem', position: 2, name: 'Gym Hammamet', item: 'https://www.zybodybuilding.space/gym-hammamet' },
      ],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Quelle est la meilleure salle de sport à Hammamet ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZY Bodybuilding à Mrezga est la salle de sport la plus proche et la mieux équipée pour les habitants de Hammamet. À seulement quelques minutes en voiture, elle propose musculation, fitness, cours collectifs et coaching personnalisé.',
        },
      },
      {
        '@type': 'Question',
        name: 'Comment aller à ZY Bodybuilding depuis Hammamet ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZY Bodybuilding est situé à Mrezga, Nabeul, à quelques minutes de Hammamet. Retrouvez l\'itinéraire complet sur Google Maps en cherchant "ZY Bodybuilding Mrezga".',
        },
      },
      {
        '@type': 'Question',
        name: 'Quels sont les horaires de la salle de sport près de Hammamet ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZY Bodybuilding est ouvert du lundi au vendredi de 7h à 22h, le samedi de 8h à 20h, et le dimanche de 9h à 18h. Accessible facilement depuis Hammamet.',
        },
      },
      {
        '@type': 'Question',
        name: 'Est-ce qu\'il y a du coaching personnalisé pour les membres de Hammamet ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oui, nos coachs certifiés créent des programmes d\'entraînement et de nutrition 100% personnalisés, disponibles pour tous les membres venant de Hammamet et de la région de Nabeul.',
        },
      },
    ],
  },
];

const services = [
  {
    title: 'Musculation & Bodybuilding',
    description: 'Espace musculation professionnel avec haltères, barres olympiques, machines guidées et câbles. Idéal pour les habitants de Hammamet cherchant une salle complète.',
    icon: '💪',
  },
  {
    title: 'Fitness & Cardio',
    description: 'Zone cardio équipée de tapis de course, vélos elliptiques et rameurs. Le meilleur espace fitness à proximité de Hammamet.',
    icon: '🏃',
  },
  {
    title: 'Cours Collectifs',
    description: 'Planning hebdomadaire de cours collectifs animés par des instructeurs certifiés : HIIT, stretching, abdos-fessiers. Accessible depuis Hammamet.',
    icon: '🤸',
  },
  {
    title: 'Coaching Personnalisé',
    description: 'Nos coachs experts créent des programmes sur mesure adaptés à vos objectifs : prise de masse, perte de poids, remise en forme, préparation physique.',
    icon: '🎯',
  },
  {
    title: 'Nutrition & Compléments',
    description: 'Conseils nutritionnels personnalisés et boutique de compléments alimentaires. Maximisez vos résultats avec les bons apports.',
    icon: '🥗',
  },
  {
    title: 'Suivi des Progrès',
    description: 'Application de suivi intégrée pour tracker vos entraînements, mesures et objectifs. Disponible pour tous les membres, de Hammamet à Nabeul.',
    icon: '📈',
  },
];

const faqs = [
  {
    q: 'Quelle est la meilleure salle de sport à Hammamet ?',
    a: 'ZY Bodybuilding à Mrezga est la salle de sport la plus proche et la mieux équipée pour les habitants de Hammamet. Musculation, fitness, cours collectifs et coaching certifié à quelques minutes de Hammamet.',
  },
  {
    q: 'Comment aller à ZY Bodybuilding depuis Hammamet ?',
    a: 'ZY Bodybuilding est situé à Mrezga, Nabeul, à quelques minutes en voiture de Hammamet. Cherchez "ZY Bodybuilding Mrezga" sur Google Maps pour l\'itinéraire.',
  },
  {
    q: 'Quels sont les horaires de la salle de sport près de Hammamet ?',
    a: 'Lundi–Vendredi : 07h00–22h00 | Samedi : 08h00–20h00 | Dimanche : 09h00–18h00.',
  },
  {
    q: 'Quels types d\'abonnements sont disponibles pour les membres de Hammamet ?',
    a: 'ZY Bodybuilding propose des abonnements hebdomadaires, mensuels, trimestriels et annuels à des tarifs accessibles. Appelez le +216 58 800 554 pour plus d\'informations.',
  },
  {
    q: 'Est-ce qu\'il y a du coaching personnalisé disponible ?',
    a: 'Oui ! Nos coachs certifiés créent des programmes 100% personnalisés selon vos objectifs (prise de masse, perte de poids, remise en forme), disponibles pour tous les membres venant de Hammamet.',
  },
  {
    q: 'Y a-t-il des cours collectifs à la salle de sport près de Hammamet ?',
    a: 'Absolument. Notre planning hebdomadaire propose des cours collectifs animés par des instructeurs certifiés. Consultez notre programme en ligne ou appelez-nous.',
  },
];

export default function GymHammametPage() {
  return (
    <>
      {localJsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main className="bg-black text-white">

        {/* Hero */}
        <section className="relative py-24 px-6 lg:px-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black pointer-events-none" />
          <div className="relative max-w-4xl mx-auto space-y-6">
            <nav aria-label="Breadcrumb" className="text-sm text-neutral-500 mb-4">
              <ol className="flex items-center justify-center gap-2">
                <li><Link href="/" className="hover:text-red-500 transition-colors">Accueil</Link></li>
                <li className="text-neutral-600">/</li>
                <li className="text-neutral-300">Gym Hammamet</li>
              </ol>
            </nav>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="text-red-600">Gym Hammamet</span>
              <br />
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-200">
                ZY Bodybuilding — Salle de Sport à Mrezga
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto">
              La salle de sport la plus complète à proximité de <strong className="text-white">Hammamet</strong>, à Mrezga, Nabeul.
              Équipements professionnels, coachs certifiés et programmes personnalisés pour atteindre vos objectifs en Tunisie.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/register"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                S&apos;inscrire Maintenant
              </Link>
              <a
                href="https://wa.me/21658800554?text=Bonjour%20ZY%20Bodybuilding%2C%20je%20voudrais%20m%27inscrire"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                💬 WhatsApp
              </a>
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
              &nbsp;·&nbsp; À quelques minutes de Hammamet
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-6 lg:px-16 bg-neutral-950">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              Votre Salle de Sport <span className="text-red-600">près de Hammamet</span>
            </h2>
            <p className="text-neutral-400 text-center text-lg mb-12 max-w-2xl mx-auto">
              ZY Bodybuilding à Mrezga offre tout ce dont vous avez besoin pour atteindre vos objectifs fitness, à quelques minutes de Hammamet.
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

        {/* Local signals */}
        <section className="py-16 px-6 lg:px-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                La Salle de Sport <span className="text-red-600">la Plus Proche de Hammamet</span>
              </h2>
              <p className="text-neutral-300 leading-relaxed">
                Vous habitez à <strong>Hammamet</strong> et vous cherchez une salle de sport complète ?
                ZY Bodybuilding, situé à <strong>Mrezga, Nabeul</strong>, est à quelques minutes de votre domicile.
                Accessible depuis Hammamet Nord, Hammamet Sud et toute la région de Nabeul.
              </p>
              <p className="text-neutral-300 leading-relaxed">
                Notre salle offre une expérience fitness premium : <strong>musculation</strong>,{' '}
                <strong>cours collectifs</strong>, <strong>cardio</strong>,{' '}
                <strong>coaching personnel</strong> et un espace 100% dédié à votre transformation.
              </p>
              <ul className="space-y-3 text-neutral-300">
                {[
                  'Équipements professionnels de dernière génération',
                  'Coachs certifiés avec expérience internationale',
                  'Ambiance motivante et bienveillante',
                  'Abonnements flexibles adaptés à tous les budgets',
                  'Application de suivi des progrès incluse',
                  'Facilement accessible depuis Hammamet',
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
                  <p><strong className="text-white">Distance :</strong> Quelques minutes depuis Hammamet</p>
                  <p>
                    <strong className="text-white">Téléphone :</strong>{' '}
                    <a href="tel:+21658800554" className="hover:text-red-500 transition-colors">+216 58 800 554</a>
                  </p>
                  <p>
                    <strong className="text-white">WhatsApp :</strong>{' '}
                    <a
                      href="https://wa.me/21658800554?text=Bonjour%20ZY%20Bodybuilding%2C%20je%20voudrais%20m%27inscrire"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-green-400 transition-colors"
                    >
                      Envoyer un message
                    </a>
                  </p>
                  <p>
                    <strong className="text-white">Email :</strong>{' '}
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
                📍 Itinéraire depuis Hammamet — Google Maps
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6 lg:px-16 bg-neutral-950">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              Questions Fréquentes — <span className="text-red-600">Gym Hammamet</span>
            </h2>
            <p className="text-neutral-400 text-center mb-10">
              Tout ce que vous devez savoir sur ZY Bodybuilding, votre salle de sport la plus proche de Hammamet.
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
                  <div className="px-5 pb-5 text-neutral-400 leading-relaxed">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 lg:px-16 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Rejoignez le meilleur <span className="text-red-600">gym près de Hammamet</span>
            </h2>
            <p className="text-neutral-400 text-lg">
              Inscrivez-vous dès aujourd&apos;hui à ZY Bodybuilding à Mrezga — quelques minutes de Hammamet —
              et commencez votre transformation avec des coachs certifiés et des équipements professionnels.
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
                📞 +216 58 800 554
              </a>
            </div>
            <p className="text-neutral-600 text-sm">
              ZY Bodybuilding — Mrezga, Nabeul 8000 · À quelques minutes de Hammamet, Tunisie
            </p>
          </div>
        </section>

      </main>
    </>
  );
}
