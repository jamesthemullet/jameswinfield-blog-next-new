import Head from 'next/head';
import { GetStaticProps } from 'next';
import Container from '../components/container';
import Nav from '../components/nav';
import Intro from '../components/intro';
import Layout from '../components/layout';
import { getPagesForHomePage, getSocials } from '../lib/api';
import HomePageSection from '../components/home-page-section';
import type { AllPostsProps } from '../lib/types';

export default function Index({ allPosts: { edges }, socials }: AllPostsProps) {
  return (
    <Layout preview={null} socials={socials} seo={null}>
      <Nav />
      <Container>
        <>
          <Intro />
          {edges.map((section) => {
            return <HomePageSection {...section?.node} key={section?.node.id} />;
          })}
        </>
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
