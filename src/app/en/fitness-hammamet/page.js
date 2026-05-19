import Link from 'next/link';

export const metadata = {
  title: 'Fitness Center Hammamet Tunisia — ZY Bodybuilding | Gym & Fitness Classes',
  description: 'Looking for a fitness center near Hammamet? ZY Bodybuilding in Mrezga, Nabeul offers fitness classes, HIIT, cardio, and personal coaching. Call +216 58 800 554.',
  keywords: [
    'fitness center hammamet', 'fitness club hammamet', 'fitness hammamet tunisia',
    'gym fitness hammamet', 'group fitness hammamet', 'hiit hammamet',
    'cardio hammamet', 'personal training hammamet', 'fitness classes hammamet',
    'workout classes hammamet', 'fitness near hammamet', 'wellness hammamet',
  ],
  alternates: {
    canonical: 'https://www.zybodybuilding.space/en/fitness-hammamet',
    languages: {
      'fr-TN': 'https://www.zybodybuilding.space/fitness-hammamet',
      'en': 'https://www.zybodybuilding.space/en/fitness-hammamet',
    },
  },
  openGraph: {
    title: 'Fitness Center Hammamet Tunisia — ZY Bodybuilding',
    description: 'The best fitness center near Hammamet, Tunisia — ZY Bodybuilding in Mrezga, Nabeul. Fitness classes, HIIT, cardio, personal training. Join today.',
    url: 'https://www.zybodybuilding.space/en/fitness-hammamet',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'fr_TN',
    images: [
      {
        url: 'https://www.zybodybuilding.space/images/og-gym-nabeul.jpg',
        width: 1200,
        height: 630,
        alt: 'ZY Bodybuilding — Fitness Center near Hammamet, Nabeul, Tunisia',
      },
    ],
  },
};

const localJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://www.zybodybuilding.space/en/fitness-hammamet',
    name: 'Fitness Center Hammamet — ZY Bodybuilding',
    description: 'English page targeting fitness center searches near Hammamet, Tunisia. ZY Bodybuilding in Mrezga, Nabeul.',
    url: 'https://www.zybodybuilding.space/en/fitness-hammamet',
    inLanguage: 'en',
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
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.zybodybuilding.space' },
        { '@type': 'ListItem', position: 2, name: 'Fitness Hammamet', item: 'https://www.zybodybuilding.space/en/fitness-hammamet' },
      ],
    },
  },
];

const classes = [
  { title: 'HIIT Training', desc: 'High-intensity interval training to burn maximum calories, boost metabolism, and improve cardiovascular fitness.', icon: '⚡' },
  { title: 'Cardio Workouts', desc: 'Guided cardio sessions using professional treadmills, ellipticals, bikes, and rowing machines.', icon: '🏃' },
  { title: 'Stretching & Mobility', desc: 'Flexibility and mobility classes to improve posture, reduce injury risk, and enhance recovery.', icon: '🧘' },
  { title: 'Core & Abs', desc: 'Targeted core strengthening classes focusing on deep muscles, posture, and abdominal definition.', icon: '💪' },
  { title: 'Circuit Training', desc: 'Full-body circuit workouts combining strength and cardio for maximum efficiency and results.', icon: '🔄' },
  { title: 'Personal Fitness Coaching', desc: 'One-on-one coaching with a certified fitness trainer to build your personalized workout plan.', icon: '🎯' },
];

const faqs = [
  {
    q: 'Is there a fitness center near Hammamet Tunisia?',
    a: 'ZY Bodybuilding in Mrezga, Nabeul is the closest fitness center to Hammamet — just a few minutes by car. It offers a full range of fitness classes, cardio equipment, and personal coaching.',
  },
  {
    q: 'What fitness classes are available near Hammamet?',
    a: 'ZY Bodybuilding offers HIIT, cardio training, stretching & mobility, core & abs, circuit training, and personal fitness coaching — all available to members from Hammamet.',
  },
  {
    q: 'Are fitness classes included in the gym membership?',
    a: 'Yes, group fitness classes are included in all ZY Bodybuilding membership plans. No additional fees for group classes.',
  },
  {
    q: 'Are fitness classes suitable for beginners near Hammamet?',
    a: 'Absolutely. Our certified instructors welcome all fitness levels — from complete beginners to advanced athletes. Classes are adapted to each participant\'s level.',
  },
  {
    q: 'How do I sign up for fitness classes near Hammamet?',
    a: 'Register online at zybodybuilding.space, WhatsApp us at +216 58 800 554, or visit us at Mrezga, Nabeul. Classes are included with your membership.',
  },
];

