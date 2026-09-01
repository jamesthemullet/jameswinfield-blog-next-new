---
name: full-audit
description: Run a full audit of jameswinfield.co.uk (Next.js blog/portfolio, headless WordPress via WPGraphQL) covering test coverage (unit + e2e gaps), accessibility, performance, SEO, responsive/UX, security, code quality (typing, duplication, bad patterns, dead code), and content/feature alignment against the README. Appends new findings to a persistent AUDIT.md checklist in the repo (existing checked-off items are preserved). Use when the user asks to audit, review the health of, or find improvements for the whole site — not for reviewing a single PR/diff (use /code-review for that).
---

# Full site audit

Produces a holistic health report for **jameswinfield.co.uk**: a single Next.js (pages router)
app that renders content from a headless WordPress instance via WPGraphQL, using Incremental
Static Regeneration. There is no separate backend package — `pages/api/preview.ts` is the only
server-side route, and WordPress itself is the CMS/data layer. This is NOT a PR/diff review —
lint (`biome check`), unit tests, e2e tests, and knip already run as CI gates on every PR (see
`.github/workflows/pull_request_audit.yml`), so **do not re-check whether the app lints, passes
its existing test suite, or builds — CI already does**. This audit looks at things no single PR's
gates catch: coverage gaps CI doesn't enforce a percentage on, cross-cutting site quality (a11y,
perf, SEO, security, UX), and code quality that a passing lint/build doesn't guarantee (loose
typing, duplication, dead code — see category 8).

Note that this repo already has narrower, rotating single-focus skills (`/accessibility`,
`/performance`, `/quality`, `/tests`, `/security`, `/product`) that each fix one thing per
invocation and open a PR. This skill is different: it's a **read-only, wide-angle survey** across
all of those dimensions at once, recorded as a checklist rather than immediately fixed.

## When to run this

User asks to "audit the site", "find ways to improve the website", "do a full review of the
app", or similar whole-app requests. If they ask about a single PR or the current diff, use
`/code-review` instead. If they want one specific fix made and shipped right now, prefer the
narrower `/accessibility`, `/performance`, `/quality`, `/tests`, or `/security` skill instead.

## Output

Findings live in a single persistent file at the repo root: **`AUDIT.md`**. This is not a
one-off report — it's a living checklist that accumulates across runs. Each run **appends**,
never replaces:

- `AUDIT.md` has one `## <n>. <Category>` section per category below, in the same order, each
  containing a flat markdown checklist (`- [ ] finding text (found: YYYY-MM-DD)`).
