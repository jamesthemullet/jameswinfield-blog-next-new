---
name: tests
description: Incrementally improve test coverage for this project. Use when the user invokes /tests or asks to improve, add, or run tests. Chooses between unit tests (Jest) and e2e tests (Playwright) based on what will deliver the most coverage value.
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# /tests — Incremental Test Coverage

## Current state

- Unit test framework: Jest (configured in jest.config.js, ts-jest preset)
- Unit test files: !`find . -name "*.test.*" -o -name "*.spec.*" | grep -v node_modules | head -20 || echo "none"`
- Playwright installed: !`ls node_modules/.bin/playwright 2>/dev/null && echo "yes" || echo "no"`
- E2e test files: !`find . -path "*/e2e/*.ts" -o -path "*/playwright/*.ts" | grep -v node_modules | head -10 || echo "none"`

## Step 2 — Audit coverage gaps

Read the existing test files (listed above). Then scan the source:

- Components: `components/*.tsx`
- Pages: `pages/*.tsx`, `pages/api/*.ts`
- Lib: `lib/api.ts`, `lib/types.ts`

Identify untested areas. Categorise each gap as:

- **Unit candidate**: pure logic, data transformation, form validation, component state — fast to test, no browser needed
- **E2e candidate**: user flows that cross multiple components or pages — navigation, form submission, routing, API interactions visible in the UI

## Step 3 — Choose and implement one improvement

Apply this decision logic:

- **Prefer e2e** when the most significant untested gap is a user flow (navigation, form submit, page routing, filtering/sorting behaviour). E2e tests must assert *functional behaviour* — what the user can *do* and what *happens* as a result — not just that text or elements are present on the page.
- **Prefer unit** when the most significant gap is isolated logic: a utility function, form validation rules, a pure component with branching render logic.
- If test coverage is roughly equal across both types, prefer whichever covers the higher-risk feature (e.g. comment submission > static heading render).

Write **one focused test** (or a small coherent suite for a single feature). Place it:

- Unit: alongside the component or in a `__tests__/` folder, e.g. `__tests__/commentForm.test.tsx`
- E2e: in `e2e/`, e.g. `e2e/navigation.spec.ts`

### E2e test quality rules

E2e tests must verify **functional outcomes**, not just visual presence:

- Navigation: click a link, assert the URL changes and the new page content loads
- Form submission: fill fields, submit, assert success/error state or UI change
- Mobile menu: toggle the hamburger, assert the menu appears/disappears and links are reachable
- Comment form: fill and submit, assert the form resets or a confirmation appears
- Do NOT write: `expect(page.locator('h1')).toBeVisible()` as the primary assertion — that is a visual check coverable by a unit snapshot, not a functional e2e test

### Unit test quality rules

- Test behaviour, not implementation: assert outputs and side effects, not internal state
- For components with branching logic (e.g. active nav link highlight, error messages), test each branch
- Mock external dependencies (`lib/api.ts` calls) at the module boundary

## Step 4 — Run the tests

After writing the test:

- Unit: `yarn jest --testPathPatterns=<new-file> --no-coverage`
- E2e: `yarn playwright test <new-file>` (requires dev server running — if not available, note this and skip running)

If tests fail, fix them before reporting done.

## Step 5 — Report

State concisely:

- Which type you chose (unit/e2e) and why
- What feature/behaviour the new test covers
- Whether the tests passed
- What the highest-value next gap is (one sentence)

If no improvement is justifiable (all meaningful paths are already tested), say so clearly and explain why.
