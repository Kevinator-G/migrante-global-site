import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

const LAST_STATIC_UPDATE = new Date('2025-04-01');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://migranteglobal.ch';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: LAST_STATIC_UPDATE, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/servicios`, lastModified: LAST_STATIC_UPDATE, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/servicios/orientacion-laboral`, lastModified: LAST_STATIC_UPDATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/servicios/alojamiento`, lastModified: LAST_STATIC_UPDATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/servicios/cv-formato-suizo`, lastModified: LAST_STATIC_UPDATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/servicios/clases-aleman`, lastModified: LAST_STATIC_UPDATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/servicios/tramites`, lastModified: LAST_STATIC_UPDATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/servicios/comunidad-apoyo`, lastModified: LAST_STATIC_UPDATE, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/servicios/sesiones-uno-a-uno`, lastModified: LAST_STATIC_UPDATE, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/servicios/generador-documentos`, lastModified: LAST_STATIC_UPDATE, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/legal/privacidad`, lastModified: LAST_STATIC_UPDATE, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/legal/cookies`, lastModified: LAST_STATIC_UPDATE, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { createdAt: 'desc' },
  });

  const blogPages: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