- **Before writing anything**, read the current `AUDIT.md` in full (create it from the template
  below if it doesn't exist yet).
- For each category, compare this run's findings against what's already listed in that section:
  - If a finding already exists (same issue, same file/route — wording may differ slightly),
    **do not duplicate it**. Leave the existing line untouched.
  - If an existing unchecked item no longer reproduces (verify, don't assume — re-check it),
    check it off and add `(resolved: YYYY-MM-DD, verified during audit)` rather than deleting
    the line, so there's a record.
  - **Never touch a line that's already checked off (`- [x]`)** — those are the user's own
    record of completed work. Leave them exactly as-is, in place.
  - Genuinely new findings get appended to the bottom of that section's list as new `- [ ]`
    items, dated.
- Add a line to the `## Run log` section at the top with today's date and a one-line summary
  (e.g. "2026-08-31 — 4 new findings (2 a11y, 1 security, 1 code quality), 1 item resolved").
- Do not renumber, reorder, or rewrite prose outside the checklists — this file is meant to be
  readable as a diff over time.

Do not modify application code during the audit unless the user explicitly asks you to fix
something after seeing the report — this skill is read-only/diagnostic aside from editing
`AUDIT.md` itself.

### AUDIT.md template (use this structure if the file doesn't exist yet)

```markdown
# Site Audit

Living checklist maintained by the `/full-audit` skill. Findings are appended, never rewritten;
check an item off (`- [x]`) once you've fixed it and it won't be touched again. Re-running the
audit adds new findings to the bottom of each section and leaves checked items alone.

## Run log

- YYYY-MM-DD — initial audit

## 1. Test coverage — unit gaps and e2e

## 2. Accessibility

## 3. Performance

## 4. SEO / metadata

## 5. Responsive / UX

## 6. Security

## 7. Content and feature alignment

## 8. Code quality
```

## How to run it

Fan out the categories below as parallel forks or a general-purpose subagent per category (they
are independent and read-heavy — keep the raw output out of your main context). Have each one
**report findings back as text**, not write to `AUDIT.md` directly — only you should touch that
file, in a single merge pass at the end, so the dedup/checked-item rules above are applied
consistently in one place. Categories needing the browser (a11y/perf/responsive/e2e-walkthrough)
should run together in one browser-driving pass since they all need the app running.

Before starting, check whether a dev server is already running; if not, start the app yourself
(`yarn dev`, port 3000) for the duration of the audit and stop it when done, unless the user is
already running it. This app needs `WORDPRESS_API_URL` set (see `.env.local` /
`.env.local.example`) to render real content — if it's missing, note that as a blocker for the
browser-driven categories rather than silently auditing an empty/error state.

### 1. Test coverage — unit gaps and e2e

- Run `yarn test` (Jest) and check coverage output — note any file in `components/`, `pages/`,
  `lib/` sitting notably low or at 0%, aside from `utils/` which is intentionally excluded from
  `collectCoverageFrom` (not a finding).
- Run `yarn test:e2e` (Playwright, specs live in `e2e/`, currently `e2e/navigation.spec.ts`).
  List which user flows already have e2e coverage and which don't, e.g.:
  - Home page → post list → individual post navigation
  - Post pagination / "load more" if present
  - Comment form submission (`components/comments.tsx` + `components/commentForm.tsx`)
  - Preview mode (`pages/api/preview.ts`) — draft post rendering with a valid secret
  - Mobile nav (hamburger open/close, link reachability)
  - Projects/portfolio page rendering from `projects.json`
  For each flow lacking coverage, recommend whether it's a unit or e2e candidate (per the
  `/tests` skill's decision logic) rather than just flagging "untested."
- Run `yarn knip` and treat any genuinely unused export/dependency it surfaces as a finding,
  excluding anything already listed in `knip.json`'s `ignoreDependencies`.

### 2. Accessibility

- Automated pass per route (axe via `npx axe http://localhost:3000` or `@axe-core/cli`, already
  a devDependency; or Lighthouse a11y score through `claude-in-chrome`)
- Manual: colour contrast against the custom Tailwind palette (`my-blue`, `my-yellow`,
  `my-green`, `my-red`, `my-light`), focus order/visible focus states, labels on the comment
  form, keyboard-only navigation through the mobile menu and a full post read-through
- Cross-check against the known-good patterns already listed in the `/accessibility` skill (skip
  link, nav ARIA, comment form ARIA, SVG icon `aria-hidden`) — don't re-report those as findings

### 3. Performance

- Lighthouse performance score and Core Web Vitals (LCP, CLS, INP) for the home page and a post
  page
- Next.js build output (`yarn build`): bundle size per route, any large client bundles, unused
  JS/CSS, image weight — check `next/image` usage and `priority` on above-the-fold images per
  the `/performance` skill's lenses (image optimisation, ISR/data fetching, bundle/import cost,
  render performance, Core Web Vitals signals)
- WPGraphQL response time for `lib/api.ts` calls under a simple manual check

### 4. SEO / metadata

- `pages/_document.tsx` / per-page `<Head>` usage: title, meta description, Open Graph tags,
  presence of sitemap/robots.txt, canonical URLs
- Semantic heading structure per route, and whether post metadata (published date, author) is
  exposed via structured data (JSON-LD) or left implicit

### 5. Responsive / UX

- Screenshot the home page, a post page, and the projects page at ~375px and ~1280px via
  `claude-in-chrome` — look for anything that's drifted or was never verified holistically
  across components added in different PRs
- Console errors on load/navigation (`read_console_messages`), broken links (including outbound
  links in post content from WordPress), dead-end states

### 6. Security

- No auth system and no database in this app (public blog, external CMS/API only) — do not flag
  missing session handling or password hashing, they don't apply here
- Review `pages/api/preview.ts`: is the preview secret compared safely, can an attacker enumerate
  or guess post IDs to preview unpublished content, is the refresh token (`WORDPRESS_AUTH_REFRESH_TOKEN`)
  ever exposed client-side
- Check for `dangerouslySetInnerHTML` usage rendering WordPress post content — confirm
  `isomorphic-dompurify` (already a dependency) is actually sanitising it before render, not just
  installed
- Dependency vulnerabilities: `npm audit` / `yarn audit` for Critical/High findings
- Response headers (CSP, HSTS, X-Content-Type-Options) if set via `next.config.js` or the hosting
  platform

### 7. Content and feature alignment

There is no `ROADMAP.md` in this repo. Instead, diff the README's stated feature set (tech
stack, scripts table, preview-mode instructions) against what's actually live in `main`:

