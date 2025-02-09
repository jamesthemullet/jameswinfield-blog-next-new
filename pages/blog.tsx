import Head from 'next/head';
import { GetStaticProps } from 'next';
import Container from '../components/container';
import MoreStories from '../components/more-stories';
import HeroPost from '../components/hero-post';
import Nav from '../components/nav';
import Layout from '../components/layout';
import { getAllPostsForHome, getSocials } from '../lib/api';
import { AllPostsProps } from '../lib/types';
import { useState, useEffect } from 'react';

export default function Index({ allPosts: { edges }, preview, socials }: AllPostsProps) {
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [postsToShow, setPostsToShow] = useState([]);
  useEffect(() => {
    if (showAllPosts) {
      setPostsToShow(edges.slice(1));
    } else {
      const now = new Date();
      const TwoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
      setPostsToShow(
        edges.slice(1).filter((a) => new Date(a.node.date).getTime() > TwoYearsAgo.getTime())
      );
    }
  }, [showAllPosts]);

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
  const allPosts = await getAllPostsForHome(preview);
  const socials = await getSocials();

  return {
    props: { allPosts, preview, socials },
    revalidate: 10,
  };
};
