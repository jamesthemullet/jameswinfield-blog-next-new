import type { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import Container from '../components/container';
import JobCard from '../components/JobCard';
import Layout from '../components/layout';
import Nav from '../components/nav';
import { getSocials } from '../lib/api';
import type { Job, seoProps } from '../lib/types';

const SKILL_OPTIONS = [
  { id: 'react', label: 'React / Next.js' },
  { id: 'typescript', label: 'TypeScript / JavaScript' },
  { id: 'nodejs', label: 'Node.js / Backend' },
  { id: 'css', label: 'CSS / Tailwind / UI' },
];

const SKILL_KEYWORDS: Record<string, string[]> = {
  react: ['react', 'reactjs', 'next.js', 'nextjs', 'next js'],
  typescript: ['typescript', 'ts', 'typesafe'],
  nodejs: ['node', 'node.js', 'nodejs', 'express', 'nest.js', 'nestjs'],
  css: ['css', 'tailwind', 'scss', 'styled-components', 'sass', 'frontend', 'front-end'],
};

const MIN_SALARY = 100_000;

function computeSuitability(job: Job, selectedSkills: string[]): number {
  const lowerText = `${job.title} ${job.description}`.toLowerCase();

  // Skills match — 40 pts
  let skillScore = 0;
  if (selectedSkills.length > 0) {
    const matched = selectedSkills.filter((skill) =>
      (SKILL_KEYWORDS[skill] ?? [skill]).some((kw) => lowerText.includes(kw))
    );
    skillScore = Math.round((matched.length / selectedSkills.length) * 40);
  } else {
    skillScore = 20;
  }

  // Salary match — 30 pts
  let salaryScore = 0;
  if (job.salaryMax !== null && job.salaryMax >= MIN_SALARY) {
    salaryScore = 30;
  } else if (job.salaryMin !== null && job.salaryMin >= MIN_SALARY) {
    salaryScore = 25;
  } else if (job.salaryMin !== null && job.salaryMin >= 80_000) {
    salaryScore = 10;
  } else if (job.salaryMin === null && job.salaryMax === null) {
    salaryScore = 15;
  }

  // Remote / location match — 30 pts
  let locationScore = 0;
  if (lowerText.includes('fully remote') || lowerText.includes('100% remote')) {
    locationScore = 30;
  } else if (lowerText.includes('remote')) {
    locationScore = 25;
  } else if (lowerText.includes('hybrid')) {
    locationScore = 20;
  } else if (job.location.toLowerCase().includes('london')) {
    locationScore = 15;
  }

  return Math.min(100, skillScore + salaryScore + locationScore);
}

type SearchParams = {
  skills: string[];
  location: string;
  remoteOnly: boolean;
  page: number;
};

type JobsPageProps = {
  socials: { content: string };
};

const SEO: seoProps = {
  canonical: '',
  focuskw: '',
  metaDesc: 'Find the best senior developer jobs matching my skills in React, TypeScript, Node.js and more.',
  metaKeywords: '',
  opengraphDescription: 'Job search filtered for React, TypeScript, Node.js and remote-first roles.',
  opengraphTitle: 'Jobs | James Winfield',
  opengraphUrl: '',
  opengraphSiteName: 'James Winfield',
  opengraphImage: { uri: '', altText: '', mediaItemUrl: '', mediaDetails: { width: '', height: '' } },
  title: 'Jobs | James Winfield',
};

export default function Jobs({ socials }: JobsPageProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['react', 'typescript', 'nodejs', 'css']);
  const [location, setLocation] = useState('London');
  const [remoteOnly, setRemoteOnly] = useState(false);

  const [searchParams, setSearchParams] = useState<SearchParams>({
    skills: ['react', 'typescript', 'nodejs', 'css'],
    location: 'London',
    remoteOnly: false,
    page: 1,
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiUnconfigured, setApiUnconfigured] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const { skills, location: loc, remoteOnly: remote, page } = searchParams;
    if (skills.length === 0) return;

    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      skills: skills.join(','),
      location: loc,
      page: String(page),
    });
    if (remote) params.set('remote', '1');

    fetch(`/api/jobs?${params.toString()}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, status: res.status, data })))
      .then(({ ok, status, data }) => {
        if (status === 503 && data.error === 'JSEARCH_UNCONFIGURED') {
          setApiUnconfigured(true);
          return;
        }
        if (!ok) throw new Error(data.error ?? 'Failed to fetch jobs');

        const sorted = [...(data.jobs as Job[])].sort(
          (a, b) => computeSuitability(b, skills) - computeSuitability(a, skills)
        );
        setJobs(sorted);
        setTotal(data.total);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Something went wrong')
      )
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ skills: selectedSkills, location, remoteOnly, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSkill = (id: string) => {
    setSelectedSkills((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const totalPages = Math.max(1, Math.ceil(total / 10));

  return (
    <Layout socials={socials} seo={SEO}>
      <Nav />
      <Container>
        <div className="max-w-5xl mx-auto py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Job Search</h1>
          <p className="text-gray-600 mb-8 text-sm">
            Senior developer roles · London · Remote-first · £100k+ · via Google Jobs (LinkedIn, WTTJ, Indeed &amp; more)
          </p>

          {/* Filters */}
          <form onSubmit={handleSearch} className="bg-my-light rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <fieldset>
                <legend className="font-bold text-gray-900 mb-3 text-sm">Skills</legend>
                <div className="flex flex-col gap-2">
                  {SKILL_OPTIONS.map((skill) => (
                    <label key={skill.id} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill.id)}
                        onChange={() => toggleSkill(skill.id)}
                        className="w-4 h-4 accent-my-blue"
                      />
                      {skill.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="location" className="font-bold text-gray-900 block mb-1 text-sm">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. London"
                    className="w-full border-2 border-gray-300 rounded px-3 py-2 text-sm focus:border-my-blue focus:outline-none"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={remoteOnly}
                    onChange={(e) => setRemoteOnly(e.target.checked)}
                    className="w-4 h-4 accent-my-blue"
                  />
                  Remote only
                </label>

                <div className="text-xs text-gray-500 bg-white rounded p-3 border border-gray-200 leading-relaxed">
                  <span className="font-semibold block mb-1">How suitability is scored</span>
                  Skills match (40 pts) + salary ≥ £100k (30 pts) + remote fit (30 pts)
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || selectedSkills.length === 0}
              className="mt-6 bg-my-blue text-white font-bold px-8 py-3 rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Searching…' : 'Search Jobs'}
            </button>
          </form>

          {/* API not configured */}
          {apiUnconfigured && (
            <div className="bg-my-yellow border-2 border-yellow-400 rounded-lg p-6">
              <h2 className="font-bold text-lg mb-2">API key not configured</h2>
              <p className="text-sm mb-3">
                Subscribe to{' '}
                <a
                  href="https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold">
                  JSearch on RapidAPI
                </a>{' '}
                (free tier available), then add to{' '}
                <code className="bg-white px-1 rounded">.env.local</code>:
              </p>
              <pre className="bg-white text-sm rounded p-3 inline-block">JSEARCH_API_KEY=your_rapidapi_key</pre>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border-2 border-my-red text-my-red rounded-lg p-4 text-sm mb-6">
              {error}
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`skeleton-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: stable skeleton list
                    i
                  }`}
                  className="border-2 border-gray-200 rounded-lg p-5 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-full mb-1" />
                  <div className="h-4 bg-gray-100 rounded w-5/6" />
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {!loading && !apiUnconfigured && jobs.length > 0 && (
            <>
              <p className="text-sm text-gray-500 mb-4">
                {total} jobs found · page {searchParams.page} of {totalPages} · sorted by suitability
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    suitability={computeSuitability(job, searchParams.skills)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => handlePageChange(searchParams.page - 1)}
                    disabled={searchParams.page <= 1}
                    className="px-4 py-2 rounded border-2 border-my-blue text-my-blue font-bold disabled:opacity-40 hover:bg-my-blue hover:text-white transition-colors">
                    ← Prev
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-gray-600">
                    {searchParams.page} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePageChange(searchParams.page + 1)}
                    disabled={searchParams.page >= totalPages}
                    className="px-4 py-2 rounded border-2 border-my-blue text-my-blue font-bold disabled:opacity-40 hover:bg-my-blue hover:text-white transition-colors">
                    Next →
                  </button>
                </div>
              )}
            </>
          )}

          {/* Empty state */}
          {!loading && !apiUnconfigured && !error && jobs.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg mb-2">No jobs found</p>
              <p className="text-sm">Try adjusting your skills or location, then hit Search.</p>
            </div>
          )}
        </div>
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const socials = await getSocials();
    return { props: { socials }, revalidate: 86400 };
  } catch {
    return { props: { socials: [] }, revalidate: 86400 };
  }
};
