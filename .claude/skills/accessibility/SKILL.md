---
name: accessibility
description: Incrementally improve accessibility for this project. Use when the user invokes /accessibility or asks to improve, audit, or fix accessibility issues. Rotates through five WCAG-aligned categories — semantic structure, keyboard navigation, ARIA correctness, colour/contrast, and screen-reader text — making one focused fix per invocation.
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# /accessibility — Incremental Accessibility Improvement

## Stack

- Next.js pages router (`pages/`)
- React functional components in `components/`
- Tailwind CSS v4 — custom colours (`my-blue`, `my-yellow`, `my-green`, `my-red`, `my-light`)
- `@axe-core/cli` and `accented` are installed as dev dependencies
- Source files: `components/`, `pages/`, `lib/`

## Step 1 — Pick a category

Use the current second of the clock (or any varied signal) to pick **one** of these five categories. Vary the selection — do not always pick the same one:

1. **Semantic structure** — look for: missing or incorrect heading hierarchy (skipped levels, `<div>` used instead of `<h1>`–`<h6>`), landmark regions missing or misused (`<main>`, `<nav>`, `<footer>`, `<header>`, `<section>`, `<aside>`), interactive elements implemented as `<div>` or `<span>` without `role` + keyboard support, lists marked up as plain `<div>` runs, `<button>` vs `<a>` used for the wrong purpose (buttons navigate; links activate)
2. **Keyboard navigation** — look for: interactive elements unreachable via Tab (`tabIndex=-1` without programmatic focus management), focus styles suppressed globally (`outline: none` / `outline: 0` without a visible replacement), custom interactive widgets (dropdowns, modals, accordions) missing Arrow-key / Escape-key handlers, focus not trapped in modal/dialog overlays, logical tab order broken by CSS `order` or absolute positioning
3. **ARIA correctness** — look for: `aria-label` or `aria-labelledby` missing on icon-only buttons/links, `aria-hidden="true"` on elements that should still be announced, `role` values that contradict the native element semantics, `aria-expanded` / `aria-controls` missing on toggle triggers, `aria-describedby` pointing to an element that does not exist or is conditionally rendered, `aria-live` regions missing for dynamic content updates
4. **Colour and contrast** — look for: text rendered in Tailwind colour classes where the combination with the background fails WCAG AA (4.5:1 for normal text, 3:1 for large text ≥18 pt / bold ≥14 pt), placeholder text that is lighter than body text and fails 3:1 against the input background, focus indicators that fail 3:1 against adjacent colours, interactive states (hover, active) that lose contrast, icon-only UI elements without sufficient contrast
5. **Screen-reader text** — look for: images with empty `alt=""` that actually convey meaning, decorative images missing `alt=""` or `aria-hidden="true"`, icon SVGs lacking `aria-hidden="true"` and `focusable="false"`, links whose accessible name is only "click here" / "read more" / "here", form inputs without a visible or visually-hidden `<label>`, tables missing `<caption>` or `scope` attributes on header cells

## Step 2 — Find the best candidate

Read the relevant source files in `components/`, `pages/`, `lib/`. Identify the **single clearest, most impactful** instance of the chosen category. Prefer issues that:

- Affect frequently-used components (layout, nav, header, post header, comment form)
- Have an unambiguous, self-contained fix
- Are WCAG 2.1 AA violations (not just best-practice suggestions)
- Won't require changes across many files

## Step 3 — Fix it

Make the fix. Keep scope tight — one issue, one or two files. Do not refactor beyond what is needed to address the specific accessibility finding.

If no fixable issue exists in the chosen category (the code is already correct), move to the next category and try there. If all five categories are clean, report that.

## Step 4 — Report

Output exactly this structure:

```
## Accessibility improvement

**Category:** <chosen category name>
**WCAG criterion:** <e.g. 1.1.1 Non-text Content (Level A)>
**File:** <path:line>
**Issue:** <one sentence describing the accessibility problem and who it affects>
**Fix:** <what was changed and why it resolves the issue>
**Next suggestion:** <the next candidate worth tackling in this or another category, with file path>
```

## Step 5 — Create a pull request

After making the fix and outputting the report, always create a pull request:

1. Stage and commit the changed file(s):
   ```
   git add <file>
   git commit -m "<short imperative summary of the fix>\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
   ```
2. Push the branch: `git push`
3. Create the PR with `gh pr create` (or update the existing one if the branch already has an open PR). Use this body template:

```
## Summary

- <one bullet: what was wrong and who it affected>
- <one bullet: what was changed>

**WCAG criterion:** <e.g. 1.4.3 Contrast (Minimum) — Level AA>

## Test plan

- [ ] <manual verification step>
- [ ] Run `npx axe http://localhost:3000` and confirm no new violations

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

If the branch already has an open PR (gh pr create exits with an error), just output the existing PR URL — the pushed commit is already included.

## Known project patterns

- **Skip link:** `layout.tsx` already has a `Skip to main content` link targeting `#main-content` — do not flag this as missing
- **Nav ARIA:** `nav.tsx` already has `aria-label="Main navigation"`, `aria-expanded`, `aria-controls`, and `aria-label` on the hamburger button — do not flag these
- **Comment form ARIA:** `commentForm.tsx` already uses `aria-invalid`, `aria-describedby`, `role="alert"`, `role="status"`, `aria-live` — do not flag these
- **SVG icons:** the hamburger SVG in `nav.tsx` already has `aria-hidden="true"` and `focusable="false"` — do not flag it
- **Cover images:** `cover-image.tsx` generates `alt` text from the post title — acceptable; flag only if `alt` is empty on a meaningful image
- **Avatar images:** `avatar.tsx` uses the author name as `alt` — acceptable; flag only if `alt` is an empty string when a name is available
- **Tailwind `sr-only`:** `className="sr-only"` is the correct way to visually hide text for screen readers in this project — prefer this over `aria-label` when wrapping text content
- **Focus styles:** `focus:outline-2 focus:outline-blue-500` is the project's standard focus style — flag input/button/link elements that are missing it
- **Custom colours:** `my-blue` = `#083d77` (dark navy), `my-yellow` = `#f3dfa2` (light cream), `my-green` = `#3bb273`, `my-red` = `#af1b3f`, `my-light` = `#efe6dd` — check contrast against white (`#fff`) and each other when used together
- **`post-body.module.css`:** prose styling for post body — check heading levels and link colour contrast inside posts
- **`accented` package:** decorates characters in development to help spot issues — not a testing tool to invoke, it is a runtime helper
- **`@axe-core/cli`:** can be run against a live dev server with `npx axe http://localhost:3000` — use only if you need automated validation; manual code review is preferred for a focused fix
