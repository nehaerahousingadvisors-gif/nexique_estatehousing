import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.nexiqueestate.com';

const blogSlugs = [
  'top-residential-projects-noida-2025',
  'commercial-vs-residential-investment',
  'rera-explained-home-buyers',
  'home-loan-tips-first-time-buyers',
  'yamuna-expressway-real-estate-growth',
  'ready-to-move-vs-under-construction',
];

export default function sitemap(): MetadataRoute.Sitemap {
  // ── Public static pages ────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/career`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/asset-management`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // ── Blog post pages ────────────────────────────────────────────────────────
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Private pages NOT included:
  // /login, /register, /admin, /admin/add-project,
  // /my-properties, /post-property, /edit-property/[id]

  return [...staticPages, ...blogPages];
}
