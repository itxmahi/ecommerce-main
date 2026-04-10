import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ruhqalam.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin-secret', '/api', '/checkout/success'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
