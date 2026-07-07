import Link from 'next/link';

export const metadata = {
  title: 'Gym Hammamet Nord Tunisia — ZY Bodybuilding | Best Gym near Hammamet Nord',
  description: 'Looking for a gym near Hammamet Nord, Tunisia? ZY Bodybuilding in Mrezga, Nabeul is the closest full-service gym. Weightlifting, fitness classes, personal coaching. Call +216 58 800 554.',
  keywords: [
    'gym hammamet nord', 'best gym in hammamet nord', 'gym near hammamet nord tunisia',
    'fitness center hammamet nord', 'bodybuilding gym hammamet nord', 'fitness club hammamet nord',
    'gym yasmine hammamet', 'workout hammamet nord', 'personal trainer hammamet nord',
    'gym membership hammamet nord', 'fitness hammamet nord tunisia',
  ],
  alternates: {
    canonical: 'https://www.zybodybuilding.space/en/gym-hammamet-nord',
    languages: {
      'fr-TN': 'https://www.zybodybuilding.space/gym-hammamet-nord',
      'en': 'https://www.zybodybuilding.space/en/gym-hammamet-nord',
    },
  },
  openGraph: {
    title: 'Gym Hammamet Nord Tunisia — ZY Bodybuilding | Best Gym near Hammamet Nord',
    description: 'The best gym near Hammamet Nord, Tunisia — ZY Bodybuilding in Mrezga, Nabeul. Weightlifting, fitness, group classes, certified coaches. Join us today.',
    url: 'https://www.zybodybuilding.space/en/gym-hammamet-nord',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'fr_TN',
    images: [
      {
        url: 'https://www.zybodybuilding.space/images/og-gym-nabeul.jpg',
        width: 1200,
        height: 630,
        alt: 'ZY Bodybuilding — Best Gym near Hammamet Nord, Mrezga, Nabeul, Tunisia',
      },
    ],
  },
};

const localJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://www.zybodybuilding.space/en/gym-hammamet-nord',
    name: 'Gym Hammamet Nord Tunisia — ZY Bodybuilding',
    description: 'English page for ZY Bodybuilding — the closest gym to Hammamet Nord, located in Mrezga, Nabeul, Tunisia.',
    url: 'https://www.zybodybuilding.space/en/gym-hammamet-nord',
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
        { '@type': 'ListItem', position: 2, name: 'Gym Hammamet Nord', item: 'https://www.zybodybuilding.space/en/gym-hammamet-nord' },
      ],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the best gym near Hammamet Nord Tunisia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZY Bodybuilding in Mrezga, Nabeul is the closest and best-equipped gym to Hammamet Nord, Tunisia. We offer weightlifting, fitness classes, group courses, and personal coaching just minutes from Hammamet Nord.',
        },
      },
      {
        '@type': 'Question',
        name: 'How far is ZY Bodybuilding from Hammamet Nord?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZY Bodybuilding is located in Mrezga, Nabeul — just a few minutes by car from Hammamet Nord. Search "ZY Bodybuilding Mrezga" on Google Maps for directions.',
        },
      },
      {
        '@type': 'Question',
        name: 'What gym facilities are available near Hammamet Nord Tunisia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZY Bodybuilding near Hammamet Nord offers: full weightlifting area, cardio equipment, group fitness classes, certified personal trainers, and a nutrition shop. State-of-the-art facilities in Mrezga, Nabeul.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I join ZY Bodybuilding near Hammamet Nord?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Register online at zybodybuilding.space, WhatsApp us at +216 58 800 554, or visit us directly in Mrezga, Nabeul — just minutes from Hammamet Nord.',
        },
      },
    ],
  },
];

const services = [
  { title: 'Weightlifting & Bodybuilding', desc: 'Professional weightlifting area with Olympic bars, free weights, guided machines, and cables. The complete gym experience near Hammamet Nord.', icon: '💪' },
  { title: 'Cardio & Fitness', desc: 'Full cardio zone with treadmills, ellipticals, stationary bikes, and rowing machines for all fitness levels.', icon: '🏃' },
  { title: 'Group Fitness Classes', desc: 'Weekly schedule of group classes led by certified instructors: HIIT, stretching, abs, circuit training.', icon: '🤸' },
  { title: 'Personal Coaching', desc: 'Certified coaches create 100% personalized training and nutrition programs tailored to your goals.', icon: '🎯' },
  { title: 'Nutrition & Supplements', desc: 'Expert nutritional advice and a supplements shop to maximize your results and fuel your performance.', icon: '🥗' },
  { title: 'Progress Tracking', desc: 'Integrated mobile app to track your workouts, body measurements, and fitness goals over time.', icon: '📈' },
];

