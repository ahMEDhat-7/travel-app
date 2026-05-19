import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/auth/',
        '/_next/',
        '/static/',
      ],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || 'https://sharmcloudtours.com'}/sitemap.xml`,
  };
}