import type { GetStaticProps } from 'next';
import Container from '../components/container';
import HireCta from '../components/hire-cta';
import HomePageSection from '../components/home-page-section';
import Intro from '../components/intro';
import Layout from '../components/layout';
import Nav from '../components/nav';
import { getPagesForHomePage, getSocials } from '../lib/api';
import type { AllPostsProps } from '../lib/types';

export default function Index({ allPosts: { edges }, socials }: AllPostsProps) {
  return (
    <Layout preview={null} socials={socials} seo={null}>
      <Nav />
      <Container>
        <Intro />
        <HireCta available={true} />
        {edges.map((section) => {
          return <HomePageSection {...section?.node} key={section?.node.id} />;
        })}
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [allPosts, socials] = await Promise.all([getPagesForHomePage(), getSocials()]);

    return {
      props: { allPosts, socials },
      revalidate: 3600,
    };
  } catch (_error) {
    return {
      props: { allPosts: { edges: [] }, socials: null },
      revalidate: 3600,
    };
  }
};
