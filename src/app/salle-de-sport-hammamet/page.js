import Link from 'next/link';

export const metadata = {
  title: 'Salle de Sport Hammamet — ZY Bodybuilding | Fitness & Musculation Hammamet',
  description: 'Cherchez-vous une salle de sport à Hammamet ? ZY Bodybuilding à Mrezga, Nabeul est la salle la plus proche. Musculation, fitness, cardio, coaching. Appelez +216 58 800 554.',
  keywords: [
    'salle de sport hammamet', 'salle de musculation hammamet', 'fitness hammamet',
    'club de fitness hammamet', 'gym hammamet', 'musculation hammamet',
    'sport hammamet', 'remise en forme hammamet', 'coaching hammamet',
    'cours de sport hammamet', 'abonnement salle de sport hammamet',
    'entraînement hammamet', 'salle de gym hammamet',
  ],
  alternates: {
    canonical: 'https://www.zybodybuilding.space/salle-de-sport-hammamet',
    languages: {
      'fr-TN': 'https://www.zybodybuilding.space/salle-de-sport-hammamet',
      'en': 'https://www.zybodybuilding.space/en/gym-hammamet',
    },
  },
  openGraph: {
    title: 'Salle de Sport Hammamet — ZY Bodybuilding | Fitness & Musculation',
    description: 'ZY Bodybuilding à Mrezga, Nabeul — la salle de sport la plus proche de Hammamet. Musculation, fitness, cours collectifs et coaching certifié en Tunisie.',
    url: 'https://www.zybodybuilding.space/salle-de-sport-hammamet',
    type: 'website',
    locale: 'fr_TN',
    images: [
      {
        url: 'https://www.zybodybuilding.space/images/og-gym-nabeul.jpg',
        width: 1200,
        height: 630,
        alt: 'Salle de Sport Hammamet — ZY Bodybuilding Mrezga Nabeul Tunisie',
      },
    ],
  },
};

const localJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://www.zybodybuilding.space/salle-de-sport-hammamet',
    name: 'Salle de Sport Hammamet — ZY Bodybuilding',
    description: 'Page dédiée aux recherches "salle de sport hammamet". ZY Bodybuilding est à Mrezga, quelques minutes de Hammamet.',
    url: 'https://www.zybodybuilding.space/salle-de-sport-hammamet',
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
        { '@type': 'ListItem', position: 2, name: 'Salle de Sport Hammamet', item: 'https://www.zybodybuilding.space/salle-de-sport-hammamet' },
      ],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Y a-t-il une salle de sport à Hammamet ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZY Bodybuilding à Mrezga, Nabeul est la salle de sport la plus proche de Hammamet. À quelques minutes en voiture, elle propose musculation, fitness, cours collectifs et coaching personnalisé.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quelle salle de sport choisir à Hammamet ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZY Bodybuilding est le choix numéro 1 pour les habitants de Hammamet. Equipements professionnels, coachs certifiés, ambiance motivante et abonnements flexibles à Mrezga, Nabeul.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quels services propose la salle de sport près de Hammamet ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZY Bodybuilding propose : musculation, cardio, cours collectifs (HIIT, stretching), coaching personnalisé, suivi nutritionnel et application de suivi des progrès. Tout pour votre transformation.',
        },
      },
    ],
  },
];

const programmes = [
  { title: 'Prise de Masse', desc: 'Programme de musculation et nutrition pour développer votre masse musculaire avec nos coachs certifiés.', icon: '💪' },
  { title: 'Perte de Poids', desc: 'Combinaison cardio, HIIT et alimentation équilibrée pour brûler les graisses et retrouver votre silhouette.', icon: '🔥' },
  { title: 'Remise en Forme', desc: 'Reprenez le sport progressivement avec un programme adapté à votre niveau et vos objectifs.', icon: '🌱' },
  { title: 'Force & Performance', desc: 'Développez votre force maximale avec des programmes de powerlifting et haltérophilie.', icon: '🏋️' },
  { title: 'Cardio & Endurance', desc: 'Améliorez votre endurance cardiovasculaire avec nos équipements cardio et cours collectifs.', icon: '🏃' },
  { title: 'Préparation Physique', desc: 'Programmes de préparation physique pour sportifs et athlètes de tous niveaux.', icon: '🎯' },
];

