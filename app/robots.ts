import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/login',
          '/my-properties',
          '/post-property',
          '/edit-property',
          '/asset-management/admin',
        ],
      },
    ],
    sitemap: 'https://www.nexiqueestate.com/sitemap.xml',
  };
}
