import type { GetStaticProps } from 'next';
import { useMemo, useState } from 'react';
import Container from '../components/container';
import HeroPost from '../components/hero-post';
import Layout from '../components/layout';
import MoreStories from '../components/more-stories';
import Nav from '../components/nav';
import { getAllPostsForHome, getSocials } from '../lib/api';
import type { AllPostsProps } from '../lib/types';

export default function Index({ allPosts: { edges }, preview, socials }: AllPostsProps) {
  const [showAllPosts, setShowAllPosts] = useState(false);

  const postsToShow = useMemo(() => {
    if (showAllPosts) return edges.slice(1);
    const now = new Date();
    const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
    return edges.slice(1).filter((a) => new Date(a.node.date).getTime() > twoYearsAgo.getTime());
  }, [showAllPosts, edges]);

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
  const [allPosts, socials] = await Promise.all([getAllPostsForHome(preview), getSocials()]);

  return {
    props: { allPosts, preview, socials },
    revalidate: 3600,
  };
};