- Do the documented `yarn` scripts in the README match `package.json`'s actual `scripts` block?
- Does preview mode work as documented (`/api/preview?secret=...&id=...`)?
- Are there features visible in the live site or code (e.g. comments, projects page) that the
  README doesn't mention, or documented features that no longer exist?
- Cross-check any standing feature ideas logged by the `/product` skill (open GitHub issues
  labelled `product`) against what's shipped, and flag ones that look stale or already done

### 8. Code quality

A passing lint/build only proves the code is formatted and compiles, not that it's precisely
typed, non-duplicated, or free of dead weight — that's what this category covers. TypeScript
strict mode is **off** in this project (see `tsconfig.json`), so explicit-but-loose typing is
expected in places; flag only genuine gaps, not the absence of strict-mode-only guarantees.

- **Typing** — explicit `any`, unsafe `as Type` casts, missing return type annotations on
  exported functions in `lib/api.ts` or `lib/types.ts`, non-null assertions (`!`) that could be
  replaced with a proper guard, props typed as `object` or `{}` instead of an interface.
- **Code duplication** — repeated logic across `components/` or `lib/api.ts`'s GraphQL query
  functions, duplicated Tailwind class strings that should be extracted, values inlined 3+ times
  that should be a named constant.
- **Bad patterns** — `useEffect` with missing or overly broad dependency arrays, magic
  numbers/strings, large inline functions in JSX that obscure intent, inline `style=` props
  (should be Tailwind classes per project convention).
- **Dead code** — exported symbols not imported anywhere (cross-check against `yarn knip`
  output and `knip.json`'s `ignoreDependencies` list before flagging), commented-out code blocks
  left in files.

## Notes

- This is a personal/small project — keep findings proportionate. Don't recommend enterprise-
  scale tooling (e.g. a full CI a11y pipeline — one already exists via the `axe` job, don't
  suggest expanding it into something heavier) as a "blocker"; note it as a "nice to have"
  instead unless it's actually broken for a real user.
- Cite every finding with a route, file:line, or screenshot — no vague "could be improved"
  entries.
- **Every checklist item must be independently reviewable as one small PR** — same spirit as
  this repo's single-focus skills (`/accessibility`, `/quality`, etc.), which each ship one
  focused fix per PR. If a finding is actually a bundle of unrelated or large changes (e.g. "add
  more e2e coverage", "improve accessibility across the app", "harden the preview route"), split
  it into several separate `- [ ]` lines, each scoped to a single reviewable change (e.g. one
  line per flow's e2e spec, one line per route's a11y fix, one line per security issue). Never
  write a checklist item a reviewer couldn't approve or reject on its own without also weighing
  in on unrelated changes bundled into it.
