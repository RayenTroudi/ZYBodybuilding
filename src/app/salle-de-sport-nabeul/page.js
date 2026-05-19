import Link from 'next/link';

export const metadata = {
  title: 'Salle de Sport Nabeul — ZY Bodybuilding | Musculation & Fitness Nabeul',
  description: 'ZY Bodybuilding est la meilleure salle de sport à Nabeul, Mrezga. Musculation, fitness, cours collectifs et coaching personnalisé. Rejoignez-nous dès aujourd\'hui. +216 58 800 554.',
  keywords: [
    'salle de sport nabeul', 'salle de musculation nabeul', 'fitness nabeul',
    'gym nabeul', 'musculation nabeul', 'meilleure salle de sport nabeul',
    'club fitness nabeul', 'bodybuilding nabeul', 'cours collectifs nabeul',
    'coaching sportif nabeul', 'remise en forme nabeul', 'salle de sport mrezga nabeul',
    'abonnement salle de sport nabeul', 'entraînement nabeul',
  ],
  alternates: {
    canonical: 'https://www.zybodybuilding.space/salle-de-sport-nabeul',
    languages: {
      'fr-TN': 'https://www.zybodybuilding.space/salle-de-sport-nabeul',
      'en': 'https://www.zybodybuilding.space/en/gym-nabeul',
    },
  },
  openGraph: {
    title: 'Salle de Sport Nabeul — ZY Bodybuilding | Musculation & Fitness',
    description: 'La meilleure salle de sport à Nabeul, Mrezga. Musculation, fitness, cours collectifs, coaching certifié. Rejoignez ZY Bodybuilding à Nabeul, Tunisie.',
    url: 'https://www.zybodybuilding.space/salle-de-sport-nabeul',
    type: 'website',
    locale: 'fr_TN',
    images: [
      {
        url: 'https://www.zybodybuilding.space/images/og-gym-nabeul.jpg',
        width: 1200,
        height: 630,
        alt: 'Salle de Sport Nabeul — ZY Bodybuilding Mrezga Tunisie',
      },
    ],
  },
};

const localJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://www.zybodybuilding.space/salle-de-sport-nabeul',
    name: 'Salle de Sport Nabeul — ZY Bodybuilding',
    description: 'Page dédiée aux recherches "salle de sport nabeul". ZY Bodybuilding est à Mrezga, Nabeul.',
    url: 'https://www.zybodybuilding.space/salle-de-sport-nabeul',
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
        { '@type': 'ListItem', position: 2, name: 'Salle de Sport Nabeul', item: 'https://www.zybodybuilding.space/salle-de-sport-nabeul' },
      ],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Quelle est la meilleure salle de sport à Nabeul ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZY Bodybuilding à Mrezga est la meilleure salle de sport à Nabeul, Tunisie. Elle propose musculation, fitness, cours collectifs et coaching personnalisé avec des équipements professionnels.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quels sont les tarifs de la salle de sport à Nabeul ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZY Bodybuilding Nabeul propose des abonnements hebdomadaires, mensuels, trimestriels et annuels à des prix accessibles. Appelez le +216 58 800 554 ou visitez notre page tarifs.',
        },
      },
      {
        '@type': 'Question',
        name: 'Comment s\'inscrire à la salle de sport à Nabeul ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Inscrivez-vous directement sur notre site, envoyez-nous un message WhatsApp au +216 58 800 554, ou venez nous rendre visite à Mrezga, Nabeul.',
        },
      },
    ],
  },
];

const services = [
  { title: 'Musculation', desc: 'Espace musculation professionnel avec tout l\'équipement nécessaire pour développer votre masse et votre force à Nabeul.', icon: '💪' },
  { title: 'Cardio & Fitness', desc: 'Zone cardio équipée de tapis de course, vélos elliptiques, rameurs et steppers pour votre condition physique.', icon: '🏃' },
  { title: 'Cours Collectifs', desc: 'Planning complet de cours collectifs animés par des instructeurs certifiés : HIIT, yoga, stretching, abdos.', icon: '🤸' },
  { title: 'Coaching Personnel', desc: 'Programmes d\'entraînement 100% personnalisés créés par nos coachs certifiés selon vos objectifs à Nabeul.', icon: '🎯' },
  { title: 'Nutrition Sportive', desc: 'Conseils nutritionnels et compléments alimentaires disponibles en boutique pour optimiser vos résultats.', icon: '🥗' },
  { title: 'Suivi Numérique', desc: 'Application mobile intégrée pour suivre vos entraînements, mesures corporelles et objectifs fitness.', icon: '📱' },
];

