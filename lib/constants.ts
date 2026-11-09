/** ISR revalidation period, in seconds, for pages backed by frequently-changing content (home, blog). */
export const REVALIDATE_FREQUENT = 3600;

/** ISR revalidation period, in seconds, for pages backed by rarely-changing content (timeline, projects, posts). */
export const REVALIDATE_INFREQUENT = 86400;

/** Average adult reading speed, in words per minute, used to estimate a post's reading time. */
export const WORDS_PER_MINUTE = 230;
