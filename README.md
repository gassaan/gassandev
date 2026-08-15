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

The Dhiraagu and Ooredoo marks live in `public/logos/dhiraagu.png` and `public/logos/ooredoo.png`, supplied by the shop owner and processed to transparent RGBA so they composite correctly on both the sand and dark themes. To replace them with higher-resolution or vector originals, swap those two files (and update the paths in `src/components/ProviderLogo.tsx` if the extension changes). If a file is missing the component falls back to a text badge, so the UI never breaks.
