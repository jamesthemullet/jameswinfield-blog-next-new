---
name: quality
description: Incrementally improve code quality for this project. Use when the user invokes /quality or asks to improve, clean up, or fix code quality issues. Rotates through four categories — strict typing, code duplication, bad patterns, dead code — making one focused fix per invocation.
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# /quality — Incremental Code Quality Improvement

## Stack

- TypeScript (`tsconfig.json` — strict mode **off**, but explicit types are still valuable)
- React with functional components and hooks
- Tailwind CSS v4 for styling — inline `style=` props are a smell
- Next.js pages router (`pages/`)
- Source files: `components/`, `pages/`, `lib/`, `utils/` (if present)
- No global state management — local `useState` and props only

## Step 1 — Pick a category

Use the current second of the clock (or any varied signal) to pick **one** of these four categories. Vary the selection — do not always pick the same one:

1. **Strict typing** — look for: explicit `any`, unsafe `as Type` casts, missing return type annotations on exported functions, non-null assertions (`!`) that could be replaced with proper guards, props typed as `object` or `{}`, missing prop interface definitions
2. **Code duplication** — look for: repeated logic blocks across components, identical conditional rendering patterns, values inlined 3+ times that should be a named constant, duplicated Tailwind class strings that could be extracted to a shared variable
3. **Bad patterns** — look for: `useEffect` with missing or overly broad dependency arrays, inline `style=` props (should use Tailwind classes), magic numbers/strings with no explanation, unnecessary re-renders from unstable object/function references created inline in JSX
4. **Dead code** — look for: exported symbols not imported anywhere in the project, commented-out code blocks left in files, unused imports, unused variables

## Step 2 — Find the best candidate

Read the relevant source files in `components/`, `pages/`, `lib/`. Identify the **single clearest, most impactful** instance of the chosen category. Prefer issues that:

- Are in frequently-used files (layout, nav, meta, commentForm)
- Have an unambiguous fix
- Won't require changes across many files

## Step 3 — Fix it

Make the fix. Keep scope tight — one issue, one or two files. Do not refactor beyond what is needed to address the specific finding.

## Step 4 — Report

Output exactly this structure:

```
## Quality improvement

**Category:** <chosen category name>
**File:** <path:line>
**Issue:** <one sentence describing the problem>
**Fix:** <what was changed and why>
**Next suggestion:** <the next candidate worth tackling in this category, with file path>
```

## Known project patterns

- **Styling:** Tailwind CSS v4 with custom colours (`my-blue`, `my-yellow`, `my-green`, `my-red`, `my-light`) — inline `style=` props are a pattern to flag; prefer Tailwind classes
- **State:** No global context — `useState` is the right tool; prop drilling is expected and only a smell if it goes 3+ levels with no reason
- **Types:** `lib/types.ts` holds shared type definitions — prefer using or extending these over redefining shapes inline
- **API:** `lib/api.ts` is the boundary for external data fetching — logic should live here, not scattered in page components
- **CSS Modules:** `post-body.module.css` exists alongside Tailwind — do not flag this as inconsistency, it is intentional for post body prose styling
- **`utils/` coverage gap:** `utils/` is intentionally excluded from Jest `collectCoverageFrom` — not a quality finding
- **Knip ignore list:** Several dependencies are intentionally listed in `knip.json` `ignoreDependencies` — do not flag these as unused
