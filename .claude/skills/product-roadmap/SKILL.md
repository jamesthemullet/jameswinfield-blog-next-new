---
name: product-roadmap
description: Build or refresh a product roadmap for James Winfield's personal blog/portfolio site — new features, pages, and content, PLUS making existing content easier to find, SEO, and improvements to features/pages that already exist — grounded in what the site already has. Writes a plain markdown ROADMAP.md at the repo root, grouped into Now/Next/Later, with each feature broken into a sequence of ~15-minute-reviewable PR steps. Use when the user asks for a roadmap, growth ideas, "what should we build next", or to update/rescope the existing roadmap.
---

# Product roadmap

Produces (or refreshes) **`ROADMAP.md`** at the repo root for `jameswinfield-blog-next-new`: a
Next.js (Pages Router, React 19, TypeScript, Tailwind) personal blog/portfolio site with `blog`,
`projects` (backed by `projects.json`), and `timeline` pages. Roadmap items are scored against
what actually grows readership and gives visitors a reason to explore more of the site/portfolio.
Covers more than new features:

- **Findability** — making posts and projects easier to discover: related posts, tags/
  categories, cross-linking between `blog`, `projects`, and `timeline`.
- **SEO** — structured data (Person/Article), indexability, RSS if not already present.
- **Improving what already exists** — `projects.json`-driven `projects.tsx` and `timeline.tsx`
  are real and live; extending them is often cheaper than a new feature.

## Grounding the roadmap in the real app

- `README.md` — states the site's purpose/history (a personal portfolio, previously headless
  WordPress — verify current data source before assuming a CMS is still involved, since
  `package.json` shows no GraphQL/CMS client currently, and content instead appears to be local
  (`projects.json`, `pages/posts/`)).
- `AUDIT.md` if present — don't duplicate known bugs/gaps as roadmap features.
- `package.json` — Next.js 16, React 19, `date-fns`, `isomorphic-dompurify`, Tailwind 4; no
  database/auth/CMS package — content is local/static.
- `pages/blog.tsx`, `pages/posts/`, `pages/projects.tsx`, `pages/timeline.tsx`, `projects.json`
  — real structure to extend.

## Output format

Plain markdown. Write directly to `ROADMAP.md` at the repo root, overwriting the previous
version. Structure: intro + 4 goal-tag lenses (Acquisition/Engagement/Retention/Fun) →
PR-sequence explainer → Now/Next/Later sections, each feature as `### N. Name — *Goal tags*` +
description + numbered PR-step list → Mise en place table (if any infra proposed) → footer
`*James Winfield — product roadmap, <date>*`.

## Breaking a feature into PR steps

Sequence data/logic → UI → wiring, splitting wherever a step could stand alone:

- A pure function (a tag/related-post matcher, a formatter) plus its unit tests is its own step.
- New UI is its own step.
- A step needing new written content (a new post, project write-up) gets a GitHub issue via
  `mcp__github__create_issue` rather than a PR, referenced from the roadmap line.
- No feature-flag system exists here — don't propose gating behind flags.
- If a feature is small enough that splitting produces nothing independently reviewable, write
  **"One PR."** instead.

## Notes

- Personal site, not a product with users to acquire at scale — keep proposals proportionate:
  discoverability, SEO, and content-linking wins over anything needing accounts or backend infra.
- Don't re-propose anything already tracked as an open item in `AUDIT.md`.
- Do not commit, push, or open a PR for `ROADMAP.md` changes unless the user explicitly asks.
