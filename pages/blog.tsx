import type { GetStaticProps } from 'next';
import { useMemo, useState } from 'react';
import Container from '../components/container';
import HeroPost from '../components/hero-post';
import Layout from '../components/layout';
import MoreStories from '../components/more-stories';
import Nav from '../components/nav';
import { getAllPostsForHome, getSocials } from '../lib/api';
import type { AllPostsProps } from '../lib/types';
import { filterRecentPosts } from '../lib/utils';

export default function Index({ allPosts: { edges }, preview, socials }: AllPostsProps) {
  const [showAllPosts, setShowAllPosts] = useState(false);

  const postsToShow = useMemo(
    () => filterRecentPosts(edges.slice(1), showAllPosts),
    [showAllPosts, edges],
  );

  const heroPost = edges[0]?.node;

  return (
    <Layout
      preview={preview}
      socials={socials}
      seo={null}
      title="Portfolio of James Winfield: My Journey To Becoming A Senior Software Engineer">
      <Nav />
      <Container>
        {heroPost && (
          <HeroPost
            title={heroPost.title}
            coverImage={heroPost.featuredImage}
            date={heroPost.date}
            author={heroPost.author}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt}
          />
        )}
        {Array.isArray(postsToShow) && <MoreStories posts={postsToShow} />}
        {!showAllPosts && (
          <div className="flex flex-col items-center">
            <button
              className="bg-my-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-16"
              onClick={() => setShowAllPosts(true)}>
              Show Older Blog Posts
            </button>
          </div>
        )}
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  try {
    const [allPosts, socials] = await Promise.all([getAllPostsForHome(preview), getSocials()]);

    return {
      props: { allPosts, preview, socials },
      revalidate: 3600,
    };
  } catch (_error) {
    return {
      props: { allPosts: { edges: [] }, preview, socials: null },
      revalidate: 3600,
    };
  }
};
