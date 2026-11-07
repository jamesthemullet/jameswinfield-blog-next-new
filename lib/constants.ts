/** ISR revalidation period, in seconds, for pages backed by frequently-changing content (home, blog). */
export const REVALIDATE_FREQUENT = 3600;

/** ISR revalidation period, in seconds, for pages backed by rarely-changing content (timeline, projects, posts). */
export const REVALIDATE_INFREQUENT = 86400;
