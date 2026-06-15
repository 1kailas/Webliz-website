# Webliz on Cloudflare Pages

## Pages build settings

- Framework preset: `None`
- Build command: leave empty
- Build output directory: `/`
- Production branch: your main branch

Cloudflare Pages automatically serves `about.html` at `/about`, `services.html` at `/services`, and `contact.html` at `/contact`. Do not add rewrite rules for those pages; doing so creates a redirect loop.

## Custom domains

Attach both `webliz.in` and `www.webliz.in` from **Workers & Pages > your project > Custom domains**. Set `webliz.in` as the primary domain and redirect `www.webliz.in/*` to `https://webliz.in/$1` with a Cloudflare Redirect Rule.

Do not point `www` at an old server IP. The current public `www` host returns Cloudflare error 522 and must be removed or reattached to the Pages project.

## Contact enquiries

The onboarding wizard sends a structured enquiry through WhatsApp to `+91 62827 66374`. This works on Cloudflare Pages without a server or third-party form provider. The page also exposes `hello@webliz.in` as an email contact.

## After deployment

1. Confirm `/`, `/about`, `/services`, `/contact`, `/robots.txt`, and `/sitemap.xml` return HTTP 200.
2. Add `https://webliz.in/sitemap.xml` to Google Search Console and Bing Webmaster Tools.
3. Test the phone, email, WhatsApp, and onboarding actions from a mobile device.
