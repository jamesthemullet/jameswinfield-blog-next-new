import Head from 'next/head';
import { GetStaticProps } from 'next';
import Container from '../components/container';
import MoreStories from '../components/more-stories';
import HeroPost from '../components/hero-post';
import Nav from '../components/nav';
import Layout from '../components/layout';
import { getAllPostsForHome, getSocials } from '../lib/api';

type AllPostsProps = {
  allPosts: {
    edges: {
      node: {
        featuredImage: {
          node: {
            sourceUrl: string;
            mediaDetails: { width: number; height: number };
            featuredImage: string;
          };
        };
        title: string;
        coverImage: {
          node: {
            sourceUrl: string;
            mediaDetails: {
              width: number;
              height: number;
            };
          };
        };
        date: string;
        excerpt: string;
        author: {
          node: {
            firstName: string;
            lastName: string;
            name: string;
            avatar: {
              url: string;
            };
          };
        };
        slug: string;
      };
    }[];
  };
  preview: string;
  socials: {
    content: string;
  };
};

export default function Index({ allPosts: { edges }, preview, socials }: AllPostsProps) {
  const heroPost = edges[0]?.node;
  const morePosts = edges.slice(1);

  return (
    <Layout preview={preview} socials={socials}>
      <Head>
        <title>Portfolio of James Winfield - a front-end software engineer in London.</title>
      </Head>
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
        {Array.isArray(morePosts) && <MoreStories posts={morePosts} />}
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
