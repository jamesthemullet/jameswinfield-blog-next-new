---
name: security
description: Run a full security audit of this codebase and file GitHub issues for any findings. Use when the user invokes /security, asks to "run a security audit", "check for security issues", "audit the codebase for vulnerabilities", or wants security findings tracked as GitHub issues. High/critical severity findings get individual issues; low/medium findings are grouped into one issue.
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, Bash, Agent
---

# /security — Full Codebase Security Audit

Perform a thorough security audit of this Next.js / TypeScript project and file GitHub issues for any real findings.

## Stack context

- Next.js (pages router), TypeScript, React, Tailwind CSS
- Entry points: `pages/` (SSR/SSG), `pages/api/` (API routes)
- Data fetching: `lib/api.ts`
- No auth system — public blog
- No database — external CMS/API calls only

## Phase 1 — Reconnaissance

Before scanning, build a picture of the attack surface:

1. List all files under `pages/api/` — these are server-side entry points
2. Find all `fetch()`/`axios`/HTTP calls and where their inputs come from
3. Find all places user input enters the system: query params, request bodies, URL segments
4. Note any `dangerouslySetInnerHTML`, `eval`, `innerHTML`, dynamic `require`/`import`
5. Check `package.json` for dependency versions worth auditing

Use `Glob` and `Grep` for this — you're mapping, not reading every file.

## Phase 2 — Vulnerability scan

Work through these categories. Only flag findings where you are >80% confident of real exploitability:

- **Injection** — SQL, NoSQL, OS command, template. Trace every user-controlled value to every sink.
- **XSS** — `dangerouslySetInnerHTML`, `bypassSecurityTrustHtml`, `eval()` on user data, `innerHTML =`. React template rendering is safe by default — only flag explicit unsafe APIs.
- **Auth / authorisation** — missing guards on API routes, hardcoded credentials, JWT weaknesses.
- **Sensitive data exposure** — PII or secrets written to logs, stack traces leaked to clients, debug mode on in production config.
- **Path traversal** — user-controlled path segments passed to `fs` functions without normalisation.
- **SSRF** — user controls host or protocol in outbound fetch calls.
- **Insecure deserialisation** — `eval`/`Function()` on untrusted data, unsafe `JSON.parse` of unvalidated input passed to sensitive sinks.
- **Security misconfiguration** — permissive CORS on API routes, CSP gaps, debug endpoints reachable in production.
- **Dependency CVEs** — run `npm audit --json` and flag only Critical/High severity advisories.

## Phase 3 — False positive filter

For each candidate, ask:
1. Is there a concrete, exploitable attack path? Can you write a one-sentence exploit scenario?
2. Is this in application code (not just a theoretical framework risk)?
3. Would a senior security engineer raise this in a PR review?

Automatically exclude: DOS/rate-limiting, secrets secured in env vars, regex DOS, log spoofing, open redirects, tabnabbing, prototype pollution, missing audit logs, vulnerabilities in test-only files, SSRF where only the path is controlled.

## Phase 4 — Classify severity

| Severity | Criteria |
|---|---|
| **Critical / High** | Directly exploitable: RCE, auth bypass, data breach, session hijack |
| **Medium** | Exploitable under specific conditions, significant impact |
| **Low** | Defence-in-depth gap, low standalone impact |

## Phase 5 — File GitHub issues

Run `gh label list` first. Apply the `security` label if it exists.

### One issue per Critical / High finding

```
Title: [Security][High] <brief description> in <file>

## Summary
<One-paragraph description of the vulnerability>

## Location
`<file>:<line-range>`

## Exploit scenario
<One or two sentences: how an attacker exploits this in practice>

## Recommended fix
<Concrete, code-level remediation>

## References
- CWE-XXX: <name>
```

### One grouped issue for all Medium / Low findings

```
Title: [Security] Minor security improvements

## Summary
Lower-severity findings from a codebase security audit. None are directly exploitable on their own.

---

### 1. <title> — `<file>:<line>`
**Severity:** Medium / Low
**Description:** <what the issue is>
**Fix:** <specific remediation>

---
### 2. ...
```

### No findings

Do not create any issues. Tell the user clearly and briefly summarise what was checked.

## Phase 6 — Report to user

After filing issues (or confirming nothing found):

1. Short summary table: Critical/High issues filed (with URLs), Medium/Low grouped issue (with URL if created)
2. One sentence on what was checked
3. Any notable positives (e.g. "all API routes validated with zod", "no dynamic SQL found")
