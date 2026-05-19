import Link from 'next/link';

export const metadata = {
  title: 'Fitness Hammamet — ZY Bodybuilding | Club de Fitness près de Hammamet',
  description: 'ZY Bodybuilding à Mrezga, Nabeul — le meilleur club de fitness près de Hammamet. Cours collectifs, cardio, HIIT, coaching personnalisé. Rejoignez-nous ! +216 58 800 554.',
  keywords: [
    'fitness hammamet', 'club de fitness hammamet', 'cours fitness hammamet',
    'fitness tunisie hammamet', 'centre fitness hammamet', 'yoga hammamet',
    'hiit hammamet', 'cardio hammamet', 'aerobic hammamet',
    'salle fitness hammamet', 'coach fitness hammamet', 'remise en forme hammamet',
    'sport fitness hammamet', 'zumba hammamet',
  ],
  alternates: {
    canonical: 'https://www.zybodybuilding.space/fitness-hammamet',
    languages: {
      'fr-TN': 'https://www.zybodybuilding.space/fitness-hammamet',
      'en': 'https://www.zybodybuilding.space/en/fitness-hammamet',
    },
  },
  openGraph: {
    title: 'Fitness Hammamet — ZY Bodybuilding | Club de Fitness & Cours Collectifs',
    description: 'Le meilleur club de fitness près de Hammamet, à Mrezga, Nabeul. Cours collectifs, HIIT, cardio, coaching personnel. Rejoignez ZY Bodybuilding.',
    url: 'https://www.zybodybuilding.space/fitness-hammamet',
    type: 'website',
    locale: 'fr_TN',
    images: [
      {
        url: 'https://www.zybodybuilding.space/images/og-gym-nabeul.jpg',
        width: 1200,
        height: 630,
        alt: 'Fitness Hammamet — ZY Bodybuilding Mrezga Nabeul Tunisie',
      },
    ],
  },
};

const localJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://www.zybodybuilding.space/fitness-hammamet',
    name: 'Fitness Hammamet — ZY Bodybuilding',
    description: 'Club de fitness à Mrezga, Nabeul — le plus proche de Hammamet, Tunisie.',
    url: 'https://www.zybodybuilding.space/fitness-hammamet',
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
        { '@type': 'ListItem', position: 2, name: 'Fitness Hammamet', item: 'https://www.zybodybuilding.space/fitness-hammamet' },
      ],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Où trouver un club de fitness à Hammamet ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZY Bodybuilding à Mrezga, Nabeul est le club de fitness le plus proche de Hammamet. Il propose des cours collectifs, cardio, HIIT et coaching personnalisé à quelques minutes de Hammamet.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quels cours de fitness sont disponibles près de Hammamet ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZY Bodybuilding propose un large choix de cours collectifs : HIIT, cardio, stretching, abdos-fessiers et plus encore. Consultez notre planning hebdomadaire en ligne.',
        },
      },
    ],
  },
];

const cours = [
  { title: 'HIIT', desc: 'Entraînement par intervalles de haute intensité pour brûler un maximum de calories en un minimum de temps.', icon: '⚡' },
  { title: 'Cardio Training', desc: 'Sessions cardio avec machines professionnelles : tapis de course, vélos, elliptiques, rameurs.', icon: '🏃' },
  { title: 'Stretching & Mobilité', desc: 'Cours de souplesse et mobilité pour améliorer votre posture et prévenir les blessures.', icon: '🧘' },
  { title: 'Abdos & Gainage', desc: 'Cours spécialisés renforcement musculaire profond, gainage et travail abdominal complet.', icon: '💪' },
  { title: 'Circuit Training', desc: 'Enchaînements d\'exercices variés pour développer force, endurance et coordination simultanément.', icon: '🔄' },
  { title: 'Coaching Fitness', desc: 'Suivi personnalisé avec un coach fitness dédié pour maximiser vos résultats et rester motivé.', icon: '🎯' },
];

const faqs = [
  {
    q: 'Où trouver un club de fitness à Hammamet ?',
    a: 'ZY Bodybuilding à Mrezga, Nabeul est le club de fitness le plus proche et le mieux équipé pour les habitants de Hammamet, à quelques minutes en voiture.',
  },
  {
    q: 'Quels cours de fitness sont disponibles près de Hammamet ?',
    a: 'ZY Bodybuilding propose : HIIT, cardio, stretching, abdos-fessiers, circuit training et coaching personnalisé. Consultez notre planning hebdomadaire complet en ligne.',
  },
  {
    q: 'Y a-t-il des cours pour débutants en fitness près de Hammamet ?',
    a: 'Absolument. ZY Bodybuilding accueille tous les niveaux, des débutants aux sportifs confirmés. Nos instructeurs certifiés adaptent les cours à chaque participant.',
  },
  {
    q: 'Quel est le tarif pour les cours de fitness près de Hammamet ?',
    a: 'Les cours collectifs sont inclus dans tous nos abonnements. Consultez nos forfaits sur la page tarifs ou appelez-nous au +216 58 800 554.',
  },
  {
    q: 'Y a-t-il un coach fitness disponible pour un suivi personnalisé ?',
    a: 'Oui ! Nos coachs fitness certifiés créent des programmes personnalisés adaptés à vos objectifs spécifiques : perte de poids, remise en forme, tonification.',
  },
];

