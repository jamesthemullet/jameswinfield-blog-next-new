import Head from 'next/head';
import { GetStaticProps } from 'next';
import Container from '../components/container';
import Nav from '../components/nav';
import Intro from '../components/intro';
import Layout from '../components/layout';
import PostBody from '../components/post-body';
import { getPage, getSocials, getGithubProjects } from '../lib/api';
import type { PageProps } from '../lib/types';

export default function Projects({ socials, page }: PageProps) {
  const { content, seo } = page;
  return (
    <Layout socials={socials} seo={seo}>
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
  const page = await getPage('783');
  const socials = await getSocials();
  const projects = await getGithubProjects();
  console.log(10, projects);
  return {
    props: { page, socials },
    revalidate: 10,
  };
};
