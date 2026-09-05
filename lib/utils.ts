import type { ProjectProps } from './types';

export function readingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.ceil(words / 230);
}

function getBuildTime(value?: string): number {
  if (!value) return 0;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function sortProjectsByBuildDate(projects: ProjectProps[]): ProjectProps[] {
  return [...projects].sort((a, b) => getBuildTime(b.builtAt) - getBuildTime(a.builtAt));
}

export function getAllTechnologies(projects: ProjectProps[]): string[] {
  const techs = new Set<string>();
  projects.forEach((p) => p.technologies?.forEach((t) => techs.add(t)));
  return [...techs].sort();
}

export function filterProjectsByTech(
  projects: ProjectProps[],
  selectedTech: string | null
): ProjectProps[] {
  return selectedTech
    ? projects.filter((p) => p.technologies?.includes(selectedTech))
    : projects;
}

export function formatBuildDate(value?: string): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}
