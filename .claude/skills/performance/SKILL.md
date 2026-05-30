---
name: performance
description: Review the app for web performance improvements and create GitHub issues. Minor findings go into one consolidated issue; each significant finding gets its own issue. No findings is also a valid outcome. Use when the user invokes /performance or asks to review performance.
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, Bash
---

# /performance — Web Performance Review

You are a Senior Web Performance Engineer auditing this Next.js blog for runtime and load-time performance improvements.

## Stack context

- **Framework:** Next.js (pages router) with ISR — `pages/` directory
- **Styling:** Tailwind CSS v4 — no CSS-in-JS overhead
- **Data:** WordPress headless CMS via GraphQL (`lib/api.ts`) — ISR with `revalidate`
- **Images:** `next/image` should be used for all images; `cover-image.tsx` and `avatar.tsx` are the main image components
- **Analytics:** Google Analytics wired in `_app.tsx`
- **Source files to audit:** `components/`, `pages/`, `lib/`

## Step 1 — Audit across five lenses

Read the source files in `pages/`, `components/`, and `lib/`. Check each lens below and collect findings. For each finding note: file + line, severity (Minor / Significant), and a one-sentence fix.

### Lens 1 — Image optimisation
- `next/image` used with explicit `width`/`height` or `fill` + `sizes` prop?
- `priority` prop set on the largest above-the-fold image (hero, cover image on post page)?
- Any raw `<img>` tags that should be `next/image`?
- `quality` prop defaulting to 75 (fine) — flag only if hardcoded to something high (>85) without reason

### Lens 2 — Data fetching & ISR
- `getStaticProps` functions fetching more data than needed for the page (over-fetching fields from GraphQL)?
- `revalidate` values: are post lists revalidating too aggressively (< 60 s) or not at all?
- Any `getServerSideProps` on pages that could be static — unnecessary per-request rendering?
- Client-side `fetch` inside `useEffect` without SWR/React Query — no caching, re-fetches on every mount?

### Lens 3 — Bundle & import cost
- Barrel imports (`import { a, b, c } from 'some-lib'`) where a direct deep import would tree-shake better?
- Heavy libraries imported at the top level that could be dynamic-imported (`next/dynamic`) — e.g. syntax highlighters, markdown renderers, charting libs?
- Any `import * as X` patterns where only one or two named exports are used?

### Lens 4 — Render performance
- Components that re-render on every parent render because they receive new object/array/function references inline in JSX — good candidates for `useMemo`/`useCallback`?
- Large lists rendered without windowing (react-window / react-virtual) — only flag if the list is likely to exceed ~50 items in production
- `useEffect` with an empty dependency array doing synchronous heavy work on mount?

### Lens 5 — Core Web Vitals signals
- `<head>` in `_document.tsx` — any render-blocking third-party scripts not using `next/script` with `strategy="lazyOnload"` or `strategy="afterInteractive"`?
- Google Analytics script loaded via plain `<script>` instead of `next/script`?
- Large or unoptimised fonts loaded synchronously — should use `next/font`?
- Missing `preconnect` / `dns-prefetch` hints for known third-party origins (WordPress API, GA)?

## Step 2 — Classify findings

Sort your findings into two buckets:

- **Significant** — likely to produce a measurable improvement to a Core Web Vital, meaningful reduction in bundle size (>10 kB), or elimination of unnecessary server-side rendering. Each gets its own GitHub issue.
- **Minor** — good practice but unlikely to move a metric noticeably on a site of this size. All minor findings go into **one** consolidated issue.

If you find nothing worth improving, state that clearly and stop — do not create any issues.

## Step 3 — Report findings

Output this structure before creating any issues:

```
## Performance Review

### Significant findings
<numbered list — file:line, what the problem is, what the fix is>

### Minor findings
<numbered list — file:line, what the problem is, what the fix is>

### No action needed
<list any lenses where everything looks fine>
```

If there are no significant findings and no minor findings worth grouping, write:

```
## Performance Review

No performance improvements worth filing were found. The app follows Next.js best practices across the audited lenses.
```

Then stop.

## Step 4 — Create GitHub issues

### For each Significant finding — one issue per finding

```bash
gh issue create \
  --title "perf: <short title>" \
  --label "performance" \
  --body "## Finding

**File:** <file:line>
**Severity:** Significant
**Lens:** <which lens caught this>

## Problem

<one paragraph — what is happening and why it hurts performance>

## Recommended fix

<concrete steps or code sketch>

**Expected impact:** <what metric or measure should improve and roughly by how much>"
```

### For all Minor findings — one consolidated issue

```bash
gh issue create \
  --title "perf: minor improvements (consolidated)" \
  --label "performance" \
  --body "## Minor performance findings

These are low-priority improvements that follow best practices but are unlikely to move Core Web Vitals meaningfully on a site of this scale. Tackle opportunistically.

<for each minor finding:>
### <short title>

**File:** <file:line>
**Lens:** <lens>
**Problem:** <one sentence>
**Fix:** <one sentence>"
```

Report each issue URL as it is created.

## Known project patterns

- `cover-image.tsx` wraps `next/image` — check `priority` usage on the post page hero image
- `_app.tsx` contains the GA script — check whether it uses `next/script`
- `lib/api.ts` is the GraphQL boundary — all field selection lives here; over-fetching shows up as unused fields in page components
- `projects.json` is static local data — no fetching concern
- ISR revalidate values: blog posts at 3600 s, projects at 86400 s are the current baseline
- No heavy charting or visualisation libraries are known to be in use — if one is found, flag it
