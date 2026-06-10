import { format } from 'date-fns';
import type { Job } from '../lib/types';

type JobCardProps = {
  job: Job;
  suitability: number;
};

function formatSalary(value: number): string {
  return value >= 1000 ? `£${Math.round(value / 1000)}k` : `£${value}`;
}

function suitabilityStyle(score: number): string {
  if (score >= 70) return 'bg-my-green text-white';
  if (score >= 40) return 'bg-my-yellow text-gray-900';
  return 'bg-gray-200 text-gray-700';
}

export default function JobCard({ job, suitability }: JobCardProps) {
  const excerpt = job.description.replace(/<[^>]+>/g, '').slice(0, 180);
  const hasSalary = job.salaryMin !== null || job.salaryMax !== null;
  const salaryText = hasSalary
    ? [job.salaryMin && formatSalary(job.salaryMin), job.salaryMax && formatSalary(job.salaryMax)]
        .filter(Boolean)
        .join(' – ')
    : null;

  let datePosted = '';
  try {
    datePosted = format(new Date(job.created), 'd MMM yyyy');
  } catch {
    // invalid date — leave blank
  }

  return (
    <article className="border-2 border-my-blue rounded-lg p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow bg-white">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-bold leading-snug text-gray-900">{job.title}</h2>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${suitabilityStyle(suitability)}`}
          title="Suitability based on skills match, salary (£100k+) and remote preference">
          {suitability}% match
        </span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
        <span className="font-semibold text-gray-800">{job.company}</span>
        {job.location && <span>{job.location}</span>}
        {salaryText && <span className="font-semibold text-my-green">{salaryText}</span>}
        {job.source && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{job.source}</span>
        )}
        {datePosted && <span className="text-gray-400">{datePosted}</span>}
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">
        {excerpt}
        {excerpt.length >= 180 ? '…' : ''}
      </p>

      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start mt-auto bg-my-blue text-white text-sm font-bold px-4 py-2 rounded hover:opacity-90 transition-opacity">
        View Job →
      </a>
    </article>
  );
}
