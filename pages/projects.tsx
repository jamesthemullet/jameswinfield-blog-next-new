import { GetStaticProps } from 'next';
import Container from '../components/container';
import Nav from '../components/nav';
import Intro from '../components/intro';
import Layout from '../components/layout';
import PostBody from '../components/post-body';
import { getPage, getSocials, getGithubProjects } from '../lib/api';
import type { PageProps } from '../lib/types';
import data from '../projects.json';
import Image from 'next/image';

type ProjectProps = {
  id: string;
  name: string;
  description: string;
  url: string;
  isPrivate: string;
  createdAt: string;
  updatedAt: string;
  homepageUrl: string;
  screenshot: string;
};

export default function Projects({ page, socials, projects }: PageProps) {
  const { content, seo } = page;
  const projectsToDisplay = projects
    .filter((project) => !project.isPrivate)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Layout socials={socials} seo={seo}>
      <Nav />
      <Container>
        <>
          <Intro />
          <PostBody content={content} />
          <div className="grid grid-cols-1 gap-4 mb-12 max-w-4xl mx-auto mt-8">
            {projectsToDisplay.map((project: ProjectProps) => (
              <div key={project.id} className="pt-4 border-t-2 border-my-blue ">
                <h2 className="text-3xl font-bold mb-2">{project.name}</h2>
                <p className="text-black mb-2">{project.description}</p>
                <p className="text-black mb-2">
                  Date started: {new Date(project.createdAt).toLocaleDateString('en-GB')}
                </p>
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
                {(() => {
                  const projectData = data.find((d) => d.name === project.name);

                  return (
                    projectData.screenshot && (
                      <div className="mt-4">
                        <Image
                          src={projectData.screenshot}
                          alt={projectData.name}
                          width={800}
                          height={400}
                        />
                      </div>
                    )
                  );
                })()}
                <h3 className="text-xl font-bold mt-4">Why did I build it?</h3>
                <p className="mt-2">
                  {(() => {
                    const projectData = data.find((d) => d.name === project.name);
                    return projectData ? projectData.why : 'Coming soon...';
                  })()}
                </p>
                <h3 className="text-xl font-bold mt-4">What did I learn?</h3>
                <p className="mt-2">
                  {(() => {
                    const projectData = data.find((d) => d.name === project.name);
                    return projectData ? projectData.learn : 'Coming soon...';
                  })()}
                </p>
                <h3 className="text-xl font-bold mt-4">What would I do differently next time?</h3>
                <p className="mt-2">
                  {(() => {
                    const projectData = data.find((d) => d.name === project.name);
                    return projectData ? projectData.different : 'Coming soon...';
                  })()}
                </p>
              </div>
            ))}
          </div>
        </>
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const page = await getPage('783');
    const socials = await getSocials();
    const projects = await getGithubProjects();

    return {
      props: { page, socials, projects },
      revalidate: 10,
    };
  } catch (error) {
    console.error('Error fetching data for /projects:', error);

    return {
      props: {
        page: { content: '', seo: {} },
        socials: [],
        projects: [],
      },
      revalidate: 10,
    };
  }
};
