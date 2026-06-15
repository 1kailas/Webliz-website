# Webliz deployment

## Recommended: Netlify

1. Create a new Netlify site and deploy this repository or drag the project folder into Netlify Drop.
2. No build command is required. The publish directory is `.` and is already configured in `netlify.toml`.
3. After the first deploy, open **Forms** in Netlify and confirm that `project-enquiry` appears.
4. In **Project configuration > Notifications > Form submission notifications**, add `hello@webliz.in` so every enquiry is emailed to Webliz.
5. Add the production domain under **Domain management** and follow Netlify's DNS instructions.

The custom `404.html`, clean route redirects, security headers, asset caching, favicon, web manifest, and Netlify form detection are already configured.

## Before announcing the site

- Submit one test enquiry and confirm it arrives in Netlify Forms and at `hello@webliz.in`.
- Test the call and WhatsApp links on a phone.
- Add the final domain to Open Graph and canonical metadata when the domain is confirmed.
