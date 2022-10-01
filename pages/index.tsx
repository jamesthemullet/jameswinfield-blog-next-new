import Head from "next/head";
import { GetStaticProps } from "next";
import Container from "../components/container";
import Nav from "../components/nav";
import Intro from "../components/intro";
import Layout from "../components/layout";
import { getAllPostsForHome } from "../lib/api";

export default function Index({ allPosts: { edges }, preview }) {
  return (
    <Layout preview={preview}>
      <Head>
        <title>
          Portfolio of James Winfield - a front-end software engineer in London.
        </title>
      </Head>
      <Container>
        <Nav />
        <Intro />
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
