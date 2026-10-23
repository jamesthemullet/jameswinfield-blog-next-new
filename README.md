# jameswinfield.co.uk

Personal blog built with Next.js and WordPress (via WPGraphQL), using Incremental Static Regeneration.

## Tech stack

- **Next.js** — React framework with ISR
- **WordPress + WPGraphQL** — headless CMS via GraphQL
- **Tailwind CSS** — styling
- **TypeScript** — throughout
- **Jest** — unit tests
- **Playwright** — end-to-end tests

## Getting started

### Prerequisites

- Node.js
- A WordPress site with the [WPGraphQL](https://www.wpgraphql.com/) plugin installed

### Environment variables

Copy `.env.local.example` to `.env.local` and fill in the values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `WORDPRESS_API_URL` | URL to your WPGraphQL endpoint (e.g. `https://example.com/graphql`) |
| `WORDPRESS_AUTH_REFRESH_TOKEN` | Optional — required for preview mode |
| `WORDPRESS_PREVIEW_SECRET` | Optional — required for preview mode |

### Running locally

```bash
yarn install
yarn dev
```

The site runs at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `yarn dev` | Start development server |
| `yarn build` | Production build |
| `yarn start` | Start production server |
| `yarn test` | Run unit tests |
| `yarn test:e2e` | Run Playwright end-to-end tests |
| `yarn lint` | Lint the codebase |
| `yarn lint:fix` | Lint the codebase and auto-fix issues |
| `yarn format` | Format with Prettier |
| `yarn knip` | Check for unused files, exports, and dependencies |

## Features

- **RSS feed** — available at [`/api/rss`](http://localhost:3000/api/rss), generated from the latest WordPress posts
- **Comments** — readers can comment on posts; content is sanitized with DOMPurify before rendering
- **Projects page** — `/projects` lists portfolio projects from `projects.json`, with client-side filtering by technology
- **Reading progress bar** — shows scroll progress through a blog post (`components/reading-progress.tsx`)
- **Hiring call-to-action** — `components/hire-cta.tsx` and `components/post-hiring-cta.tsx` prompt visitors to get in touch, with Google Analytics event tracking

## Preview mode

To preview unpublished WordPress posts, visit:

```
http://localhost:3000/api/preview?secret=<WORDPRESS_PREVIEW_SECRET>&id=<post-id>
```

Alternatively, pass `slug` instead of `id` to look the post up by its slug:

```
http://localhost:3000/api/preview?secret=<WORDPRESS_PREVIEW_SECRET>&slug=<post-slug>
```
