import { GetStaticProps } from 'next';
import Container from '../components/container';
import Nav from '../components/nav';
import Intro from '../components/intro';
import Layout from '../components/layout';
import PostBody from '../components/post-body';
import { getPage, getSocials } from '../lib/api';
import type { PageProps } from '../lib/types';

export default function Timeline({ socials, page }: PageProps) {
  const { content, seo } = page;
  return (
    <Layout socials={socials} seo={seo}>
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
  const page = await getPage('786');
  const socials = await getSocials();
  return {
    props: { page, socials },
    revalidate: 10,
  };
};
