export default function sitemap() {
  const baseUrl = 'https://www.zybodybuilding.space';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/gym-nabeul`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/marketplace`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Note: /register and /login are noindex — excluded from sitemap intentionally.
    // Note: fragment URLs (#about, #pricing, etc.) are not valid sitemap entries —
    // Google does not crawl fragment-only URLs as separate pages.
  ];
}
