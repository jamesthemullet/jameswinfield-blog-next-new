import type { GetStaticProps } from 'next';
import Container from '../components/container';
import Intro from '../components/intro';
import Layout from '../components/layout';
import Nav from '../components/nav';
import PostBody from '../components/post-body';
import { getPage, getSocials } from '../lib/api';
import type { PageProps } from '../lib/types';

export default function Timeline({ socials, page }: PageProps) {
  const { content, seo } = page;
  return (
    <Layout socials={socials} seo={seo}>
      <Nav />
      <Container>
        <Intro heading="Timeline." />
        <PostBody content={content} />
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [page, socials] = await Promise.all([getPage('786'), getSocials()]);
    return {
      props: { page, socials },
      revalidate: 86400,
    };
  } catch (_error) {
    return {
      props: { page: { content: '', seo: {} }, socials: null },
      revalidate: 86400,
    };
  }
};
