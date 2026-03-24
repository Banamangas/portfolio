# Portfolio — Deployment Guide

## Overview

This is a fully static Astro 6 site. The build output is plain HTML, CSS, and JS in `dist/` — no server-side runtime required. It can be hosted anywhere that serves static files.

| Option | Cost | HTTPS | Auto-Deploy | Best For |
|--------|------|-------|-------------|----------|
| **GitHub Pages** | Free | Auto | GitHub Actions | Simple, no extra accounts |
| **Cloudflare Pages** | Free | Auto | Git integration | Best global CDN, preview URLs per PR |
| **Netlify** | Free tier | Auto | Git integration | Easy setup, good DX |
| **Self-hosted VPS** | Already paid | Caddy/Let's Encrypt | Optional | Everything on one server |

---

## Requirements

### Build environment

| Requirement | Version |
|-------------|---------|
| Node.js | >= 22.12.0 |
| npm | >= 10.0 |

### Build command

```bash
npm ci
npm run build
# Output: ./dist/
```

---

## Option 1 — GitHub Pages

### Prerequisites

- Repository on GitHub
- `main` branch is the production branch

### Step 1 — Configure Astro

Edit `astro.config.mjs` to set `site`. This is required for the sitemap and correct asset URLs.

```js
export default defineConfig({
  site: 'https://YOUR_USERNAME.github.io',
  // If your repo is NOT named YOUR_USERNAME.github.io, also add:
  // base: '/portfolio',
  vite: { plugins: [tailwindcss()] },
  integrations: [sitemap()],
});
```

> **Tip:** Name the repo `YOUR_USERNAME.github.io` to avoid needing a `base` path.

### Step 2 — Add the GitHub Actions workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci
      - run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### Step 3 — Enable GitHub Pages

1. Go to **Settings** > **Pages** in your repository
2. Under **Source**, select **GitHub Actions**
3. Push a commit to `main` — the workflow triggers automatically

### Step 4 — Verify

```bash
gh run list --limit 1
# If it failed:
gh run view <run-id> --log
```

Live at: `https://YOUR_USERNAME.github.io/` or `https://YOUR_USERNAME.github.io/portfolio/`

---

## Option 2 — Cloudflare Pages

### Prerequisites

- Free Cloudflare account
- Repository on GitHub or GitLab

### Steps

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com) > **Workers & Pages** > **Create** > **Pages**
2. Connect to Git and select the `portfolio` repository
3. Configure the build:

   | Setting | Value |
   |---------|-------|
   | Framework preset | Astro |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Environment variable | `NODE_VERSION` = `22` |

4. Click **Save and Deploy**

Cloudflare redeploys on every push to `main` and creates preview URLs for every PR.

Update `astro.config.mjs`:
```js
site: 'https://portfolio.pages.dev', // or your custom domain
```

---

## Option 3 — Netlify

### Prerequisites

- Free Netlify account
- Repository on GitHub

### Via dashboard

1. [app.netlify.com](https://app.netlify.com) > **Add new site** > **Import an existing project**
2. Connect GitHub and select the repository
3. Configure:

   | Setting | Value |
   |---------|-------|
   | Build command | `npm run build` |
   | Publish directory | `dist` |
   | Node version | Set `NODE_VERSION=22` in environment variables |

4. Click **Deploy site**

### Via CLI

```bash
npm install -g netlify-cli
netlify login
netlify init        # link to your Netlify account
netlify deploy --prod
```

---

## Option 4 — Self-Hosted VPS (Caddy)

### Prerequisites

- VPS with Caddy installed and running
- Node.js >= 22 on the server (for building)
- A domain or subdomain pointing to the VPS IP

### Step 1 — Build on the server

```bash
git clone git@github.com:Banamangas/portfolio.git ~/portfolio
cd ~/portfolio
npm ci
npm run build
# Static files are now in ~/portfolio/dist/
```

### Step 2 — Configure Caddy

Add to `/etc/caddy/Caddyfile`:

```caddyfile
yourdomain.dev {
    root * /home/youruser/portfolio/dist
    file_server

    encode gzip zstd

    # Cache immutable assets (hashed filenames) for 1 year
    @assets path /_astro/*
    header @assets Cache-Control "public, max-age=31536000, immutable"

    # Cache images for 1 week
    @images path /images/*
    header @images Cache-Control "public, max-age=604800"

    # Clean URL fallback (Astro generates .html files)
    try_files {path} {path}.html {path}/index.html

    handle_errors {
        rewrite * /404.html
        file_server
    }
}
```

Reload Caddy:

```bash
sudo systemctl reload caddy
```

Caddy provisions and renews HTTPS certificates automatically via Let's Encrypt.

### Step 3 — Deploy script (optional)

Create `~/deploy.sh`:

```bash
#!/bin/bash
set -euo pipefail

cd ~/portfolio
git pull origin main
npm ci --prefer-offline
npm run build

echo "Deployed at $(date)"
```

```bash
chmod +x ~/deploy.sh
bash ~/deploy.sh
```

To trigger automatically on push, set up a GitHub Actions workflow that SSHs into the VPS:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: bash ~/deploy.sh
```

Add `VPS_HOST`, `VPS_USER`, and `VPS_SSH_KEY` as secrets in your GitHub repository settings.

---

## Custom Domain

### GitHub Pages

1. Add a `CNAME` file to `public/`:
   ```
   yourdomain.dev
   ```
2. Add DNS records at your domain registrar:
   ```
   A     @    185.199.108.153
   A     @    185.199.109.153
   A     @    185.199.110.153
   A     @    185.199.111.153
   CNAME www  YOUR_USERNAME.github.io
   ```
3. In **Settings** > **Pages**, set your custom domain and check **Enforce HTTPS**
4. Update `site` in `astro.config.mjs`:
   ```js
   site: 'https://yourdomain.dev',
   ```

### Cloudflare Pages

1. In the Pages project > **Custom domains** > add your domain
2. If the domain is already on Cloudflare, DNS is configured automatically
3. Otherwise, add the provided CNAME to your registrar

### Netlify

1. **Site settings** > **Domain management** > **Add custom domain**
2. Follow the DNS instructions — Netlify provisions HTTPS automatically

---

## Post-Deploy Checklist

- [ ] Site loads at the correct URL
- [ ] HTTPS is active (padlock in browser)
- [ ] All project cards appear on `/projects`
- [ ] Individual project pages render correctly
- [ ] Images and thumbnails load (check browser console for 404s)
- [ ] Resume PDF downloads from `/resume`
- [ ] Links to GitHub repos and live demos work
- [ ] Mobile layout is correct (test at 375px width)
- [ ] Sitemap accessible at `/sitemap-index.xml`
- [ ] `<meta>` tags are set correctly (check with [metatags.io](https://metatags.io))

---

## Updating the Site

### After any change

```bash
# Make your changes, then:
git add <files>
git commit -m "..."
git push origin main
# Auto-deploys in ~1-2 minutes (GitHub Actions / Cloudflare / Netlify)
# Or run ~/deploy.sh manually on VPS
```

### Adding a new project

1. Create `src/content/projects/<slug>.md` with the required frontmatter
2. Add a thumbnail to `public/images/projects/<slug>.png`
3. Commit and push

### Checking deploy status

```bash
# GitHub Actions
gh run list --limit 5

# Cloudflare / Netlify — check the project dashboard
```
