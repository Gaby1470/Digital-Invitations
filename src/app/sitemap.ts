import { MetadataRoute } from 'next';
import { templateConfig } from '@/lib/templateConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://digital-invitations.com';

  // Static pages
  const staticRoutes = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/templates`,
      lastModified: new Date(),
    },
    {
        url: `${siteUrl}/how-it-works`,
        lastModified: new Date(),
    },
    {
        url: `${siteUrl}/pricing`,
        lastModified: new Date(),
    },
    {
        url: `${siteUrl}/contact`,
        lastModified: new Date(),
    },
  ];

  // Dynamic pages from templateConfig
  const templateRoutes = Object.keys(templateConfig).map((id) => ({
    url: `${siteUrl}/templates/${id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...templateRoutes];
}
