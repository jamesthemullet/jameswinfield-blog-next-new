import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllPostsWithSlug } from '../../lib/api';

const SITE_URL = 'https://www.jameswinfield.co.uk';

const STATIC_ROUTES = ['', '/blog', '/projects', '/timeline'];

export default async function sitemap(_req: NextApiRequest, res: NextApiResponse) {
  const posts = await getAllPostsWithSlug();
  const edges = posts?.edges ?? [];

  const staticUrls = STATIC_ROUTES.map((route) => `${SITE_URL}${route}`);
  const postUrls = edges.map(
    ({ node }: { node: { slug: string } }) => `${SITE_URL}/posts/${node.slug}`,
  );

  const urls = [...staticUrls, ...postUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=600');
  res.status(200).send(xml);
}
