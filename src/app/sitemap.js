export default function sitemap() {
  const baseUrl = 'https://www.zybodybuilding.space';
  const now = new Date();

  return [
    // Homepage
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          'fr-TN': baseUrl,
          'en': `${baseUrl}/en`,
        },
      },
    },

    // French landing pages
    {
      url: `${baseUrl}/gym-hammamet`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
      alternates: {
        languages: {
          'fr-TN': `${baseUrl}/gym-hammamet`,
          'en': `${baseUrl}/en/gym-hammamet`,
        },
      },
    },
    {
      url: `${baseUrl}/salle-de-sport-hammamet`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
      alternates: {
        languages: {
          'fr-TN': `${baseUrl}/salle-de-sport-hammamet`,
          'en': `${baseUrl}/en/gym-hammamet`,
        },
      },
    },
    {
      url: `${baseUrl}/gym-hammamet-nord`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
      alternates: {
        languages: {
          'fr-TN': `${baseUrl}/gym-hammamet-nord`,
          'en': `${baseUrl}/en/gym-hammamet-nord`,
        },
      },
    },
    {
      url: `${baseUrl}/fitness-hammamet`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.90,
      alternates: {
        languages: {
          'fr-TN': `${baseUrl}/fitness-hammamet`,
          'en': `${baseUrl}/en/fitness-hammamet`,
        },
      },
    },
    {
      url: `${baseUrl}/gym-nabeul`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
      alternates: {
        languages: {
          'fr-TN': `${baseUrl}/gym-nabeul`,
          'en': `${baseUrl}/en/gym-nabeul`,
        },
      },
    },
    {
      url: `${baseUrl}/salle-de-sport-nabeul`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.90,
      alternates: {
        languages: {
          'fr-TN': `${baseUrl}/salle-de-sport-nabeul`,
          'en': `${baseUrl}/en/gym-nabeul`,
        },
      },
    },

    // English landing pages
    {
      url: `${baseUrl}/en/gym-hammamet`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.90,
      alternates: {
        languages: {
          'fr-TN': `${baseUrl}/gym-hammamet`,
          'en': `${baseUrl}/en/gym-hammamet`,
        },
      },
    },
    {
      url: `${baseUrl}/en/gym-hammamet-nord`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.90,
      alternates: {
        languages: {
          'fr-TN': `${baseUrl}/gym-hammamet-nord`,
          'en': `${baseUrl}/en/gym-hammamet-nord`,
        },
      },
    },
    {
      url: `${baseUrl}/en/gym-nabeul`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
      alternates: {
        languages: {
          'fr-TN': `${baseUrl}/salle-de-sport-nabeul`,
          'en': `${baseUrl}/en/gym-nabeul`,
        },
      },
    },
    {
      url: `${baseUrl}/en/fitness-hammamet`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
      alternates: {
        languages: {
          'fr-TN': `${baseUrl}/fitness-hammamet`,
          'en': `${baseUrl}/en/fitness-hammamet`,
        },
      },
    },

    // Marketplace
    {
      url: `${baseUrl}/marketplace`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.80,
    },
  ];
}
