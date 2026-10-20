# Webliz

Multi-page website for Webliz, built with semantic HTML, CSS, plain JavaScript, and Vite.

## Commands

- `npm install` — install the development toolchain
- `npm run dev` — start the local server with clean routes
- `npm run build` — create the Cloudflare Pages site in `dist/`
- `npm run preview` — serve the built site locally
- `npm run format` — format HTML, CSS, JavaScript, and project documentation

Routes are `/`, `/about`, `/services`, `/contact`, and `/thanks`. The contact route accepts a `package` query parameter to preselect a service and price tier.

Deployment details are in [DEPLOYMENT.md](DEPLOYMENT.md).
