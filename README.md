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

`src/data/dataService.ts` defines the `DataService` contract (numbers + orders). Two implementations satisfy it, and `src/data/index.ts` picks one at startup based on whether Supabase credentials are present:

- **`supabaseDataService.ts`** — used when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set.
- **`localDataService.ts`** — the fallback, backed by `localStorage` and seeded from `numbers.seed.ts`. It keeps the shop runnable with no backend, which is also what makes local development and CI work without secrets.

Admin auth switches on the same signal, so the database and the login never disagree about which world they are in.

## Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query** → paste `supabase/schema.sql` → Run. Optionally run `supabase/seed.sql` too, to load the 30 example numbers so the shop isn't empty on day one.
3. **Authentication → Users → Add user** to create your admin login. Leave public sign-ups disabled — the app never exposes a sign-up form, and this is the only account that can edit stock.
4. **Project Settings → API** gives you the project URL and the browser-safe key. Supabase has renamed its keys: what this project calls the **anon** key (including the variable name) now appears in the dashboard as the **publishable** key, `sb_publishable_…` — that is the one to copy. The **secret** key, `sb_secret_…`, is the renamed `service_role`; it bypasses every policy and must never reach this project. The project URL may sit under **Settings → Data API** rather than on the API keys screen.
5. Locally: copy `.env.example` to `.env.local` and fill both values.
6. For the deployed site: **Settings → Secrets and variables → Actions** → add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then re-run the deploy workflow.

If the secrets are missing the build still succeeds and the site falls back to browser storage, so a forgotten secret degrades rather than breaks.

### About the anon (publishable) key

It is compiled into the client bundle, and that is how Supabase is meant to work — the key identifies the project, it does not authorise anything. **Row level security in `supabase/schema.sql` is the actual protection**, so the policies there matter:

- `numbers` — readable by anyone, writable only when signed in.
- `orders` — anyone may **insert** one (a customer checking out), but only a signed-in admin may **read** them. There is deliberately no public read policy, because orders carry customer names and phone numbers. `createOrder` is written not to read its row back for the same reason; asking would fail RLS on every checkout.

Never put the `service_role` key in this project — it bypasses RLS entirely.

## Admin panel

`/admin` is protected by `src/contexts/AdminAuthContext.tsx`. It uses Supabase Auth automatically once configured; until then it falls back to a local demo login (`admin@salhinumbers.mv` / `salhi-admin`) shown on the sign-in screen. Those demo credentials stop working on their own the moment real credentials exist — no code change needed.

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
