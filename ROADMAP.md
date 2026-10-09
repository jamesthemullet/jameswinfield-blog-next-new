# Product Roadmap — James Winfield

The site has real content — blog posts, a projects page backed by `projects.json`, and a career
timeline — but they don't reference each other, so a visitor reading one post has no path to the
rest. Everything below is scored against four jobs:

- **Acquisition** — brings new visitors in
- **Engagement** — deepens a single visit
- **Retention** — earns a repeat visit
- **Fun** — no metric, just delight

Every feature is broken into a **PR sequence** — each step small enough for a human to review in
about 15 minutes. Genuinely atomic changes are left as one PR.

## Now (ship in weeks — reuses existing infra)

### 1. Related posts — *Engagement, Retention*
"You might also like" links at the bottom of a blog post, so a visit doesn't dead-end after one
article.

1. Pure function matching posts by shared tags/topic (reads whatever metadata the posts already
   carry) + tests.
2. Component rendering the related-posts list on the post page.

### 2. Post → project cross-links — *Engagement*
Where a blog post discusses a project also listed in `projects.json`, link between them —
improving existing pages rather than building new ones.

1. A matching function keying posts to `projects.json` entries by name/slug — pure function +
   tests.
2. A "related project" callout on the post page, and a "posts about this" link on `projects.tsx`.

### 3. Article structured data — *Acquisition, SEO*
Article/Person structured data on blog posts and the homepage so search engines understand
authorship and content type.

1. **One PR.** A single JSON-LD block added to the post template and homepage from fields that
   already exist.

## Next (this quarter — moderate new build)

### 4. Tags/topics — *Acquisition, Engagement*
A simple tag taxonomy across posts, with a tag listing page — the foundation the related-posts
matcher (feature 1) can use instead of ad-hoc heuristics.

1. Add a `tags` field to post frontmatter/metadata — schema-only change, no UI.
2. A tag listing page and per-tag filtered view.
3. Tag chips shown on each post, linking to the tag page.

---
*James Winfield — product roadmap, 2 September 2026*
