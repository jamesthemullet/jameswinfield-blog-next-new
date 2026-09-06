import { filterRecentPosts } from '../lib/utils';

type Post = { node: { date: string } };

function post(date: string): Post {
  return { node: { date } };
}

describe('filterRecentPosts', () => {
  const now = new Date('2026-09-03T12:00:00Z');

  it('keeps posts newer than two years ago', () => {
    const posts = [post('2026-01-01T00:00:00Z'), post('2025-01-01T00:00:00Z')];

    expect(filterRecentPosts(posts, false, now)).toEqual(posts);
  });

  it('excludes posts older than two years ago', () => {
    const recent = post('2025-01-01T00:00:00Z');
    const old = post('2023-01-01T00:00:00Z');

    expect(filterRecentPosts([recent, old], false, now)).toEqual([recent]);
  });

  it('excludes a post dated exactly two years ago (boundary is exclusive)', () => {
    const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
    const boundary = post(twoYearsAgo.toISOString());

    expect(filterRecentPosts([boundary], false, now)).toEqual([]);
  });

  it('returns every post unfiltered when showAll is true, regardless of date', () => {
    const posts = [post('2010-01-01T00:00:00Z'), post('2026-01-01T00:00:00Z')];

    expect(filterRecentPosts(posts, true, now)).toEqual(posts);
  });

  it('defaults to the current date when no reference date is given', () => {
    const posts = [post(new Date().toISOString())];

    expect(filterRecentPosts(posts, false)).toEqual(posts);
  });
});
