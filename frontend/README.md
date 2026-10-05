# One Stop EShop — Frontend

React 19 + TypeScript single-page app, built with Vite 8 and styled with Tailwind CSS.

## Stack

- **React 19** with `createRoot` and StrictMode
- **Vite 8** (`@vitejs/plugin-react` 6)
- **TanStack Query v5** for server state, **Redux Toolkit** for auth, cart and product state
- **React Router 7**
- **Tailwind CSS 4** (CSS-first config in `src/styles/globals.css`) + Heroicons, dark mode
- **PayPal** via `@paypal/react-paypal-js`
- **ESLint 9** (flat config, typescript-eslint, react-hooks 7) and **Prettier**

## Setup

Requires Node.js **22** (Vite 8 needs 20.19+ at minimum).

```bash
cd frontend
npm install
cp .env.example .env   # then fill in the values
npm run dev            # http://localhost:5173
```

The dev server talks to `VITE_DEVELOPMENT_API`. Run the [backend](../backend/README.md) locally on port 4500. The production API only accepts requests from the live site.

### Environment variables

| Variable                    | Example                                   | Description                             |
| --------------------------- | ----------------------------------------- | --------------------------------------- |
| `VITE_NODE_ENV`             | `development`                             | Informational                           |
| `VITE_DEVELOPMENT_API`      | `http://localhost:4500`                   | API used by `npm run dev`               |
| `VITE_PRODUCTION_API`       | `https://somraj-mern-shop-api.vercel.app` | API used by production builds           |
| `VITE_DEVELOPMENT_BASE_URL` | `http://localhost:5173`                   | Frontend URL in development            |
| `VITE_PRODUCTION_BASE_URL`  | `https://one-stop-eshop.vercel.app`       | Frontend URL in production             |

`import.meta.env.DEV` decides which API is used (`src/config/index.ts`). The `/api` prefix is added automatically.

## Scripts

| Script            | What it does                         |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Vite dev server with HMR             |
| `npm run build`   | Type-check (`tsc`) and build to `dist/` |
| `npm run preview` | Serve the production build locally   |
| `npm run lint`    | ESLint, fails on any warning         |

## Project structure

```
public/images/products/   product images (self-hosted, referenced by the seed data)
src/
  api/          axios calls per resource (products, users, orders, payment)
  components/   UI grouped by screen (Cart, ProductScreen, PaymentScreen, …)
  config/       axios instance and error helpers
  features/     Redux slices (auth, cart, product)
  hooks/, lib/  shared hooks and utilities
  router/       route definitions (public, private and admin routes)
  screens/      page components
  store/        Redux store
  types/        shared TypeScript types
```

## Deployment (Vercel)

The Vercel project `one-stop-eshop` uses root directory `frontend`. `vercel.json` rewrites every path to `index.html` so links straight to a page like `/products/:id` load the app. Static files in `public/` and `assets/` are served first. Set the `VITE_*` variables in the Vercel project.
