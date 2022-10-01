import Head from "next/head";
import { GetStaticProps } from "next";
import Container from "../components/container";
import Nav from "../components/nav";
import Intro from "../components/intro";
import Layout from "../components/layout";
import { getPagesForHomePage, getSocials } from "../lib/api";
import HomePageSection from "../components/home-page-section";

export default function Index({ allPosts: { edges }, socials }) {
  return (
    <Layout preview={null} socials={socials}>
      <Head>
        <title>
          Portfolio of James Winfield - a front-end software engineer in London.
        </title>
      </Head>
      <Nav />
      <Container>
        <Intro />
        {edges.map((section) => {
          return <HomePageSection {...section?.node} key={section?.node.id} />;
        })}
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allPosts = await getPagesForHomePage();
  const socials = await getSocials();

  return {
    props: { allPosts, socials },
    revalidate: 10,
  };
};
