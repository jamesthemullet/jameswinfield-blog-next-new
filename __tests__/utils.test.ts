import { buildArticleJsonLd, filterRecentPosts } from '../lib/utils';

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

describe('buildArticleJsonLd', () => {
  it('includes the required BlogPosting fields', () => {
    const jsonLd = buildArticleJsonLd({
      title: 'My Post',
      url: 'https://www.jameswinfield.co.uk/posts/my-post',
      datePublished: '2026-01-01T00:00:00Z',
    });

    expect(jsonLd).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'My Post',
      datePublished: '2026-01-01T00:00:00Z',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://www.jameswinfield.co.uk/posts/my-post',
      },
    });
  });

  it('adds description, author, and image when provided', () => {
    const jsonLd = buildArticleJsonLd({
      title: 'My Post',
      url: 'https://www.jameswinfield.co.uk/posts/my-post',
      datePublished: '2026-01-01T00:00:00Z',
      description: 'A great post',
      authorName: 'James Winfield',
      imageUrl: 'https://www.jameswinfield.co.uk/image.png',
    });

    expect(jsonLd).toMatchObject({
      description: 'A great post',
      author: { '@type': 'Person', name: 'James Winfield' },
      image: ['https://www.jameswinfield.co.uk/image.png'],
    });
  });

  it('omits optional fields that are not provided', () => {
    const jsonLd = buildArticleJsonLd({
      title: 'My Post',
      url: 'https://www.jameswinfield.co.uk/posts/my-post',
      datePublished: '2026-01-01T00:00:00Z',
    });

    expect(jsonLd).not.toHaveProperty('description');
    expect(jsonLd).not.toHaveProperty('author');
    expect(jsonLd).not.toHaveProperty('image');
  });
});