export default function FitnessHammametEnPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localJsonLd[0]) }}
      />

      <main className="bg-black text-white">

        {/* Hero */}
        <section className="relative py-24 px-6 lg:px-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black pointer-events-none" />
          <div className="relative max-w-4xl mx-auto space-y-6">
            <nav aria-label="Breadcrumb" className="text-sm text-neutral-500 mb-4">
              <ol className="flex items-center justify-center gap-2">
                <li><Link href="/" className="hover:text-red-500 transition-colors">Home</Link></li>
                <li className="text-neutral-600">/</li>
                <li className="text-neutral-300">Fitness Hammamet</li>
              </ol>
            </nav>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="text-red-600">Fitness Center</span> near Hammamet
              <br />
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-200">
                ZY Bodybuilding — Mrezga, Nabeul, Tunisia
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto">
              The best <strong className="text-white">fitness center near Hammamet, Tunisia</strong> —
              ZY Bodybuilding in Mrezga offers fitness classes, HIIT, cardio training, and certified
              personal coaching just minutes from Hammamet.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/register"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                Join Now
              </Link>
              <a
                href="https://wa.me/21658800554?text=Hello%20ZY%20Bodybuilding%2C%20I%20would%20like%20to%20join%20the%20fitness%20classes"
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
                Class Schedule
              </Link>
            </div>

            <p className="text-neutral-500 text-sm pt-2">
              📍 Mrezga, Nabeul 8000, Tunisia · Minutes from Hammamet ·{' '}
              <a href="tel:+21658800554" className="hover:text-red-500 transition-colors">+216 58 800 554</a>
            </p>

            <p className="text-neutral-600 text-xs">
              Also available in:{' '}
              <Link href="/fitness-hammamet" className="text-red-600 hover:underline">Français</Link>
            </p>
          </div>
        </section>

        {/* Classes */}
        <section className="py-16 px-6 lg:px-16 bg-neutral-950">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              Fitness Classes <span className="text-red-600">near Hammamet</span>
            </h2>
            <p className="text-neutral-400 text-center text-lg mb-12 max-w-2xl mx-auto">
              A full range of fitness classes available to members from Hammamet at ZY Bodybuilding, Mrezga.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((c, i) => (
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

        {/* Info */}
        <section className="py-16 px-6 lg:px-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Your Fitness Center <span className="text-red-600">near Hammamet</span>
              </h2>
              <p className="text-neutral-300 leading-relaxed">
                Living in <strong>Hammamet</strong> and looking for a quality fitness center?
                ZY Bodybuilding in <strong>Mrezga, Nabeul</strong> is just minutes away —
                the most complete and professional fitness destination in the region.
              </p>
              <ul className="space-y-3 text-neutral-300">
                {[
                  'Group fitness classes included in all memberships',
                  'Certified and passionate instructors',
                  'Full cardio equipment zone',
                  'Personal fitness coaching available',
                  'Welcoming atmosphere for all fitness levels',
                  'Easy access from Hammamet',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-red-600 font-bold mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 pt-2">
                <Link href="/en/gym-hammamet" className="text-red-500 hover:text-red-400 transition-colors text-sm">
                  → See also: Gym Hammamet (English)
                </Link>
                <Link href="/en/gym-nabeul" className="text-red-500 hover:text-red-400 transition-colors text-sm">
                  → See also: Gym Nabeul (English)
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-red-600">Fitness Center Info</h3>
                <div className="space-y-3 text-neutral-300 text-sm">
                  <p><strong className="text-white">Name:</strong> ZY Bodybuilding</p>
                  <p><strong className="text-white">Address:</strong> Mrezga, Nabeul 8000, Tunisia</p>
                  <p>
                    <strong className="text-white">Phone:</strong>{' '}
                    <a href="tel:+21658800554" className="hover:text-red-500 transition-colors">+216 58 800 554</a>
                  </p>
                  <p>
                    <strong className="text-white">WhatsApp:</strong>{' '}
                    <a
                      href="https://wa.me/21658800554?text=Hello%20ZY%20Bodybuilding%2C%20I%20would%20like%20to%20join%20the%20fitness%20classes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-green-400 transition-colors"
                    >
                      Send a message
                    </a>
                  </p>
                  <div>
                    <strong className="text-white block mb-1">Hours:</strong>
                    <p>Mon–Fri: 7:00am – 10:00pm</p>
                    <p>Saturday: 8:00am – 8:00pm</p>
                    <p>Sunday: 9:00am – 6:00pm</p>
                  </div>
                </div>
              </div>
              <a
                href="https://www.google.com/maps/place/ZY.bodybuilding/@36.4272886,10.6763909,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-neutral-900 hover:bg-red-600 border border-neutral-700 hover:border-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                📍 Directions from Hammamet — Google Maps
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6 lg:px-16 bg-neutral-950">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              FAQ — <span className="text-red-600">Fitness near Hammamet</span>
            </h2>
            <p className="text-neutral-400 text-center mb-10">
              Questions about fitness classes and the fitness center near Hammamet at ZY Bodybuilding.
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
              Start your <span className="text-red-600">fitness journey</span> today
            </h2>
            <p className="text-neutral-400 text-lg">
              Join ZY Bodybuilding — the fitness center closest to Hammamet, in Mrezga, Nabeul.
              Professional classes, certified coaches, results guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                Join Now
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
