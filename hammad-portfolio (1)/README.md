# Hammad Asghar | WordPress Developer Portfolio

A modern, light-theme, multi-page portfolio website built with plain HTML, CSS and JavaScript. No build step: it deploys on Vercel as-is.

## Pages

| Page | File |
|---|---|
| Home (3D hero, featured slider, services, process, tools, FAQ) | `index.html` |
| About | `about.html` |
| Services | `services.html` |
| Portfolio (filterable, 13 projects) | `portfolio.html` |
| Case study pages (one per project) | `projects/*.html` |
| Contact (form sends to WhatsApp or email) | `contact.html` |
| Not found | `404.html` |

## Folder structure

```
assets/
  css/styles.css         All styling (colours are variables at the top)
  js/main.js             Menu, slider, typing effect, 3D tilt, filters, counters, contact form
  vendor/                Swiper slider (local copy)
  projects/*.webp        Homepage screenshots (1200 x 750)
  mobile/*.webp          Mobile screenshots (520 x 1126)
  full/*.webp            Full-page screenshots for case studies
  img/*.webp             Stock photos (Unsplash, free licence)
  icons/*.svg            Tool logos (Simple Icons)
  favicon.svg, og-image.jpg
```

## Deploy (GitHub + Vercel)

1. Create a new GitHub repository, for example `hammad-portfolio`.
2. Upload all files and folders (keep `index.html` at the top level of the repo).
3. On vercel.com choose **Add New → Project** and import the repository.
4. Framework Preset: **Other**. Leave Build Command and Output Directory empty. Click **Deploy**.
5. The live address is https://hammad-wordpress-developer.vercel.app/ (already set in every page).

## Editing tips

- **Contact details:** search for `hammadasgharofficial@gmail.com` and `923156451708`.
- **Text and projects:** edit the HTML files directly. Each project card links to its page in `projects/`.
- **Colours:** change `--primary`, `--primary-2` and `--pink` at the top of `assets/css/styles.css`.

Image credits: stock photos from Unsplash (free to use under the Unsplash licence). Tool logos from Simple Icons (CC0). Project screenshots are of the live client websites.
