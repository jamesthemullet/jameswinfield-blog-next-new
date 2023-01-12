import Head from 'next/head';
import { GetStaticProps } from 'next';
import Container from '../components/container';
import Nav from '../components/nav';
import Intro from '../components/intro';
import Layout from '../components/layout';
import PostBody from '../components/post-body';
import { getPage, getSocials } from '../lib/api';
import type { LearningProps } from '../lib/types';

export default function Learning({ socials, learning: { content } }: LearningProps) {
  return (
    <Layout socials={socials}>
      <Head>
        <title>Portfolio of James Winfield - a senior front-end software engineer in London.</title>
      </Head>
      <Nav />
      <Container>
        <>
          <Intro />
          <PostBody content={content} />
        </>
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const learning = await getPage('780');
  const socials = await getSocials();
  return {
    props: { learning, socials },
    revalidate: 10,
  };
};
