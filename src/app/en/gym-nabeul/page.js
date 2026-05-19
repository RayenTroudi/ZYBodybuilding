import Link from 'next/link';

export const metadata = {
  title: 'Gym Nabeul Tunisia — ZY Bodybuilding | Best Fitness Center in Nabeul',
  description: 'ZY Bodybuilding is the best gym in Nabeul, Tunisia — located in Mrezga. Weightlifting, fitness classes, personal coaching, certified trainers. Call +216 58 800 554.',
  keywords: [
    'gym nabeul', 'gym nabeul tunisia', 'best gym in nabeul', 'fitness center nabeul',
    'bodybuilding gym nabeul', 'gym mrezga nabeul', 'fitness club nabeul',
    'personal trainer nabeul', 'weightlifting nabeul', 'gym membership nabeul',
    'workout nabeul', 'gym near nabeul', 'sports club nabeul',
  ],
  alternates: {
    canonical: 'https://www.zybodybuilding.space/en/gym-nabeul',
    languages: {
      'fr-TN': 'https://www.zybodybuilding.space/salle-de-sport-nabeul',
      'en': 'https://www.zybodybuilding.space/en/gym-nabeul',
    },
  },
  openGraph: {
    title: 'Gym Nabeul Tunisia — ZY Bodybuilding | Best Fitness Center',
    description: 'The best gym in Nabeul, Tunisia. ZY Bodybuilding in Mrezga offers professional equipment, certified coaches, group classes, and personalized programs.',
    url: 'https://www.zybodybuilding.space/en/gym-nabeul',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'fr_TN',
    images: [
      {
        url: 'https://www.zybodybuilding.space/images/og-gym-nabeul.jpg',
        width: 1200,
        height: 630,
        alt: 'ZY Bodybuilding — Best Gym in Nabeul, Mrezga, Tunisia',
      },
    ],
  },
};

const localJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://www.zybodybuilding.space/en/gym-nabeul',
    name: 'Gym Nabeul Tunisia — ZY Bodybuilding',
    description: 'English page for ZY Bodybuilding — the best gym in Nabeul, Tunisia, located in Mrezga.',
    url: 'https://www.zybodybuilding.space/en/gym-nabeul',
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
        { '@type': 'ListItem', position: 2, name: 'Gym Nabeul', item: 'https://www.zybodybuilding.space/en/gym-nabeul' },
      ],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the best gym in Nabeul Tunisia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZY Bodybuilding in Mrezga is the top-rated gym in Nabeul, Tunisia. We offer professional weightlifting equipment, fitness classes, certified personal trainers, and a complete cardio zone.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is ZY Bodybuilding gym in Nabeul?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZY Bodybuilding is located in Mrezga, Nabeul 8000, Tunisia. Find us on Google Maps by searching "ZY Bodybuilding Mrezga".',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does a gym membership cost in Nabeul?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZY Bodybuilding offers flexible membership plans: weekly, monthly, quarterly, and annual — all at competitive rates. Visit our pricing page or call +216 58 800 554 for current prices.',
        },
      },
    ],
  },
];

const services = [
  { title: 'Weightlifting', desc: 'Complete weightlifting area with Olympic bars, dumbbells, guided machines, and cable systems for all levels.', icon: '💪' },
  { title: 'Cardio Zone', desc: 'Full cardio equipment: treadmills, ellipticals, bikes, rowing machines — everything for your cardiovascular fitness.', icon: '🏃' },
  { title: 'Group Classes', desc: 'Weekly group class schedule led by certified instructors: HIIT, stretching, abs, circuit training, and more.', icon: '🤸' },
  { title: 'Personal Training', desc: 'One-on-one coaching with certified trainers who build 100% customized programs around your goals.', icon: '🎯' },
  { title: 'Nutrition Guidance', desc: 'Expert nutritional advice and a supplements shop to fuel your workouts and maximize your results.', icon: '🥗' },
  { title: 'Progress Tracking App', desc: 'Built-in mobile app to track all your workouts, body measurements, personal records, and fitness goals.', icon: '📱' },
];

const faqs = [
  {
    q: 'What is the best gym in Nabeul Tunisia?',
    a: 'ZY Bodybuilding in Mrezga, Nabeul is the best-equipped and most highly rated gym in the Nabeul region, Tunisia. We offer professional equipment, certified coaches, group classes, and personalized programs.',
  },
  {
    q: 'Where exactly is ZY Bodybuilding located in Nabeul?',
    a: 'We are located in Mrezga, Nabeul 8000, Tunisia. Search "ZY Bodybuilding Mrezga" on Google Maps for directions from anywhere in the Nabeul region.',
  },
  {
    q: 'What are the gym opening hours in Nabeul?',
    a: 'Mon–Fri: 7:00am–10:00pm | Saturday: 8:00am–8:00pm | Sunday: 9:00am–6:00pm.',
  },
  {
    q: 'Are group fitness classes available at the gym in Nabeul?',
    a: 'Yes! We offer a full weekly schedule of group fitness classes led by certified instructors. Check our schedule page online for the latest timetable.',
  },
  {
    q: 'Can I get a personal trainer at ZY Bodybuilding Nabeul?',
    a: 'Absolutely. Our certified coaches in Nabeul create fully personalized training and nutrition programs based on your specific goals — whether that\'s building muscle, losing weight, or improving performance.',
  },
  {
    q: 'How do I sign up for the gym in Nabeul?',
    a: 'Register online at zybodybuilding.space, send us a WhatsApp message at +216 58 800 554, or visit us directly at Mrezga, Nabeul.',
  },
];

