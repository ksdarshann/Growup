# Craftpath

An interactive learning studio and career-building platform with guided skill roadmaps, hands-on practice sandboxes, a resume builder, and structured interview preparation.

## Run locally

**Prerequisites:** Node.js 22 or later and npm.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:3000`).

## Production build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

This repository is configured for the project site:

`https://<your-github-username>.github.io/craftpath/`

1. Push the project to a public GitHub repository named **craftpath**.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push to the `main` branch. The workflow in `.github/workflows/deploy.yml` builds and deploys the site.
5. Check the **Actions** tab. When the deployment finishes, the Pages URL will be shown in the deployment job.

If you use a different repository name, update `base` in `vite.config.ts` to `'/<repository-name>/'` before deploying.

## Notes

- User progress is stored in the browser's local storage on that device/browser.
- Do not commit `.env.local`, API keys, passwords, or other secrets.
- GitHub Pages hosts static frontend files only; it does not run a Node/Express backend.
