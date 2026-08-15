# Salhi Numbers

A mobile-first shop for nice and regular Dhiraagu / Ooredoo mobile numbers in the Maldives. Customers browse, build a cart, and complete their order over WhatsApp — no payment gateway.

## Stack

React + TypeScript + Tailwind CSS v4 + Vite, with a storage-agnostic data layer so it can move from local storage to Supabase without touching any component.

## Local development

```
npm install
npm run dev
```

## Data layer

`src/data/dataService.ts` defines the `DataService` contract (numbers + orders). `src/data/localDataService.ts` implements it against `localStorage`, seeded from `src/data/numbers.seed.ts`. Swap `src/data/index.ts` to a Supabase-backed implementation once `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set (see `src/lib/supabaseClient.ts`).

## Admin panel

`/admin` is protected by `src/contexts/AdminAuthContext.tsx`. It uses Supabase Auth automatically once configured; until then it falls back to a local demo login (`admin@salhinumbers.mv` / `salhi-admin`) shown on the sign-in screen.

## Deployment

`.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages on push to `main` (requires the repo's Pages source set to "GitHub Actions" in Settings → Pages). Routing uses `HashRouter` so it works on static hosting without server-side rewrites.

## Provider logos

The Dhiraagu and Ooredoo marks live in `src/assets/logos/`, supplied by the shop owner and processed to transparent RGBA so they composite correctly on both the sand and dark themes. To replace them with higher-resolution or vector originals, swap those two files and push — CI rebuilds. Because they are imported rather than served from `public/`, Vite content-hashes them, so a replacement busts caches automatically.

## Asset paths and the subpath deploy

The site is served from a **project page subpath** (`…github.io/gassandev/`), not a domain root. That makes root-absolute asset URLs a trap: a literal `"/logos/x.png"` in a component resolves against the domain root and 404s in production while working perfectly on a local dev server at `/`. Vite rewrites such paths in `index.html`, but string literals inside components are invisible to it.

So: reference runtime assets by `import`ing them (Vite then emits a base-aware, hashed URL), and keep anything that must live in `public/` — `manifest.webmanifest` especially, which Vite copies verbatim without processing — on **relative** paths. To check a build the way production actually serves it:

```
npm run build
mkdir -p /tmp/serve/gassandev && cp -r dist/* /tmp/serve/gassandev/
cd /tmp/serve && python3 -m http.server 5180
# open http://127.0.0.1:5180/gassandev/
```

### Why the entry bundle filename is not hashed

GitHub Pages serves `index.html` with `max-age=600`, so a visitor can be holding a ten-minute-old shell at the moment a deploy replaces the site under them. With hashed entry filenames that stale shell requests a bundle the new deploy has already deleted, and the page renders blank until their cache expires — every deploy white-screens returning visitors. `vite.config.ts` therefore pins the entry chunk and CSS to stable names (`assets/index.js`, `assets/index.css`) so a stale shell always resolves. Assets referenced from *inside* the bundle stay content-hashed, because those names always arrive together with the bundle that points at them.

The Open Graph image is the one deliberate exception: `og:image` must be a fully-qualified absolute URL and a PNG, because WhatsApp and Facebook scrapers resolve neither relative URLs nor SVGs — and those are the primary sharing channels for this shop.
