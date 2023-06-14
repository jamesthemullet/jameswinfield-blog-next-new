import Head from 'next/head';
import { GetStaticProps } from 'next';
import Container from '../components/container';
import Nav from '../components/nav';
import Intro from '../components/intro';
import Layout from '../components/layout';
import PostBody from '../components/post-body';
import { getPage, getSocials, getGithubProjects } from '../lib/api';
import type { PageProps } from '../lib/types';

export default function Projects({ page, socials, projects }: PageProps) {
  const { content, seo } = page;
  console.log(1, projects);
  const projectsToDisplay = projects
    .filter((project) => !project.isPrivate)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  console.log(2, projectsToDisplay);
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
          <div className="grid grid-cols-1 gap-4 mb-12 max-w-2xl mx-auto">
            {projectsToDisplay.map((project) => (
              <div key={project.id} className="p-4 border border-2 border-my-blue rounded">
                <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
                <p className="text-black mb-2">{project.description}</p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 block">
                  {project.url}
                </a>
                <a
                  href={project.homepageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 block">
                  {project.homepageUrl}
                </a>
              </div>
            ))}
          </div>
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
    props: { page, socials, projects },
    revalidate: 10,
  };
};