export default function FitnessHammametPage() {
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
                <li className="text-neutral-300">Fitness Hammamet</li>
              </ol>
            </nav>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="text-red-600">Fitness Hammamet</span>
              <br />
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-200">
                ZY Bodybuilding — Club de Fitness à Mrezga
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto">
              Le meilleur <strong className="text-white">club de fitness près de Hammamet</strong>, à Mrezga, Nabeul.
              Cours collectifs, cardio, HIIT, coaching personnalisé et équipements professionnels
              pour votre transformation fitness en Tunisie.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/register"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                S&apos;inscrire Maintenant
              </Link>
              <a
                href="https://wa.me/21658800554?text=Bonjour%20ZY%20Bodybuilding%2C%20je%20voudrais%20m%27inscrire%20aux%20cours%20fitness"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                💬 WhatsApp
              </a>
              <Link
                href="/#schedule"
                className="inline-block border border-red-600 text-red-500 hover:bg-red-600 hover:text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                Planning des Cours
              </Link>
            </div>

            <p className="text-neutral-500 text-sm pt-2">
              📍 Mrezga, Nabeul 8000 · À quelques minutes de Hammamet ·{' '}
              <a href="tel:+21658800554" className="hover:text-red-500 transition-colors">+216 58 800 554</a>
            </p>
          </div>
        </section>

        {/* Cours */}
        <section className="py-16 px-6 lg:px-16 bg-neutral-950">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              Nos Cours de <span className="text-red-600">Fitness à Hammamet</span>
            </h2>
            <p className="text-neutral-400 text-center text-lg mb-12 max-w-2xl mx-auto">
              Un planning complet de cours collectifs et de fitness, accessible depuis Hammamet à Mrezga, Nabeul.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cours.map((c, i) => (
                <div
                  key={i}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-red-600 transition-colors"
                >
                  <div className="text-4xl mb-4">{c.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-white">{c.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why + Info */}
        <section className="py-16 px-6 lg:px-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Votre Club de Fitness <span className="text-red-600">près de Hammamet</span>
              </h2>
              <p className="text-neutral-300 leading-relaxed">
                Vous habitez à <strong>Hammamet</strong> et recherchez un club de fitness complet ?
                ZY Bodybuilding à <strong>Mrezga, Nabeul</strong> est l'option la plus proche et la plus complète
                pour votre pratique du fitness en Tunisie.
              </p>
              <p className="text-neutral-300 leading-relaxed">
                Notre club fitness propose un planning hebdomadaire riche en cours collectifs,
                une zone cardio complète, du coaching individuel et tout l'équipement nécessaire
                pour progresser efficacement.
              </p>
              <ul className="space-y-3 text-neutral-300">
                {[
                  'Cours collectifs tous niveaux inclus',
                  'Instructeurs certifiés et passionnés',
                  'Zone cardio équipée dernière génération',
                  'Coaching fitness personnalisé disponible',
                  'Ambiance bienveillante et motivante',
                  'Accessible facilement depuis Hammamet',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-red-600 font-bold mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 pt-2">
                <Link href="/gym-hammamet" className="text-red-500 hover:text-red-400 transition-colors text-sm">
                  → Voir aussi : Gym Hammamet
                </Link>
                <Link href="/salle-de-sport-hammamet" className="text-red-500 hover:text-red-400 transition-colors text-sm">
                  → Voir aussi : Salle de Sport Hammamet
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-red-600">Informations Club Fitness</h3>
                <div className="space-y-3 text-neutral-300 text-sm">
                  <p><strong className="text-white">Club :</strong> ZY Bodybuilding</p>
                  <p><strong className="text-white">Adresse :</strong> Mrezga, Nabeul 8000, Tunisie</p>
                  <p>
                    <strong className="text-white">Téléphone :</strong>{' '}
                    <a href="tel:+21658800554" className="hover:text-red-500 transition-colors">+216 58 800 554</a>
                  </p>
                  <p>
                    <strong className="text-white">WhatsApp :</strong>{' '}
                    <a
                      href="https://wa.me/21658800554?text=Bonjour%20ZY%20Bodybuilding%2C%20je%20voudrais%20m%27inscrire%20aux%20cours%20fitness"
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
              FAQ — <span className="text-red-600">Fitness Hammamet</span>
            </h2>
            <p className="text-neutral-400 text-center mb-10">
              Tout savoir sur les cours de fitness disponibles près de Hammamet à ZY Bodybuilding.
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
              Commencez votre parcours <span className="text-red-600">fitness</span> dès aujourd&apos;hui
            </h2>
            <p className="text-neutral-400 text-lg">
              Rejoignez ZY Bodybuilding à Mrezga — le club de fitness le plus proche de Hammamet.
              Cours collectifs, coaching certifié, ambiance motivante.
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
