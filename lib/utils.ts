export function readingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.ceil(words / 230);
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
