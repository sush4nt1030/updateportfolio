# budhasushant.com.np · Portfolio v7

Personal portfolio for **Sushant Budha Chhetri**, cybersecurity student (BSc IT in Cyber Security, APU / APIIT).
Plain HTML, CSS and JavaScript. No framework, no build step, no tracking.

## Files

```
index.html                 The whole page
assets/css/style.css       Styles (dark theme)
assets/js/main.js          CERTIFICATES list (top of file), terminal, 3D sphere, filters, clock, menu
assets/certs/              Put your certificate images here (create the folder)
assets/img/                Put your photo here (sushant.jpg)
cv/                        Your resume PDF (the Resume buttons download it)
favicon.svg, og-image.jpg  Tab icon and social share preview
404.html                   "Page not found"
_headers                   Security headers for Cloudflare Pages / Netlify
.htaccess                  Same headers + HTTPS redirect for Apache / cPanel hosting
.well-known/security.txt   Security contact (RFC 9116). Renew the Expires date every year.
robots.txt, sitemap.xml    For Google
```

## Add a certificate (with image + verify link)

1. Save the certificate image (JPG/PNG/WebP, landscape works best) in `assets/certs/`, e.g. `assets/certs/google-play-it-safe.jpg`.
2. Open `assets/js/main.js`. At the top there is `const CERTIFICATES = [ ... ]`. Add one line per certificate:

```js
{ title: 'Play It Safe: Manage Security Risks', issuer: 'Google · Coursera', date: 'Aug 2025',
  category: 'security', image: 'assets/certs/google-play-it-safe.jpg',
  verify: 'https://coursera.org/verify/XXXXXXXX', id: 'XXXXXXXX' },
```

- `category` is one of `security`, `tech`, `design`, `leadership`, `events`, `general` (filter buttons appear automatically).
- `verify` is the public verification link (Coursera, Credly, Cisco, TryHackMe, issuer page…). The **Verify** button opens it in a new tab.
- The whole certificate is shown (never cropped) in a certificate-shaped frame. Landscape images fill it; portrait ones sit centred.
- Clicking the image enlarges it. **Verify** opens the verification link in a new tab.
- The first 4 show; the rest appear with "Show all".
- Have a PDF certificate? Export page 1 as JPG/PNG first (e.g. open it and screenshot, or use an online "PDF to JPG" tool).
- Best image size: about 1600px wide, under 400 KB (compress at squoosh.app).
- The counter ("05 Certificates · 01 Event") updates by itself.

## Put it online (free: GitHub + Cloudflare Pages)

1. Create a GitHub repository and upload everything in this folder (keep `.well-known` and `_headers`).
2. In Cloudflare → Workers & Pages → Create → Pages → connect the repository. Build command: none. Output folder: `/`.
3. Add the custom domain `budhasushant.com.np` in the Pages project (Custom domains).
4. `_headers` applies the security headers automatically. Check them at https://securityheaders.com.

GitHub Pages alone also works, but it ignores `_headers`, so the security headers only apply on Cloudflare Pages / Netlify.
On cPanel (Apache) hosting, `.htaccess` does the same job.

## Add your photo

Save a square photo as `assets/img/sushant.jpg`, then in `index.html` replace

```html
<div class="avatar"><span>S<b>B</b></span></div>
```

with

```html
<div class="avatar"><img src="assets/img/sushant.jpg" alt="Sushant Budha Chhetri"></div>
```

## Other edits

- **Resume:** replace `cv/Sushant-Budha-Chhetri-CV.pdf` (keep the file name).
- **New role:** copy a `<details class="tile rv">` block in EXPERIENCE; set `data-start` / `data-end` ("present" works). Durations are automatic.
- **New project:** copy an `<article class="tile w-card rv" data-cat="security|web|design">` block in WORK.
- **Terminal answers:** edit the `C = { ... }` commands in `assets/js/main.js` (e.g. `whoami`, `projects`, `nisc`).
- **Social icons** come from Font Awesome (cdnjs). The Content-Security-Policy already allows `https://cdnjs.cloudflare.com`.
  For extra hardening, add `integrity="sha384-…"` attributes from the cdnjs page to the two Font Awesome `<script>` tags.
