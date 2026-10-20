# Webliz website

## Requirements

- Node.js 22.12 or newer
- npm 10 or newer

## Local development

```sh
npm install
npm run dev
```

Vite serves the multi-page site at clean URLs: `/`, `/about`, `/services`, `/contact`, and `/thanks`. Trailing slashes are accepted. The contact route also preserves query strings such as `/contact?package=business`.

## Build and preview

```sh
npm run build
npm run preview
```

The production site is written to `dist/`. The build keeps the HTML pages as separate documents, bundles their CSS and JavaScript, and copies the Cloudflare Pages headers, robots rules, and sitemap into the output.

## Cloudflare Pages

Set the project up with:

- Framework preset: `None`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `22.12` or newer

Cloudflare Pages serves `about.html`, `services.html`, `contact.html`, and `thanks.html` at the clean routes `/about`, `/services`, `/contact`, and `/thanks`. It handles these routes natively. The build also creates a real `home.html` alias for `/home`. Keep `_redirects` out of the project unless a redirect is specifically required; do not add rewrites from clean routes back to `.html` files.

Attach both `webliz.in` and `www.webliz.in` under **Workers & Pages > your project > Custom domains**. Set `webliz.in` as primary and redirect `www.webliz.in/*` to `https://webliz.in/$1` with a Cloudflare Redirect Rule.

## Contact enquiries

The onboarding wizard prepares an enquiry and opens WhatsApp to `+91 62827 66374`; the client must send the prepared message in WhatsApp. It does not post to a server or send email. The page also exposes `hello@webliz.in` as an email contact. The `/contact` document is served with a no-store cache policy so stale form markup is not reused.

## After deployment

Confirm `/`, `/about`, `/services`, `/contact`, `/robots.txt`, and `/sitemap.xml` return successfully. Submit a contact enquiry from desktop and mobile, and check the phone, email, and WhatsApp actions.
