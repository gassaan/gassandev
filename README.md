# Salhi Numbers

A mobile-first shop for graded Dhiraagu / Ooredoo mobile numbers in the Maldives. Customers browse, build a cart, and complete their order over WhatsApp — no payment gateway.

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

## One palette, dark

There is no light mode and no theme switch. The whole design is built for a dark ground — the metal cards below are the shop's centrepiece and they only work as light objects on a dark page — so the palette lives in a single `:root` block in `src/index.css` and there is no `dark:` variant anywhere in the app.

The dark background is also declared inline in `index.html`, because the stylesheet only arrives with the bundle; without it the first paint is a white page that then flips.

## The landing page

Minimal on purpose. A shop that sells individual objects should lead with its best one rather than describe the category, so the hero is the brand mark, one serif line, and **the showpiece** — the dearest number that can actually be bought today, set large in its own grade's metal.

The showpiece is not pinned to Platinum. It is the highest-priced number whose status is `available`, so a shop with nothing graded Platinum yet still leads with its best piece instead of an empty space, and a number that sells stops being advertised on the front page the moment its status changes.

Below it the three grades are doorways into the catalogue, kept to a hairline row rather than three filled cards — the cards belong to the numbers, and repeating them here would make the grades compete with the merchandise they exist to sort.

Headlines are set in Cormorant Garamond. It is the one addition to the font stack, and it does most of the work that reads as "premium"; the rest is whitespace and letter-spaced small caps rather than ornament.

## Number grades

Stock is graded, ascending: **Silver → Gold → Platinum**. Platinum is the most elite. The grade is always set by hand in the admin Numbers tab — like the provider, it is never inferred, because only you know which of your numbers are worth what.

The three are defined once in `src/utils/tiers.ts`, and the filter chips, admin selects, cart lines and WhatsApp message all read from there, so a grade cannot appear in one place and be missing from another.

The metal is on the **number**, not the card. An earlier pass made each card the metal it was named after — a bright silver card, a bright gold one — which was legible but far too loud: several of them in a scrolling grid pulled the eye away from the numbers, which are the thing being sold.

Every card is dark now, and four quieter signals separate the grades — no single one can carry it, because on an all-dark scheme the card surfaces sit only 1.15–1.35:1 apart in luminance, which is a shade rather than a distinction:

| | Silver | Gold | Platinum |
|---|---|---|---|
| hue | cool slate | warm brown | neutral black |
| rim | dim | dim warm | **bright** (4.07:1 above Silver's) |
| badge | dark plate | dark plate | **light plate** |
| number | silver, peaks below white | gold | platinum, peaks at white |

Platinum is the darkest of the three and wears the bright rim and the light badge, so the top grade still reads as different *in kind* rather than merely more. Silver had to be lifted slightly off it for the same reason: two near-black cards separated only by the tint of their digits left the badge doing all the work.

Each card carries its own `--ink`, `--muted`, `--lagoon` and `--sand`. Tailwind's `text-ink` and friends resolve through those variables, so everything inside a card adapts without any component knowing which grade it is rendering.

Every ramp was measured against the **lightest** stop of the card it sits on — the worst case for light type on a dark ground, and the mirror of the check this stylesheet needed back when the cards were pale. Everything clears 4.5:1 there. A metallic number is only as legible as its dimmest point once the ground is dark, and only as legible as its brightest point when the ground is light; getting that backwards is a mistake this file has made more than once.

### Migrating an existing project

`supabase/grades.sql` brings a database created before the current grades up to date, whichever of the older shapes it is in. It **renames** the two original values rather than rebuilding the type, so nothing is rewritten and no row loses its meaning:

- `regular` → **Silver** (the entry grade)
- `nice` → **Gold**

Anything previously marked "nice" therefore lands on Gold, and you promote individual numbers to Platinum yourself. That is deliberate — guessing which of your live stock deserves the top grade would mislabel real inventory.

There was briefly a fourth grade, Premium, between Gold and Platinum. Any row still on it moves **down** to Gold, not up to Platinum: Platinum is meant to be the rare one, and promoting a batch into it would blunt exactly the signal it exists to send. The unused `premium` label stays in the Postgres type — there is no `ALTER TYPE … DROP VALUE`, and rebuilding the type would mean recreating the column on live stock for a purely cosmetic gain.

Historical orders are left alone. `orders.items` holds a JSONB snapshot of what was sold at the time, so older rows still read `nice`, `regular` or `premium`; an order is a record of a past sale and rewriting it would falsify it. The app maps those legacy values when displaying them, so old orders and carts still render correctly.

## The brand mark

`src/assets/brand/` holds the Salhi Numbers mark as a single SVG, pre-coloured to the palette's cream. One file, not two, because the site is dark throughout — there is no light background for an ink version to sit on.

It is vector so it stays sharp wherever it is drawn. The mark started as a 320px-wide PNG, which the hero rendered at roughly 149 CSS pixels — already a 1.4x upscale on a 3x phone, and visibly soft. The SVG was traced from that PNG's alpha channel, upsampled first so the anti-aliasing's sub-pixel edge positions survived into the curves. Measured against the original at its native size, the silhouette matches to an IoU of 0.973, and every disagreeing pixel disappears under a single erosion — the differences are a sub-pixel rim along edges, not a missing stroke or a filled-in counter.

It is also smaller over the wire: ~15 kB gzipped against ~34 kB for the PNG, which barely compressed. The original raster remains in git history if it is ever needed. If the designer supplies a true vector original, replacing that one file is the whole job.

## Provider logos

The Dhiraagu and Ooredoo marks live in `src/assets/logos/`, supplied by the shop owner and processed to transparent RGBA so they composite correctly on the dark page and on the light metal cards alike. To replace them with higher-resolution or vector originals, swap those two files and push — CI rebuilds. Because they are imported rather than served from `public/`, Vite content-hashes them, so a replacement busts caches automatically.

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

## Sales and traffic

The admin dashboard reports both over Today / This month / All time.

**Sales** are computed from the `orders` table. Revenue counts only orders marked **completed**, not every order placed — an order is an intent submitted at checkout, and fulfilment happens later on WhatsApp, so counting them all would inflate takings with abandoned and cancelled ones. Money not yet confirmed appears separately as "awaiting confirmation", so revenue is never mysteriously zero. Marking orders off in the Orders tab is what feeds the revenue figure.

**Traffic** is first-party: page views are recorded into your own Supabase by `usePageViewTracking`, so no third-party analytics service is involved and no data leaves your project. Run `supabase/analytics.sql` to enable it; until then the dashboard says so rather than erroring, and the rest of the page still works.

It stores no IP address, user agent, cookie or anything identifying a person. Sessions are grouped by a random id in `sessionStorage`, which dies with the tab — so the figure is honestly labelled **visits** (browsing sessions), not unique visitors, and it cannot follow anyone between visits. Admin pages are excluded so your own use is not counted as shop traffic. Expect some inflation from bots and link previewers.

Both aggregate in memory from a single query. That is ample at this shop's scale and keeps one code path across both backends; the traffic query is capped at 10,000 rows per period and the dashboard says when it has hit the cap rather than quietly under-reporting.
