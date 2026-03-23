# Portfolio

Personal portfolio built with Astro, Tailwind CSS, and content collections.

## Stack

- **Astro 6** — static site generator, file-based routing
- **Tailwind CSS v4** — utility-first styling via `@tailwindcss/vite`
- **@tailwindcss/typography** — prose styling for Markdown content
- **Content Collections** — project case studies as typed Markdown files
- **Sharp** — image processing

## Project Structure

```
src/
├── content/
│   └── projects/          # Markdown case studies (add files here for new projects)
├── pages/
│   ├── index.astro        # Landing page
│   ├── about.astro        # About page
│   ├── resume.astro       # Resume page (links to /public/resume.pdf)
│   └── projects/
│       ├── index.astro    # Projects gallery
│       └── [...slug].astro # Dynamic project detail pages
├── components/
│   ├── ProjectCard.astro  # Gallery card
│   ├── TechBadge.astro    # Tag pill
│   ├── StatsGrid.astro    # Stats grid for project pages
│   └── ThemeToggle.astro  # Dark/light mode toggle
├── layouts/
│   └── BaseLayout.astro   # Shared HTML shell (nav, footer)
├── styles/
│   └── global.css         # Tailwind directives + custom theme
└── content.config.ts      # Content collection schema
public/
├── images/projects/       # Project thumbnails (referenced in frontmatter)
└── resume.pdf             # Served at /resume
```

## Commands

```bash
npm install          # Install dependencies (Node >= 22.12.0)
npm run dev          # Dev server at http://localhost:4321
npm run build        # Build to dist/
npm run preview      # Preview production build
npx astro check      # TypeScript type-check
```

## Adding a Project

Create a new `.md` file in `src/content/projects/`. The filename becomes the URL slug.

```markdown
---
title: "Project Name"
subtitle: "One-line description"
date: 2025-06-01
tags: ["Python", "FastAPI"]
thumbnail: "/images/projects/my-project.png"
github: "https://github.com/..."
live: "https://..."
featured: false
stats:
  - { label: "Lines of code", value: "~2,000" }
---

Full case study content here...
```

Place the thumbnail at `public/images/projects/my-project.png`.

## Dark Mode

Class-based via Tailwind's `dark:` prefix. The `ThemeToggle` component stores the preference in `localStorage` and falls back to `prefers-color-scheme` on first visit.