export default function GymNabeulEnPage() {
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
                <li><Link href="/" className="hover:text-red-500 transition-colors">Home</Link></li>
                <li className="text-neutral-600">/</li>
                <li className="text-neutral-300">Gym Nabeul</li>
              </ol>
            </nav>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="text-red-600">Gym Nabeul</span> Tunisia
              <br />
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-200">
                ZY Bodybuilding — Mrezga, Nabeul
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto">
              The <strong className="text-white">best gym in Nabeul, Tunisia</strong> — ZY Bodybuilding in Mrezga.
              Professional equipment, certified coaches, group classes and personalized programs
              for every fitness level.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/register"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                Join Now
              </Link>
              <a
                href="https://wa.me/21658800554?text=Hello%20ZY%20Bodybuilding%2C%20I%20would%20like%20to%20join%20the%20gym"
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
                View Pricing
              </Link>
            </div>

            <p className="text-neutral-500 text-sm pt-2">
              📍 Mrezga, Nabeul 8000, Tunisia &nbsp;·&nbsp;{' '}
              <a href="tel:+21658800554" className="hover:text-red-500 transition-colors">+216 58 800 554</a>
            </p>

            <p className="text-neutral-600 text-xs">
              Also available in:{' '}
              <Link href="/salle-de-sport-nabeul" className="text-red-600 hover:underline">Français</Link>
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-6 lg:px-16 bg-neutral-950">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              What <span className="text-red-600">ZY Bodybuilding Nabeul</span> Offers
            </h2>
            <p className="text-neutral-400 text-center text-lg mb-12 max-w-2xl mx-auto">
              Everything you need to achieve your fitness goals at the best gym in Nabeul, Tunisia.
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
                The <span className="text-red-600">#1 Gym in Nabeul</span>, Tunisia
              </h2>
              <p className="text-neutral-300 leading-relaxed">
                Located in the heart of <strong>Mrezga, Nabeul</strong>, ZY Bodybuilding is accessible
                to residents of Nabeul, Hammamet, Korba, and the entire Nabeul Governorate.
              </p>
              <p className="text-neutral-300 leading-relaxed">
                Whether you want to build muscle, lose fat, improve your endurance, or simply get active,
                our gym in Nabeul has everything you need: premium equipment, expert coaches, and
                an inclusive, motivating community.
              </p>
              <ul className="space-y-3 text-neutral-300">
                {[
                  'Latest-generation professional equipment',
                  'Certified coaches with proven expertise',
                  'Personalized programs for every goal',
                  'Group classes for all levels and ages',
                  'Welcoming and motivating environment',
                  'Flexible memberships for every budget',
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
                <h3 className="text-xl font-bold text-red-600">Gym Details</h3>
                <div className="space-y-3 text-neutral-300 text-sm">
                  <p><strong className="text-white">Address:</strong> Mrezga, Nabeul 8000, Tunisia</p>
                  <p>
                    <strong className="text-white">Phone:</strong>{' '}
                    <a href="tel:+21658800554" className="hover:text-red-500 transition-colors">+216 58 800 554</a>
                  </p>
                  <p>
                    <strong className="text-white">WhatsApp:</strong>{' '}
                    <a
                      href="https://wa.me/21658800554?text=Hello%20ZY%20Bodybuilding%2C%20I%20would%20like%20to%20join%20the%20gym"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-green-400 transition-colors"
                    >
                      Send a message
                    </a>
                  </p>
                  <p>
                    <strong className="text-white">Email:</strong>{' '}
                    <a href="mailto:zybodybuildingstudio@gmail.com" className="hover:text-red-500 transition-colors">
                      zybodybuildingstudio@gmail.com
                    </a>
                  </p>
                  <div>
                    <strong className="text-white block mb-1">Opening Hours:</strong>
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
                📍 Get Directions — Google Maps, Mrezga, Nabeul
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6 lg:px-16 bg-neutral-950">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              FAQ — <span className="text-red-600">Gym Nabeul Tunisia</span>
            </h2>
            <p className="text-neutral-400 text-center mb-10">
              Frequently asked questions about ZY Bodybuilding, the best gym in Nabeul, Tunisia.
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
              Start your transformation at the best <span className="text-red-600">gym in Nabeul</span>
            </h2>
            <p className="text-neutral-400 text-lg">
              Join ZY Bodybuilding — Mrezga, Nabeul — and train with certified coaches,
              professional equipment, and a community that pushes you to be your best.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                Join the Gym
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
