import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sharmcloudtours.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    { url: '/', priority: 1.0 },
    { url: '/tours', priority: 0.9 },
    { url: '/about', priority: 0.7 },
    { url: '/contact', priority: 0.7 },
    { url: '/faq', priority: 0.6 },
    { url: '/terms', priority: 0.5 },
    { url: '/privacy', priority: 0.5 },
  ];

  const routes = staticRoutes.map(route => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route.priority,
  }));

  try {
    const allTours = await db.tour.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    const tourUrls = allTours.map(tour => ({
      url: `${baseUrl}/tours/${tour.slug}`,
      lastModified: tour.updatedAt ? new Date(tour.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...routes, ...tourUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return routes;
  }
}