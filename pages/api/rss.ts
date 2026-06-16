import { NextApiRequest, NextApiResponse } from 'next';
import { getAllPostsForHome } from '../../lib/api';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default async function rss(req: NextApiRequest, res: NextApiResponse) {
  const posts = await getAllPostsForHome(false);
  const edges = posts?.edges ?? [];

  const siteUrl = 'https://www.jameswinfield.co.uk';

  const items = edges
    .map(({ node }: { node: { title: string; slug: string; date: string; excerpt: string } }) => {
      const url = `${siteUrl}/posts/${node.slug}`;
      const pubDate = new Date(node.date).toUTCString();
      const excerpt = (node.excerpt ?? '').replace(/<[^>]*>/g, '');
      return `    <item>
      <title>${escapeXml(node.title ?? '')}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(excerpt)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>James Winfield</title>
    <link>${siteUrl}</link>
    <description>Posts by James Winfield</description>
    <language>en-gb</language>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=600');
  res.status(200).send(xml);
}
