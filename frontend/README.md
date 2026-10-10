# One Stop EShop — Frontend

React 19 + TypeScript storefront and admin dashboard, built with Vite 8, Tailwind CSS 4 and [shadcn/ui](https://ui.shadcn.com).

## Stack

- **React 19** and **Vite 8** (`@vitejs/plugin-react` 6, `@tailwindcss/vite`)
- **React Router 7**: data router with a lazy-loaded module per route
- **TanStack Query 5** for all server state, and **Zustand** for the auth, cart, checkout, recently-viewed and theme stores (persisted to `localStorage`)
- **shadcn/ui** (Radix UI primitives), **lucide-react** icons and **sonner** toasts
- **Tailwind CSS 4**: design tokens as CSS variables in `src/styles/globals.css`, in light and dark variants
- **React Hook Form + Zod** for forms
- **Recharts** for the admin revenue chart, loaded only on the dashboard
- **PayPal** via `@paypal/react-paypal-js`, loaded only on an unpaid order page
- **Geist** variable font, self-hosted with Fontsource
- **ESLint 9** (typescript-eslint, react-hooks 7, jsx-a11y) and **Prettier** (with Tailwind class sorting)

## Setup

Requires Node.js **22**.

```bash
cd frontend
npm install
cp .env.example .env   # then fill in the values
npm run dev            # http://localhost:5173
```

The dev server talks to `VITE_DEVELOPMENT_API`, so run the [backend](../backend/README.md) locally on port 4500. The production API only accepts requests from the live site.

### Environment variables

| Variable                    | Example                                   | Description                   |
| --------------------------- | ----------------------------------------- | ----------------------------- |
| `VITE_NODE_ENV`             | `development`                             | Informational                 |
| `VITE_DEVELOPMENT_API`      | `http://localhost:4500`                   | API used by `npm run dev`     |
| `VITE_PRODUCTION_API`       | `https://somraj-mern-shop-api.vercel.app` | API used by production builds |
| `VITE_DEVELOPMENT_BASE_URL` | `http://localhost:5173`                   | Frontend URL in development   |
| `VITE_PRODUCTION_BASE_URL`  | `https://one-stop-eshop.vercel.app`       | Frontend URL in production    |

`import.meta.env.DEV` decides which API is used (`src/lib/api.ts`), and the `/api` prefix is added automatically.

## Scripts

| Script                            | What it does                                                      |
| --------------------------------- | ----------------------------------------------------------------- |
| `npm run dev`                     | Vite dev server with HMR                                          |
| `npm run build`                   | Type-check (`tsc`) and build to `dist/`                           |
| `npm run preview`                 | Serve the production build locally                                |
| `npm run typecheck`               | Type-check only                                                   |
| `npm run lint`                    | ESLint; fails on any warning                                      |
| `npm run format` / `format:check` | Prettier                                                          |
| `npm run check`                   | Lint, format check, typecheck, build and bundle budget            |
| `npm run check:bundle`            | After a build: print gzip sizes and enforce the initial-JS budget |

## Routes

| Path                     | Page                                                                                                                                                                  | Access    |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `/`                      | Home: hero, categories, featured, deals, top rated                                                                                                                    | public    |
| `/shop`                  | Catalog with filters, sort and pagination. State lives in the URL: `q`, `category`, `brand`, `minPrice`, `maxPrice`, `inStock`, `onSale`, `featured`, `sort`, `page`. | public    |
| `/products/:slug`        | Product detail, reviews, related products                                                                                                                             | public    |
| `/cart`                  | Cart                                                                                                                                                                  | public    |
| `/login`, `/register`    | Auth. Both honour `?redirect=`.                                                                                                                                       | guests    |
| `/checkout`              | Shipping → review → place order                                                                                                                                       | signed in |
| `/orders`, `/orders/:id` | Order history, and order detail with timeline and PayPal                                                                                                              | signed in |
| `/account`               | Profile, and the wishlist (`?tab=wishlist`)                                                                                                                           | signed in |
| `/admin`                 | Dashboard                                                                                                                                                             | admin     |
| `/admin/products`        | Products list, `new`, and `:id/edit`                                                                                                                                  | admin     |
| `/admin/orders`          | Orders by status and `:id` fulfilment                                                                                                                                 | admin     |
| `/admin/users`           | Customers and roles                                                                                                                                                   | admin     |

## Project structure

```
public/images/products/   product photos (WebP, self-hosted, referenced by the seed data)
scripts/check-bundle.mjs  initial-JS budget check
src/
  api/          fetchers + TanStack Query hooks per resource (products, orders, users, admin)
  components/
    ui/         shadcn/ui components (generated; edit sparingly)
    layout/     header, footer, search (⌘K), cart drawer, theme toggle
    product/    product card, grid, gallery, price, rating, wishlist button
    shop/ home/ reviews/ checkout/ order/ admin/ auth/ common/
  hooks/        shared hooks (shop URL params, debounce, document title, …)
  layouts/      storefront and admin (sidebar) layouts
  lib/          fetch client, pricing, formatting, query client, route modules
  pages/        one module per route (each is its own chunk), admin/ for the dashboard
  stores/       Zustand stores (auth, cart, checkout, recent, theme)
  styles/       globals.css — Tailwind import, theme tokens, base styles
  types/        shared API types
  router.tsx    route table
```

## Working with shadcn/ui

Components are configured in `components.json` (New York style, zinc base, CSS variables, lucide icons). To add one:

```bash
npx shadcn@latest add accordion
```

The CLI writes to `src/components/ui/`. After adding a component:

- Check that its `cn` import points to `@/lib/utils`.
- Run `npm run format`.

### Theming

All colors are CSS variables defined in `:root` and `.dark` in `src/styles/globals.css`, then mapped to Tailwind with `@theme inline`. To change the brand color, update `--primary` and `--ring` (plus the `chart` and `sidebar` tokens). The saved theme is applied before first paint by an inline script in `index.html`, so pages never flash the wrong theme.

## Performance

- Every page, the admin area, the ⌘K search dialog and PayPal are separate chunks, loaded on demand.
- Route loaders start fetching page data while the page's code is still downloading. Hovering a product card preloads its page code and data.
- First load ships about 175 kB of gzipped JavaScript, mostly React, React Router and TanStack Query. `npm run check:bundle` fails the build above 180 kB.
- Product images are WebP, lazy-loaded, with fixed aspect ratios so the layout doesn't shift.
- The API client is a small wrapper around `fetch` (`src/lib/api.ts`) instead of axios.

## SEO

- `usePageMeta()` (`src/hooks/use-page-meta.ts`) sets each page's title, description, canonical URL, Open Graph and Twitter tags, and robots directives. Account, checkout, order and admin pages are `noindex`.
- Product pages publish `Product` structured data (price, availability, brand, rating). The home page publishes `WebSite` data with a site-search action.
- `index.html` carries default social tags and an `og-image.jpg` for crawlers that don't run JavaScript.
- `public/robots.txt` and `public/sitemap.xml` list the public pages. Update the sitemap when you add products you want indexed.

## Mobile

- Every input is at least 16px on small screens (see the end of `globals.css`), so iOS Safari doesn't zoom in when a field gets focus. Pinch-zoom is never disabled.
- On phones the header collapses into a menu sheet, and the shop filters move into a slide-over sheet.

## Deployment (Vercel)

The Vercel project `one-stop-eshop` uses root directory `frontend`. `vercel.json` rewrites every path to `index.html`, so a link straight to a page like `/products/:slug` still loads the app. Static files in `public/` and `assets/` are served first. Set the `VITE_*` variables in the Vercel project.
