import { GetStaticProps } from 'next';
import Container from '../components/container';
import Nav from '../components/nav';
import Intro from '../components/intro';
import Layout from '../components/layout';
import PostBody from '../components/post-body';
import { getPage, getSocials } from '../lib/api';
import type { PageProps } from '../lib/types';
import data from '../projects.json';
import Image from 'next/image';

type ProjectProps = {
  name: string;
  builtAt?: string;
  why: string;
  learn: string;
  different: string;
  screenshot?: string;
  technologies?: string[];
};

export default function Projects({ page, socials }: PageProps) {
  const { content, seo } = page;
  const projectsToDisplay = [...(data as ProjectProps[])].sort((a, b) => {
    const getTime = (value?: string) => {
      if (!value) return 0;
      const parsed = new Date(value).getTime();
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    return getTime(b.builtAt) - getTime(a.builtAt);
  });

  const formatBuildDate = (value?: string) => {
    if (!value) return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  };

  return (
    <Layout socials={socials} seo={seo}>
      <Nav />
      <Container>
        <>
          <Intro />
          <PostBody content={content} />
          <div className="grid grid-cols-1 gap-4 mb-12 max-w-4xl mx-auto mt-8">
            {projectsToDisplay.map((project) => (
              <div key={project.name} className="pt-4 border-t-2 border-my-blue ">
                <h2 className="text-3xl font-bold mb-2">{project.name}</h2>
                {project.screenshot && (
                  <div className="mt-4">
                    <Image
                      src={project.screenshot}
                      alt={`${project.name} screenshot`}
                      width={800}
                      height={400}
                    />
                  </div>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <>
                    <h3 className="text-xl font-bold mt-4">What technology did I use?</h3>
                    <ul className="flex flex-wrap gap-2 mt-2">
                      {project.technologies.map((tech) => (
                        <li
                          key={`${project.name}-${tech}`}
                          className="bg-gray-100 text-sm px-3 py-1 rounded-full text-gray-800">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <h3 className="text-xl font-bold mt-4">When did I build it?</h3>
                <p className="mt-2">{formatBuildDate(project.builtAt) || 'Coming soon...'}</p>
                <h3 className="text-xl font-bold mt-4">Why did I build it?</h3>
                <p className="mt-2">{project.why || 'Coming soon...'}</p>
                <h3 className="text-xl font-bold mt-4">What did I learn?</h3>
                <p className="mt-2">{project.learn || 'Coming soon...'}</p>
                <h3 className="text-xl font-bold mt-4">What would I do differently next time?</h3>
                <p className="mt-2">{project.different || 'Coming soon...'}</p>
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

    return {
      props: { page, socials },
      revalidate: 10,
    };
  } catch (error) {
    console.error('Error fetching data for /projects:', error);

    return {
      props: {
        page: { content: '', seo: {} },
        socials: [],
      },
      revalidate: 10,
    };
  }
};