const faqs = [
  {
    q: 'Quelle est la meilleure salle de sport à Nabeul ?',
    a: 'ZY Bodybuilding à Mrezga est la salle de sport de référence à Nabeul. Équipements professionnels, coachs certifiés, cours collectifs et coaching personnalisé dans une ambiance motivante.',
  },
  {
    q: 'Où se trouve la salle de sport ZY Bodybuilding à Nabeul ?',
    a: 'ZY Bodybuilding est situé à Mrezga, Nabeul 8000, Tunisie. Retrouvez-nous sur Google Maps en cherchant "ZY Bodybuilding Mrezga".',
  },
  {
    q: 'Quels sont les tarifs de la salle de sport à Nabeul ?',
    a: 'Nous proposons des abonnements hebdomadaires, mensuels, trimestriels et annuels à prix accessibles. Consultez notre page tarifs ou appelez le +216 58 800 554.',
  },
  {
    q: 'Y a-t-il des cours collectifs à Nabeul ?',
    a: 'Oui ! Notre planning hebdomadaire propose de nombreux cours collectifs animés par des instructeurs certifiés. Consultez notre programme en ligne.',
  },
  {
    q: 'Peut-on avoir un coach personnel à la salle de sport de Nabeul ?',
    a: 'Absolument. Nos coachs certifiés à Nabeul créent des programmes d\'entraînement et nutritionnels 100% personnalisés selon vos objectifs spécifiques.',
  },
  {
    q: 'Quels sont les horaires de la salle de sport à Nabeul ?',
    a: 'Lundi–Vendredi : 07h00–22h00 | Samedi : 08h00–20h00 | Dimanche : 09h00–18h00.',
  },
];

export default function SalleDeSportNabeulPage() {
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
                <li className="text-neutral-300">Salle de Sport Nabeul</li>
              </ol>
            </nav>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="text-red-600">Salle de Sport Nabeul</span>
              <br />
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-200">
                ZY Bodybuilding — Mrezga, Nabeul
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto">
              La <strong className="text-white">meilleure salle de sport à Nabeul</strong> — équipements professionnels,
              coachs certifiés et programmes personnalisés pour tous les niveaux à Mrezga, Nabeul, Tunisie.
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
                Nos Tarifs
              </Link>
            </div>

            <p className="text-neutral-500 text-sm pt-2">
              📍 Mrezga, Nabeul 8000, Tunisie &nbsp;·&nbsp;{' '}
              <a href="tel:+21658800554" className="hover:text-red-500 transition-colors">+216 58 800 554</a>
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-6 lg:px-16 bg-neutral-950">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              Services de votre <span className="text-red-600">Salle de Sport à Nabeul</span>
            </h2>
            <p className="text-neutral-400 text-center text-lg mb-12 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour atteindre vos objectifs fitness à Nabeul, Tunisie.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <div
                  key={i}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-red-600 transition-colors"
                >
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-white">{service.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About + Info */}
        <section className="py-16 px-6 lg:px-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                La Salle de Sport <span className="text-red-600">N°1 à Nabeul</span>
              </h2>
              <p className="text-neutral-300 leading-relaxed">
                Implantée au cœur de <strong>Mrezga, Nabeul</strong>, ZY Bodybuilding est la salle de sport
                de référence dans toute la région. Accessible depuis Nabeul, Hammamet, Korba et le Gouvernorat de Nabeul.
              </p>
              <p className="text-neutral-300 leading-relaxed">
                Que vous cherchiez à perdre du poids, prendre de la masse musculaire, améliorer votre condition
                physique ou simplement bouger, notre salle de sport à Nabeul dispose de tout le nécessaire :
                équipements premium, coachs certifiés et programmes sur mesure.
              </p>
              <ul className="space-y-3 text-neutral-300">
                {[
                  'Équipements professionnels de dernière génération',
                  'Coachs diplômés STAPS et certifiés',
                  'Programmes personnalisés inclus',
                  'Cours collectifs tous niveaux et tous âges',
                  'Ambiance motivante et bienveillante',
                  'Abonnements flexibles à partir de tarifs accessibles',
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
                📍 Voir sur Google Maps — Mrezga, Nabeul
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6 lg:px-16 bg-neutral-950">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              FAQ — <span className="text-red-600">Salle de Sport Nabeul</span>
            </h2>
            <p className="text-neutral-400 text-center mb-10">
              Vos questions sur ZY Bodybuilding, la meilleure salle de sport de Nabeul.
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
              Commencez votre transformation à <span className="text-red-600">Nabeul</span>
            </h2>
            <p className="text-neutral-400 text-lg">
              Rejoignez ZY Bodybuilding — la meilleure salle de sport à Nabeul, Mrezga. Coachs certifiés,
              équipements professionnels, ambiance motivante.
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
              ZY Bodybuilding — Mrezga, Nabeul 8000, Tunisie
            </p>
          </div>
        </section>

      </main>
    </>
  );
}
