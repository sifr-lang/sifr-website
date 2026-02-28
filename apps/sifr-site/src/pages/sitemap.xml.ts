import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

const fallbackSiteUrl = new URL('https://sifr.sh');

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export async function GET({ site }: APIContext) {
  const resolvedSite = site ?? fallbackSiteUrl;
  const posts = await getCollection('blog');

  const staticPages = [
    { path: '/', lastmod: null as Date | null },
    { path: '/blog', lastmod: null as Date | null },
  ];

  const blogPages = posts.map((post) => ({
    path: `/blog/${post.slug}`,
    lastmod: post.data.updated ?? post.data.date,
  }));

  const urls = [...staticPages, ...blogPages]
    .map((entry) => {
      const loc = new URL(entry.path, resolvedSite).toString();
      const lastmodTag = entry.lastmod
        ? `<lastmod>${entry.lastmod.toISOString()}</lastmod>`
        : '';

      return `<url><loc>${escapeXml(loc)}</loc>${lastmodTag}</url>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
