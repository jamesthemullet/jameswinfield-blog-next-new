import type { ProjectProps } from '../lib/types';
import {
  filterProjectsByTech,
  formatBuildDate,
  getAllTechnologies,
  sortProjectsByBuildDate,
} from '../lib/utils';

function project(overrides: Partial<ProjectProps>): ProjectProps {
  return {
    name: 'Project',
    why: '',
    learn: '',
    different: '',
    ...overrides,
  };
}

describe('sortProjectsByBuildDate', () => {
  it('orders projects from most to least recently built', () => {
    const older = project({ name: 'Older', builtAt: '2022-01-01' });
    const newer = project({ name: 'Newer', builtAt: '2024-01-01' });

    const sorted = sortProjectsByBuildDate([older, newer]);

    expect(sorted.map((p) => p.name)).toEqual(['Newer', 'Older']);
  });

  it('treats missing or invalid builtAt dates as oldest', () => {
    const dated = project({ name: 'Dated', builtAt: '2023-01-01' });
    const undated = project({ name: 'Undated' });
    const invalid = project({ name: 'Invalid', builtAt: 'not-a-date' });

    const sorted = sortProjectsByBuildDate([undated, dated, invalid]);

    expect(sorted[0].name).toBe('Dated');
    expect(
      sorted
        .slice(1)
        .map((p) => p.name)
        .sort(),
    ).toEqual(['Invalid', 'Undated']);
  });

  it('does not mutate the input array', () => {
    const projects = [
      project({ name: 'A', builtAt: '2022-01-01' }),
      project({ name: 'B', builtAt: '2024-01-01' }),
    ];
    const original = [...projects];

    sortProjectsByBuildDate(projects);

    expect(projects).toEqual(original);
  });
});

describe('getAllTechnologies', () => {
  it('collects a deduplicated, alphabetically sorted list of technologies', () => {
    const projects = [
      project({ technologies: ['React', 'TypeScript'] }),
      project({ technologies: ['TypeScript', 'Astro'] }),
    ];

    expect(getAllTechnologies(projects)).toEqual(['Astro', 'React', 'TypeScript']);
  });

  it('returns an empty list when no projects have technologies', () => {
    const projects = [project({}), project({ technologies: [] })];

    expect(getAllTechnologies(projects)).toEqual([]);
  });
});

describe('filterProjectsByTech', () => {
  const react = project({ name: 'React project', technologies: ['React'] });
  const svelte = project({ name: 'Svelte project', technologies: ['Svelte'] });
  const projects = [react, svelte];

  it('returns all projects when no technology is selected', () => {
    expect(filterProjectsByTech(projects, null)).toEqual(projects);
  });

  it('returns only projects matching the selected technology', () => {
    expect(filterProjectsByTech(projects, 'Svelte')).toEqual([svelte]);
  });

  it('returns an empty list when no project matches the selected technology', () => {
    expect(filterProjectsByTech(projects, 'Vue')).toEqual([]);
  });
});

describe('formatBuildDate', () => {
  it('formats a valid date as "Month Year"', () => {
    expect(formatBuildDate('2023-05-21')).toBe('May 2023');
  });

  it('returns null when no date is given', () => {
    expect(formatBuildDate(undefined)).toBeNull();
  });

  it('returns null for an invalid date string', () => {
    expect(formatBuildDate('not-a-date')).toBeNull();
  });
});
