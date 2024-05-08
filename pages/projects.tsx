import Head from 'next/head';
import { GetStaticProps } from 'next';
import Container from '../components/container';
import Nav from '../components/nav';
import Intro from '../components/intro';
import Layout from '../components/layout';
import PostBody from '../components/post-body';
import { getPage, getSocials, getGithubProjects } from '../lib/api';
import type { PageProps } from '../lib/types';
import data from '../projects.json';

export default function Projects({ page, socials, projects }: PageProps) {
  const { content, seo } = page;
  console.log(2, projects);
  console.log(3, data);
  console.log(
    4,
    data.filter((project) => project.name === 'djmix2022')
  );
  const projectsToDisplay = projects
    .filter((project) => !project.isPrivate)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
          <div className="grid grid-cols-1 gap-4 mb-12 max-w-4xl mx-auto mt-8">
            {projectsToDisplay.map((project) => (
              <div key={project.id} className="pt-4 border-t-2 border-my-blue ">
                <h2 className="text-3xl font-bold mb-2">{project.name}</h2>
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
                <h3 className="text-xl font-bold mt-4">Why did I build it?</h3>
                <p className="mt-2">Coming soon...</p>
                <h3 className="text-xl font-bold mt-4">What did I learn?</h3>
                <p className="mt-2">Coming soon...</p>
                <h3 className="text-xl font-bold mt-4">What would I do differently next time?</h3>
                <p className="mt-2">Coming soon...</p>
                {/* {data.filter((data) => data.name === project.name).length > 0 && <p>test</p>} */}
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