const faqs = [
  {
    q: 'What is the best gym near Hammamet Nord Tunisia?',
    a: 'ZY Bodybuilding in Mrezga, Nabeul is the closest and best-equipped gym to Hammamet Nord. We offer weightlifting, fitness classes, personal coaching, and state-of-the-art equipment just minutes from Hammamet Nord.',
  },
  {
    q: 'How far is ZY Bodybuilding from Hammamet Nord?',
    a: 'ZY Bodybuilding is located in Mrezga, Nabeul — just a few minutes by car from Hammamet Nord. Search "ZY Bodybuilding Mrezga" on Google Maps for turn-by-turn directions.',
  },
  {
    q: 'What are the opening hours?',
    a: 'Monday–Friday: 7:00am–10:00pm | Saturday: 8:00am–8:00pm | Sunday: 9:00am–6:00pm.',
  },
  {
    q: 'What gym membership options are available?',
    a: 'ZY Bodybuilding offers weekly, monthly, quarterly, and annual memberships at competitive prices. Call +216 58 800 554 or visit our pricing page for current rates.',
  },
  {
    q: 'Are personal trainers available near Hammamet Nord?',
    a: 'Yes! Our certified coaches near Hammamet Nord create fully personalized training and nutrition programs based on your specific goals — weight loss, muscle gain, strength, or general fitness.',
  },
];

export default function GymHammametNordEnPage() {
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
                <li className="text-neutral-300">Gym Hammamet Nord</li>
              </ol>
            </nav>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="text-red-600">Gym near Hammamet Nord</span>
              <br />
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-200">
                ZY Bodybuilding — Mrezga, Nabeul, Tunisia
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto">
              The <strong className="text-white">best gym near Hammamet Nord, Tunisia</strong> — ZY Bodybuilding in Mrezga, Nabeul.
              Professional equipment, certified coaches, and personalized programs to transform your body.
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
              📍 Mrezga, Nabeul 8000, Tunisia &nbsp;·&nbsp; Minutes from Hammamet Nord &nbsp;·&nbsp;{' '}
              <a href="tel:+21658800554" className="hover:text-red-500 transition-colors">+216 58 800 554</a>
            </p>

            <p className="text-neutral-600 text-xs">
              Also available in:{' '}
              <Link href="/gym-hammamet-nord" className="text-red-600 hover:underline">Français</Link>
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-6 lg:px-16 bg-neutral-950">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              Why Choose <span className="text-red-600">ZY Bodybuilding</span> near Hammamet Nord?
            </h2>
            <p className="text-neutral-400 text-center text-lg mb-12 max-w-2xl mx-auto">
              Everything you need to reach your fitness goals, just minutes from Hammamet Nord, Tunisia.
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
                The <span className="text-red-600">Closest Full Gym</span> to Hammamet Nord
              </h2>
              <p className="text-neutral-300 leading-relaxed">
                Located in <strong>Mrezga, Nabeul</strong>, ZY Bodybuilding is just a few minutes from{' '}
                <strong>Hammamet Nord</strong> — making it the most accessible professional gym for residents
                of Hammamet Nord, Yasmine Hammamet, and the surrounding region.
              </p>
              <p className="text-neutral-300 leading-relaxed">
                Whether you want to build muscle, lose weight, improve your fitness, or train for sport,
                our gym near Hammamet Nord has everything: premium equipment, certified coaches, and a
                motivating community.
              </p>
              <ul className="space-y-3 text-neutral-300">
                {[
                  'State-of-the-art professional equipment',
                  'Certified and experienced coaches',
                  'Personalized programs included',
                  'Group classes for all levels',
                  'Welcoming and motivating atmosphere',
                  'Easy access from Hammamet Nord',
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
                <h3 className="text-xl font-bold text-red-600">Gym Information</h3>
                <div className="space-y-3 text-neutral-300 text-sm">
                  <p><strong className="text-white">Address:</strong> Mrezga, Nabeul 8000, Tunisia</p>
                  <p><strong className="text-white">Distance:</strong> A few minutes from Hammamet Nord</p>
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
                📍 Get Directions from Hammamet Nord — Google Maps
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6 lg:px-16 bg-neutral-950">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              FAQ — <span className="text-red-600">Gym near Hammamet Nord</span>
            </h2>
            <p className="text-neutral-400 text-center mb-10">
              Everything you need to know about ZY Bodybuilding, the best gym near Hammamet Nord, Tunisia.
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
              Ready to join the best <span className="text-red-600">gym near Hammamet Nord</span>?
            </h2>
            <p className="text-neutral-400 text-lg">
              Join ZY Bodybuilding in Mrezga — minutes from Hammamet Nord — and start your transformation
              with certified coaches and professional equipment.
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
            <p className="text-neutral-600 text-sm">
              ZY Bodybuilding — Mrezga, Nabeul 8000, Tunisia · Minutes from Hammamet Nord
            </p>
          </div>
        </section>

      </main>
    </>
  );
}
