import type { NextApiRequest, NextApiResponse } from 'next';
import type { Job } from '../../lib/types';

const JSEARCH_URL = 'https://jsearch.p.rapidapi.com/search';

const SKILL_TERMS: Record<string, string> = {
  react: 'React OR Next.js',
  typescript: 'TypeScript OR JavaScript',
  nodejs: 'Node.js',
  css: 'CSS OR Tailwind',
};

type ApiSuccessResponse = {
  jobs: Job[];
  total: number;
  page: number;
};

type ApiErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.JSEARCH_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'JSEARCH_UNCONFIGURED' });
  }

  const { skills, location = 'London', page = '1', remote } = req.query;
  const skillsArray = typeof skills === 'string' ? skills.split(',') : (skills as string[] | undefined) ?? ['react', 'typescript'];

  const terms = skillsArray.map((s) => SKILL_TERMS[s] ?? s).join(' ');
  const query = `${terms} developer jobs in ${typeof location === 'string' ? location : 'London'}`;
  const pageNum = typeof page === 'string' ? page : '1';

  const params = new URLSearchParams({
    query,
    page: pageNum,
    num_pages: '1',
  });

  if (remote === '1') {
    params.set('remote_jobs_only', 'true');
  }

  try {
    const response = await fetch(`${JSEARCH_URL}?${params.toString()}`, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      throw new Error(`JSearch ${response.status}`);
    }

    const data = await response.json();

    const jobs: Job[] = (data.data ?? []).map(
      (r: {
        job_id: string;
        job_title: string;
        employer_name: string;
        job_city?: string;
        job_country?: string;
        job_min_salary?: number;
        job_max_salary?: number;
        job_description?: string;
        job_apply_link: string;
        job_posted_at_datetime_utc?: string;
        job_publisher?: string;
      }) => ({
        id: r.job_id,
        title: r.job_title,
        company: r.employer_name,
        location: [r.job_city, r.job_country].filter(Boolean).join(', '),
        salaryMin: r.job_min_salary ?? null,
        salaryMax: r.job_max_salary ?? null,
        description: r.job_description ?? '',
        url: r.job_apply_link,
        created: r.job_posted_at_datetime_utc ?? new Date().toISOString(),
        source: r.job_publisher ?? '',
      })
    );

    return res.status(200).json({
      jobs,
      total: data.data?.length ?? 0,
      page: Number(pageNum),
    });
  } catch (_err) {
    return res.status(500).json({ error: 'Failed to fetch jobs. Please try again.' });
  }
}
