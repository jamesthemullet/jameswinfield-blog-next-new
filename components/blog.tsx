import Head from 'next/head';
import { GetStaticProps } from 'next';
import Container from '../components/container';
import MoreStories from '../components/more-stories';
import HeroPost from '../components/hero-post';
import Nav from '../components/nav';
import Layout from '../components/layout';
import { getAllPostsForHome } from '../lib/api';

type IndexProps = {
  allPosts: {
    edges: {
      node: {
        title: string;
        featuredImage: {
          node: {
            sourceUrl: string;
            featuredImage: string;
            mediaDetails: {
              width: number;
              height: number;
            };
          };
        };
        coverImage: {
          node: {
            sourceUrl: string;
            mediaDetails: {
              width: number;
              height: number;
            };
            featuredImage: string;
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

export default function Index({ allPosts: { edges }, preview, socials }: IndexProps) {
  const heroPost = edges[0]?.node;
  const morePosts = edges.slice(1);

  return (
    <Layout preview={preview} socials={socials}>
      <Head>
        <title>Portfolio of James Winfield - a senior front-end software engineer in London.</title>
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
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const allPosts = await getAllPostsForHome(preview);

  return {
    props: { allPosts, preview },
    revalidate: 10,
  };
};
