# YouTube Thumbnail Grabber 🎥🖼️

A professional, modern, fast, and SEO-optimized YouTube thumbnail extractor web application designed to be 100% compliant with **Google AdSense** guidelines.

![Preview](assets/og-preview.jpg)

## 🌟 Key Features

- **Multi-Resolution Thumbnail Extraction:**
  - `maxresdefault.jpg` (Full HD 1080p / 720p - 1280×720) with automatic missing fallback detection.
  - `sddefault.jpg` (Standard Definition - 640×480).
  - `hqdefault.jpg` (High Quality - 480×360).
  - `mqdefault.jpg` (Medium Quality - 320×180).
  - `default.jpg` (Normal / Small - 120×90).
- **Direct Browser Download:** One-click instant image downloading (with Fetch Blob + Canvas fallback).
- **Comprehensive YouTube URL Support:**
  - Standard video links (`https://www.youtube.com/watch?v=...`)
  - Shortened URLs (`https://youtu.be/...`)
  - YouTube Shorts (`https://www.youtube.com/shorts/...`)
  - Mobile URLs (`https://m.youtube.com/...`)
  - Direct 11-character Video IDs.
- **Copy Image URL & Fullscreen Preview** for quick sharing.
- **Lightweight & Blazing Fast:** Built with pure semantic HTML5, modern CSS3, and vanilla JavaScript. 0 heavy dependencies, guaranteeing a 95–100 Google PageSpeed score.

---

## 🛡️ Google AdSense & SEO Optimization

- **Comprehensive Content:** Over 1,500 words of rich, original educational content on the homepage plus 3 complete guides in `blog/` to eliminate "Thin Content / Low Value Inventory" rejections.
- **Mandatory Legal Pages:**
  - `privacy-policy.html` (complies with Google DART cookie, GDPR, CCPA, COPPA).
  - `terms.html` (includes Fair Use and YouTube™ / Google LLC trademark disclaimer).
  - `about.html` (showcases E-E-A-T credentials, editorial standards, and team).
  - `contact.html` (interactive message form, support email, and SLA).
  - `faq.html` (Schema.org FAQPage structured data).
- **Cookie Consent Banner:** Compliant with Google EU User Consent Policy.
- **ads.txt:** Pre-configured and ready for your publisher ID.
- **Pre-installed Verification Tags:** Meta tag and script tag ready in `<head>`.
- **Structured Data:** JSON-LD for `WebApplication`, `FAQPage`, and `Article`.
- **Search Engine Ready:** `sitemap.xml` and `robots.txt` included.

---

## 📁 Project Structure

```
├── index.html                   # Main page with thumbnail extractor & guides
├── blog.html                    # Blog archive page
├── faq.html                     # FAQ page with interactive accordion
├── about.html                   # About Us & Editorial Standards
├── contact.html                 # Contact form & support channels
├── privacy-policy.html          # GDPR & Google AdSense compliant policy
├── terms.html                   # Terms of Use & Trademark Disclaimers
├── ads.txt                      # Google AdSense authorized digital sellers file
├── robots.txt                   # Search crawler directives
├── sitemap.xml                  # XML sitemap for Google Search Console
├── css/
│   └── style.css                # Responsive stylesheet (White, Red, Blue accents)
├── js/
│   └── thumbnail-extractor.js   # Extraction logic, downloads, and cookie banner
└── blog/
    ├── youtube-thumbnail-size-guide.html
    ├── how-to-download-youtube-thumbnails.html
    └── increase-youtube-ctr-with-thumbnails.html
```

---

## 🚀 Deployment (GitHub Pages)

1. Push this repository to GitHub.
2. Go to your repository **Settings** > **Pages**.
3. Under **Build and deployment** > **Branch**, select `main` and root `/`.
4. Click **Save**. Your site will be live at `https://<your-username>.github.io/<repository-name>/` in less than a minute!

---

## ⚖️ Legal Disclaimer

YouTube™ is a trademark of Google LLC. This project is an independent tool and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with YouTube, Google LLC, or Alphabet Inc.
