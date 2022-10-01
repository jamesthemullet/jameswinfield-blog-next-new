import Head from "next/head";
import { GetStaticProps } from "next";
import Container from "../components/container";
import Nav from "../components/nav";
import Intro from "../components/intro";
import Layout from "../components/layout";
import { getPagesForHomePage } from "../lib/api";
import HomePageSection from "../components/home-page-section";

export default function Index({ allPosts: { edges } }) {
  return (
    <Layout preview={null}>
      <Head>
        <title>
          Portfolio of James Winfield - a front-end software engineer in London.
        </title>
      </Head>
      <Container>
        <Nav />
        <Intro />
        {edges.map((section) => {
          return <HomePageSection {...section?.node} />;
        })}
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allPosts = await getPagesForHomePage();

  return {
    props: { allPosts },
    revalidate: 10,
  };
};
