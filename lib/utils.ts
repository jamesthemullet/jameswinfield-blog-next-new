import type { ProjectProps } from './types';

export function readingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.ceil(words / 230);
}

function getBuildTime(value?: string): number {
  if (!value) return 0;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function sortProjectsByBuildDate(projects: ProjectProps[]): ProjectProps[] {
  return [...projects].sort((a, b) => getBuildTime(b.builtAt) - getBuildTime(a.builtAt));
}

export function getAllTechnologies(projects: ProjectProps[]): string[] {
  const techs = new Set<string>();
  projects.forEach((p) => p.technologies?.forEach((t) => techs.add(t)));
  return [...techs].sort();
}

export function filterProjectsByTech(
  projects: ProjectProps[],
  selectedTech: string | null
): ProjectProps[] {
  return selectedTech
    ? projects.filter((p) => p.technologies?.includes(selectedTech))
    : projects;
}

export function formatBuildDate(value?: string): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

export function filterRecentPosts<T extends { node: { date: string } }>(
  posts: T[],
  showAll: boolean,
  now: Date = new Date(),
): T[] {
  if (showAll) return posts;
  const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
  return posts.filter((post) => new Date(post.node.date).getTime() > twoYearsAgo.getTime());
}

export function buildArticleJsonLd(params: {
  title: string;
  url: string;
  datePublished: string;
  description?: string;
  authorName?: string;
  imageUrl?: string;
}): Record<string, unknown> {
  const { title, url, datePublished, description, authorName, imageUrl } = params;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    datePublished,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(description ? { description } : {}),
    ...(authorName ? { author: { '@type': 'Person', name: authorName } } : {}),
    ...(imageUrl ? { image: [imageUrl] } : {}),
  };
}