const faqs = [
  {
    q: 'Y a-t-il une salle de sport à Hammamet ?',
    a: 'ZY Bodybuilding à Mrezga, Nabeul est la salle de sport la plus proche de Hammamet — à quelques minutes en voiture. Elle propose musculation, fitness, cours collectifs et coaching personnalisé.',
  },
  {
    q: 'Quelle salle de sport choisir près de Hammamet ?',
    a: 'ZY Bodybuilding est le choix numéro 1 pour les habitants de Hammamet : équipements professionnels, coachs certifiés, ambiance motivante et abonnements flexibles.',
  },
  {
    q: 'Combien coûte un abonnement à la salle de sport près de Hammamet ?',
    a: 'ZY Bodybuilding propose plusieurs formules d\'abonnement adaptées à tous les budgets : hebdomadaire, mensuel, trimestriel et annuel. Appelez le +216 58 800 554 pour les tarifs actuels.',
  },
  {
    q: 'Quels équipements sont disponibles dans la salle de sport de Hammamet ?',
    a: 'ZY Bodybuilding dispose d\'équipements professionnels complets : haltères, barres olympiques, machines guidées, câbles, zone cardio (tapis, vélos, elliptiques) et espace cours collectifs.',
  },
  {
    q: 'Comment s\'inscrire à la salle de sport près de Hammamet ?',
    a: 'Inscrivez-vous sur notre site web zybodybuilding.space, contactez-nous par WhatsApp au +216 58 800 554, ou venez directement à Mrezga, Nabeul.',
  },
];

export default function SalleDeSportHammametPage() {
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
                <li className="text-neutral-300">Salle de Sport Hammamet</li>
              </ol>
            </nav>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="text-red-600">Salle de Sport Hammamet</span>
              <br />
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-200">
                ZY Bodybuilding — Mrezga, Nabeul
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto">
              Vous cherchez une <strong className="text-white">salle de sport à Hammamet</strong> ?
              ZY Bodybuilding à Mrezga est la salle la plus proche — complète, professionnelle et accessible.
              Musculation, fitness, coaching certifié, à quelques minutes de Hammamet.
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
              📍 Mrezga, Nabeul 8000, Tunisie &nbsp;·&nbsp; ⏱ À quelques minutes de Hammamet &nbsp;·&nbsp;{' '}
              <a href="tel:+21658800554" className="hover:text-red-500 transition-colors">+216 58 800 554</a>
            </p>
          </div>
        </section>

        {/* Programmes */}
        <section className="py-16 px-6 lg:px-16 bg-neutral-950">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              Programmes disponibles à votre <span className="text-red-600">salle de sport</span>
            </h2>
            <p className="text-neutral-400 text-center text-lg mb-12 max-w-2xl mx-auto">
              Quel que soit votre objectif, ZY Bodybuilding à Mrezga a le programme idéal pour vous.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {programmes.map((prog, i) => (
                <div
                  key={i}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-red-600 transition-colors"
                >
                  <div className="text-4xl mb-4">{prog.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-white">{prog.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{prog.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Info + Map */}
        <section className="py-16 px-6 lg:px-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Pourquoi choisir <span className="text-red-600">ZY Bodybuilding</span> ?
              </h2>
              <p className="text-neutral-300 leading-relaxed">
                Parmi toutes les options de salle de sport à Hammamet et dans la région de Nabeul,
                ZY Bodybuilding se distingue par la qualité de ses équipements, l'expertise de ses coachs
                et son ambiance motivante.
              </p>
              <ul className="space-y-3 text-neutral-300">
                {[
                  'Machines professionnelles dernière génération',
                  'Coachs diplômés et certifiés',
                  'Suivi personnalisé inclus dans l\'abonnement',
                  'Cours collectifs tous niveaux',
                  'Ambiance inclusive et motivante',
                  'Accessible depuis Hammamet, Nabeul et la région',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-red-600 font-bold mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 pt-4">
                <Link
                  href="/gym-hammamet"
                  className="text-red-500 hover:text-red-400 transition-colors text-sm"
                >
                  → Voir aussi : Gym Hammamet
                </Link>
                <Link
                  href="/gym-nabeul"
                  className="text-red-500 hover:text-red-400 transition-colors text-sm"
                >
                  → Voir aussi : Gym Nabeul
                </Link>
                <Link
                  href="/gym-hammamet-nord"
                  className="text-red-500 hover:text-red-400 transition-colors text-sm"
                >
                  → Voir aussi : Gym Hammamet Nord
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-red-600">Coordonnées</h3>
                <div className="space-y-3 text-neutral-300 text-sm">
                  <p><strong className="text-white">Salle :</strong> ZY Bodybuilding</p>
                  <p><strong className="text-white">Adresse :</strong> Mrezga, Nabeul 8000, Tunisie</p>
                  <p>
                    <strong className="text-white">Tél :</strong>{' '}
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
              FAQ — <span className="text-red-600">Salle de Sport Hammamet</span>
            </h2>
            <p className="text-neutral-400 text-center mb-10">
              Les questions les plus posées sur notre salle de sport, la plus proche de Hammamet.
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
              Prêt à rejoindre votre <span className="text-red-600">salle de sport ?</span>
            </h2>
            <p className="text-neutral-400 text-lg">
              Rejoignez ZY Bodybuilding à Mrezga, Nabeul — la salle de sport la plus proche de Hammamet.
              Commencez votre transformation dès aujourd&apos;hui.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                S&apos;inscrire Maintenant
              </Link>
              <a
                href="tel:+21658800554"
                className="inline-block border border-neutral-600 hover:border-red-600 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                📞 +216 58 800 554
              </a>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
