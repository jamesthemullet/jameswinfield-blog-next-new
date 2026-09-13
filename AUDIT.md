# Site Audit

Living checklist maintained by the `/full-audit` skill. Findings are appended, never rewritten;
check an item off (`- [x]`) once you've fixed it and it won't be touched again. Re-running the
audit adds new findings to the bottom of each section and leaves checked items alone.

## Run log

- 2026-09-01 — initial audit. 32 findings (6 test coverage/e2e, 2 security, 6 SEO/metadata, 3 content alignment, 15 code quality). Categories 2 (Accessibility), 3 (Performance), and 5 (Responsive/UX) were **blocked**: no `.env.local` / `WORDPRESS_API_URL` configured locally, so the app can't render real content for a browser-driven pass. Re-run once a WordPress endpoint is available locally.
- 2026-09-01 — scheduled maintenance run resolved item 1.1 (unit tests for `lib/api.ts`'s `createComment` and `getPreviewPost`).
- 2026-09-03 — scheduled maintenance run resolved item 1.3 (unit tests for the `postsToShow` date-filtering logic in `pages/blog.tsx`, extracted to `lib/utils.ts`'s `filterRecentPosts`).
- 2026-09-02 — scheduled maintenance run resolved the `components/comments.tsx` DOMPurify sanitization unit test item.
- 2026-09-04 — scheduled maintenance run resolved item 1.3 (unit tests for `pages/api/preview.ts` and `pages/api/exit-preview.ts`).
- 2026-09-05 — scheduled maintenance run resolved item 1.5 (unit tests for `pages/projects.tsx`'s tech-filter logic).

## 1. Test coverage — unit gaps and e2e

- [x] Add unit tests for `lib/api.ts` (mock `fetch`/GraphQL client) covering `createComment` success/error paths and `getPreviewPost`'s ID vs SLUG branching — currently 0% coverage on the site's core data-fetching layer (found: 2026-09-01) (resolved: 2026-09-01, PR #295)
- [x] Add a unit test for the `postsToShow`/"Show Older Blog Posts" date-filtering logic in `pages/blog.tsx` (lines ~42-50) — pure logic, no network dependency (found: 2026-09-01) (resolved: 2026-09-03, PR #300)
- [x] Add a unit test for `components/comments.tsx` verifying DOMPurify sanitization actually strips unsafe HTML from rendered comment content (found: 2026-09-01) (resolved: 2026-09-02, PR #296)
- [x] Add unit tests for `pages/api/preview.ts` and `pages/api/exit-preview.ts` (mock `getPreviewPost`, assert 401 paths and the `setPreviewData`/307 redirect path) — currently untested auth-style branching logic (found: 2026-09-01) (resolved: 2026-09-04, PR #302)
- [x] Add a unit test for the tech-filter logic in `pages/projects.tsx` (`selectedTech` state, `filteredProjects`, `formatBuildDate`) — static-data logic independent of WordPress, currently 0% coverage (found: 2026-09-01) (resolved: 2026-09-05, PR #303)
- [ ] Add e2e coverage (`e2e/navigation.spec.ts` or a new spec) for: (a) clicking from the post list into an individual post and asserting the post page renders a heading and body, (b) mobile nav Escape-key close behavior (`components/nav.tsx` `onKeyDown` handler, currently untested), (c) a smoke assertion that at least one project card renders on `/projects` — split into separate specs/PRs per flow (found: 2026-09-01)

## 2. Accessibility

- [ ] **Blocked**: no `WORDPRESS_API_URL` configured in `.env.local` locally, so the app can't render real post/page content for an automated axe/Lighthouse pass or manual keyboard walkthrough. Re-run this category once a WordPress endpoint is available. (found: 2026-09-01)

## 3. Performance

- [ ] **Blocked**: same missing `WORDPRESS_API_URL` issue as category 2 — Lighthouse/Core Web Vitals and bundle-weight checks need a real running site with content. Re-run once available. (found: 2026-09-01)

## 4. SEO / metadata

- [ ] Add a `<link rel="canonical">` tag in `components/meta.tsx` — the `seoProps` type already declares `seo.canonical` but it's never rendered; pages currently rely on `og:url` alone (found: 2026-09-01)
- [ ] Fix the RSS `<link>` tag in `components/meta.tsx:82` — it points to `/feed.xml`, which doesn't exist; the real feed is at `/api/rss` (already correctly linked separately in `pages/_document.tsx:7`), so this tag should be corrected or removed as a duplicate (found: 2026-09-01)
- [ ] Add `sitemap.xml` and `robots.txt` — neither exists anywhere in the repo (no static file, no `pages/sitemap.xml.ts`, no `next-sitemap` config), so search engines have no crawl directives or sitemap discovery path (found: 2026-09-01)
- [ ] Add an `<h1>` to `pages/blog.tsx` — the page currently jumps straight to an `<h3>` (`hero-post.tsx`) then `<h2>` ("More Stories"), with zero h1s, unlike every other route (found: 2026-09-01)
- [ ] Add page-specific `<h1>` content for `/projects` and `/timeline` — both currently reuse `components/intro.tsx`'s hardcoded "James Winfield." h1 from the homepage instead of a route-relevant heading (found: 2026-09-01)
- [ ] Add JSON-LD structured data (`Article`/`BlogPosting`) to `pages/posts/[slug].tsx` — published date and author are currently visual-only with no `application/ld+json` block, so rich results aren't available to search engines (found: 2026-09-01)

## 5. Responsive / UX

- [ ] **Blocked**: same missing `WORDPRESS_API_URL` issue as category 2 — screenshot/console-error pass needs a real running site with content. Re-run once available. (found: 2026-09-01)

## 6. Security

- [ ] Use a timing-safe comparison (`crypto.timingSafeEqual`) instead of `!==` for the preview secret check in `pages/api/preview.ts:11` — currently a plain string comparison, theoretically vulnerable to a timing side-channel; low practical risk but a one-line fix given it's the only gate on draft content (found: 2026-09-01)
- [ ] Restrict draft enumeration via the preview route: `pages/api/preview.ts` never checks `post.status` against an authorized scope, and WordPress `DATABASE_ID`s are small sequential integers, so anyone holding the single shared preview secret can iterate `?secret=...&id=1,2,3...` to view every draft on the site rather than just one intended post. Consider a signed per-post token instead of a single shared secret (found: 2026-09-01)

## 7. Content and feature alignment

- [ ] Document the missing `lint:fix` and `knip` scripts in `README.md`'s Scripts table — both exist in `package.json` but aren't mentioned (found: 2026-09-01)
- [ ] Document the `slug=` alternative for preview mode in `README.md` — it currently only documents `?secret=...&id=<post-id>`, but `pages/api/preview.ts` also accepts `slug` as an alternative to `id` (found: 2026-09-01)
- [ ] Add a "Features" section to `README.md` covering shipped-but-undocumented features: RSS feed (`/api/rss`), comments, the projects page (`projects.json`-backed with tech filtering), the reading-progress bar, and the hiring/CTA components — all working, just absent from the README (found: 2026-09-01)

## 8. Code quality

- [ ] Replace `} as any)` in `lib/api.ts:23` with a correctly-typed `RequestInit` shape instead of casting away the type mismatch on the `fetch` config (found: 2026-09-01)
- [ ] Add explicit return types and parameter types to the exported functions in `lib/api.ts` (`getPreviewPost`, `getPage`, `getAllPostsForHome`, `getPostAndMorePosts`, `createComment`) — all currently rely on implicit `any` parameters, on the module every page's `getStaticProps` depends on (found: 2026-09-01)
- [ ] Type the `comment` parameter in `components/commentForm.tsx:6`'s `setCommentData` prop instead of leaving it implicit `any` (found: 2026-09-01)
- [ ] Type the `newData` parameter in `pages/posts/[slug].tsx:91`'s `handleCommentDataChange` instead of leaving it implicit `any` (found: 2026-09-01)
- [ ] Deduplicate `CoverImageProps` and `featuredImageProps` in `lib/types.ts:14-34` — two separately-declared types with identical shapes that can silently drift out of sync (found: 2026-09-01)
- [ ] Reconcile the locally-redeclared `seoProps` type in `components/meta.tsx:4-26` with the exported `seoProps` in `lib/types.ts:128-147` — they have different shapes, so a change to one won't be caught as a mismatch against `Layout`'s `seo` prop (found: 2026-09-01)
- [ ] Widen `children?: ReactElement[]` to `React.ReactNode` in `components/layout.tsx:8` — the narrower type doesn't match what pages actually pass (conditionals, fragments, strings, `null`) (found: 2026-09-01)
- [ ] Replace the ad hoc `Window & { gtag?: Function }` casts in `components/hire-cta.tsx:20,22` and `components/post-hiring-cta.tsx:17,19` with a single shared, properly-typed `gtag` declaration (a correct signature already exists in `pages/_app.tsx:23`) (found: 2026-09-01)
- [ ] Extract the duplicated `gtag` tracking logic in `components/hire-cta.tsx:17-27` and `components/post-hiring-cta.tsx:14-24` into a shared `lib/analytics.ts` helper — identical except for the event name string (found: 2026-09-01)
- [ ] Extract a shared constant for the repeated ISR `revalidate` magic numbers (`3600` in `pages/index.tsx`, `pages/blog.tsx`; `86400` in `pages/timeline.tsx`, `pages/projects.tsx`, `pages/posts/[slug].tsx`; plus `lib/api.ts:5`'s own default) so changing the site's revalidation policy doesn't require hunting down every call site (found: 2026-09-01)
- [ ] Extract the production domain (duplicated as a literal in `components/meta.tsx:31` and `pages/api/rss.ts:17`) and the `mailto:hello@jameswinfield.co.uk` address (duplicated in `components/hire-cta.tsx:15` and `components/post-hiring-cta.tsx:12`) into shared constants (found: 2026-09-01)
- [ ] Extract a `pillClass(isActive: boolean)` helper for the duplicated filter-pill Tailwind class-string ternaries in `pages/projects.tsx:63-70` and `:73-81`, mirroring the existing `linkClass` pattern in `components/nav.tsx:14-16` (found: 2026-09-01)
- [ ] Fix the empty `if (process.env.NODE_ENV === 'development') { }` blocks in `lib/api.ts:35-38` and `lib/api.ts:406-409` — GraphQL error details are currently discarded entirely instead of being logged, making API failures hard to debug even in development (found: 2026-09-01)
- [ ] Name the hardcoded reading-speed constant in `lib/utils.ts:4` (`Math.ceil(words / 230)`) as `WORDS_PER_MINUTE = 230` instead of an inline magic number (found: 2026-09-01)
- [ ] Replace `key={index}` with a stable identifier (e.g. `category.node.name` / `tag.node.name`) in `components/categories.tsx:21` and `components/tags.tsx:10` to avoid incorrect list reconciliation if order changes (found: 2026-09-01)
- [ ] Remove the unnecessary `useMemo` + `eslint-disable-next-line react-hooks/exhaustive-deps` in `pages/projects.tsx:35` — it sorts a static top-level import (`data`) that never changes, so a plain module-level `const` would remove both the hook and the lint suppression (found: 2026-09-01)
