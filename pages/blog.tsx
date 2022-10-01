import Head from "next/head";
import { GetStaticProps } from "next";
import Container from "../components/container";
import MoreStories from "../components/more-stories";
import HeroPost from "../components/hero-post";
import Nav from "../components/nav";
import Layout from "../components/layout";
import { getAllPostsForHome, getSocials } from "../lib/api";

export default function Index({ allPosts: { edges }, preview, socials }) {
  const heroPost = edges[0]?.node;
  const morePosts = edges.slice(1);

  console.log(4, heroPost);

  return (
    <Layout preview={preview} socials={socials}>
      <Head>
        <title>
          Portfolio of James Winfield - a front-end software engineer in London.
        </title>
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
  const socials = await getSocials();

  console.log(60, socials);

  return {
    props: { allPosts, preview, socials },
    revalidate: 10,
  };
};
