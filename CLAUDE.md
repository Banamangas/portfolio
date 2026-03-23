# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project State

The Astro project is **fully scaffolded**. Run `npm install` then `npm run dev` to start developing.

## Commands

```bash
npm run dev       # Dev server at http://localhost:4321
npm run build     # Build to dist/
npm run preview   # Preview built site
npx astro check   # TypeScript type-check all .astro files
```

## Architecture

### Framework & Stack
- **Astro** — static site generator with file-based routing
- **Tailwind CSS** — utility-first styling with `@tailwindcss/typography` for prose content
- **Content Collections** — project case studies live as Markdown files with typed frontmatter (schema defined in `content.config.ts`)

### Routing Model
- `/` → `src/pages/index.astro` — landing page
- `/projects/` → `src/pages/projects/index.astro` — gallery, reads all content collection entries
- `/projects/[slug]` → `src/pages/projects/[...slug].astro` — dynamic route per Markdown file
- `/about` → `src/pages/about.astro`
- `/resume` → `src/pages/resume.astro`

### Content Model
Project pages are driven by Markdown files in `src/content/projects/`. The frontmatter schema (in `content.config.ts`) includes: `title`, `subtitle`, `date`, `tags`, `thumbnail`, `github`, `live`, `featured`, `stats` (key-value pairs).

### Layout Pattern
All pages use `src/layouts/BaseLayout.astro` which provides the HTML shell, global nav, footer, and dark mode support. Individual pages slot their content inside it.

### Key Directories
- `src/components/` — reusable Astro components (`ProjectCard`, `TechBadge`, `StatsGrid`, `ThemeToggle`)
- `src/styles/global.css` — Tailwind directives and custom styles
- `public/images/projects/` — screenshots and thumbnails (binary assets, not processed by Astro)
- `public/resume.pdf` — served as a static file

### Dark Mode
Tailwind dark mode is class-based (`dark:` prefix). The variant is defined in `src/styles/global.css`. The `ThemeToggle` component manages the `dark` class on `<html>` and persists preference in `localStorage`.

## Git Workflow

### Branch Naming
- `feat/` — new features
- `fix/` — bug fixes
- `refacto/` — refactoring
- `chore/` — tooling, dependencies, config
- `docs/` — documentation only

### Commit Messages
Use the matching prefix: `feat:`, `fix:`, `refacto:`, `chore:`, `docs:`

### Pull Requests
- Always use `gh pr create` — **never push directly to main**
- Verify CI passes before considering a task done

### General Rules
- Never commit directly to `main`

## Planning Documents
- `SETUP.md` — step-by-step scaffold and configuration guide
- `WEBSITE_ARCHITECTURE.md` — design decisions, color palette, page layouts, content model details
- `DEPLOY.md` — deployment options (GitHub Pages, Cloudflare Pages, self-hosted VPS via Caddy)
- `01_foe_buildings_database.md` — case study content for the first portfolio project
