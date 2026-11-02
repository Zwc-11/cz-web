import metadata from './projectMetadata.json'

/** A project as listed in projectMetadata.json; its write-up lives in caseStudies.ts. */
export type Work = {
  id: string; name: string; category: 'AI & agents' | 'Data & ML systems' | 'Applied AI'; year: string;
  tags: readonly string[]; links: { label: string; href: string }[];
  event?: string; award?: string;
}

export const works: Work[] = metadata.projects.map(work => ({ ...work, category: work.category as Work['category'] }))
