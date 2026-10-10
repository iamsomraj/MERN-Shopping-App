# One Stop EShop — API

Express 5 + Mongoose 9 REST API for One Stop EShop, written in TypeScript.

## Requirements

- Node.js **22** (the same version Vercel runs)
- A MongoDB database: MongoDB Atlas, or a local `mongod` / Docker container

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in the values
npm run up             # seed demo data (wipes existing data!)
npm run dev            # http://localhost:4500
```

### Environment variables

Variables are validated with [zod](https://zod.dev) at startup (`src/config/env.ts`). A missing or invalid value stops the server with a clear message, so it never fails later on the first request. A blank value counts as unset.

| Variable                    | Required | Default                            | Description                                                                                              |
| --------------------------- | -------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `MONGODB_URI`               | ✅       |                                    | MongoDB connection string                                                                                |
| `SECRET`                    | ✅       |                                    | Secret used to sign JWTs                                                                                 |
| `NODE_ENV`                  |          | `development`                      | `development`, `production` or `test`                                                                    |
| `PORT`                      |          | `4500`                             | Port for the local server                                                                                |
| `PAYPAL_CLIENT_ID`          |          | `''`                               | PayPal client ID served at `/api/config/paypal`. Leave it empty to disable payments.                     |
| `PAYPAL_CLIENT_SECRET`      |          |                                    | When set, the server captures PayPal payments itself, after checking the order, its stock and the amount |
| `PAYPAL_API_BASE`           |          | `https://api-m.sandbox.paypal.com` | Use `https://api-m.paypal.com` for live payments                                                         |
| `PRODUCTION_CLIENT_ORIGIN`  |          |                                    | Allowed CORS origin when `NODE_ENV=production`                                                           |
| `DEVELOPMENT_CLIENT_ORIGIN` |          | `http://localhost:5173`            | Allowed CORS origin otherwise                                                                            |

## Scripts

| Script                            | What it does                                                                  |
| --------------------------------- | ----------------------------------------------------------------------------- |
| `npm run dev`                     | Start with hot reload (`tsx watch`)                                           |
| `npm run build`                   | Compile to `dist/` with `tsc`                                                 |
| `npm start`                       | Run the compiled server (`dist/src/server.js`)                                |
| `npm run typecheck`               | Type-check without emitting                                                   |
| `npm run lint`                    | ESLint (flat config, typescript-eslint)                                       |
| `npm run format` / `format:check` | Prettier                                                                      |
| `npm test` / `test:watch`         | Vitest + Supertest against an in-memory MongoDB                               |
| `npm run up`                      | Seed users, products, reviews and demo orders. **Deletes** all existing data. |
| `npm run check`                   | Lint, format check, typecheck, tests and build                                |
| `npm run down`                    | Delete all data                                                               |

Seeded logins (password `123456`):

- `admin@example.com` and `somraj@example.com` (admins)
- `john@example.com` and `jane@example.com` (customers)

The demo orders span the last 30 days and cover every order status, so the admin dashboard has data to show.

> **Data model changes** (for example this release: slugs, categories, reviews, order statuses, shipping addresses) are applied by reseeding with `npm run up`. It wipes the database and loads fresh demo data.

## Project structure

```
api/index.ts            Vercel serverless entry (exports the Express app)
src/
  app.ts                Express app: CORS, logging, routes, error handling
  server.ts             Local entry: connects to MongoDB and listens on PORT
  seeder.ts             npm run up / down
  config/               env validation, cached MongoDB connection
  controllers/          admin/, order/, product/, review/, user/, wishlist/ handlers
  middlewares/          auth (userAuth/adminAuth), errors
  models/               typed Mongoose models: User, Product, Review, Order
  routes/               /api/users, /api/products, /api/orders, /api/admin
  data/                 seed data (products, reviews, demo orders) and the image library
  utils/                pricing, validation, PayPal verification, slugs
tests/                  API tests (in-memory MongoDB, never touches .env)
```

## Data model

- **Product:**
  - `name`, unique `slug`, `description`, `category`, `brand`
  - `images[]`: `image` mirrors the first one
  - `price`, optional `compareAtPrice` (the original price when on sale)
  - `qtyInStock`, `isAvailable`, `isFeatured`
  - `rating` and `numReviews`, aggregated from reviews
- **Review:** `product`, `user`, `rating` (1–5), `title`, `comment`, `isVerifiedPurchase`. Each user can review a product once.
- **Order:**
  - `products[]`, a snapshot of name, image, price and qty
  - `shippingAddress`
  - `itemsPrice`, `shippingPrice` and `totalPrice`, all computed on the server
  - `status`: `pending → paid → shipped → delivered`, or `cancelled`
  - timestamps for each status change, and `paymentResult`
  - `isPaymentDone` stays in sync for older clients
- **User:** `name`, `email`, `password` (bcrypt), `isAdmin`, `wishlist[]`

Shipping is free on orders of $100 or more, and $9.99 otherwise (`src/utils/pricing.ts`).

## API

Protected routes expect `Authorization: Bearer <token>`. Errors are returned as `{ message, stack }`, where `stack` is `null` in production. Request bodies and query strings are validated with zod, and invalid input returns `400`.

### Products and reviews

| Method | Route                       | Access | Notes                                                                                                                                                                                                                                                                        |
| ------ | --------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/products`             | public | Available products only. Query: `keyword`, `category`, `brand`, `minPrice`, `maxPrice`, `inStock`, `featured`, `onSale`, `sort` (`featured`, `newest`, `price-asc`, `price-desc`, `rating`), `page`, `limit` (≤ 48, default 12). Returns `{ products, page, pages, total }`. |
| GET    | `/api/products/filters`     | public | `{ categories: [{ name, count, image }], brands, priceRange }`                                                                                                                                                                                                               |
| GET    | `/api/products/:idOrSlug`   | public | Look up by ObjectId or slug                                                                                                                                                                                                                                                  |
| GET    | `/api/products/:id/related` | public | Up to 4 products from the same category                                                                                                                                                                                                                                      |
| POST   | `/api/products`             | admin  | JSON body: `name, description, category, brand, price, compareAtPrice?, qtyInStock, images[], isFeatured, isAvailable`                                                                                                                                                       |
| PUT    | `/api/products/:id`         | admin  | Partial update                                                                                                                                                                                                                                                               |
| DELETE | `/api/products/:id`         | admin  | Toggles availability (soft delete)                                                                                                                                                                                                                                           |
| GET    | `/api/products/:id/reviews` | public | `?page`. Returns `{ reviews, page, pages, total, rating, distribution, viewerHasReviewed }`. `viewerHasReviewed` is set when a valid token is sent                                                                                                                           |
| POST   | `/api/products/:id/reviews` | user   | `{ rating, title?, comment }`. Returns `409` if the user has already reviewed the product.                                                                                                                                                                                   |

### Users and wishlist

| Method         | Route                            | Access | Notes                                                                         |
| -------------- | -------------------------------- | ------ | ----------------------------------------------------------------------------- |
| POST           | `/api/users`                     | public | Register (never grants admin)                                                 |
| POST           | `/api/users/login`               | public | Returns a JWT valid for 5 days                                                |
| GET / PUT      | `/api/users/profile`             | user   | Update name, email or password                                                |
| GET / POST     | `/api/users/wishlist`            | user   | `POST { productId }` adds a product (idempotent)                              |
| DELETE         | `/api/users/wishlist/:productId` | user   |                                                                               |
| GET            | `/api/users`                     | admin  | All users except the caller                                                   |
| GET/PUT/DELETE | `/api/users/:id`                 | admin  | `PUT { isAdmin }` changes the role. Admins can't demote or delete themselves. |

### Orders

| Method | Route                    | Access      | Notes                                                                                                                                                                                                                                                                              |
| ------ | ------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/orders`            | user        | `{ products: [{ product, qty }], shippingAddress }`. Prices, shipping and stock are checked on the server.                                                                                                                                                                         |
| GET    | `/api/orders`            | user        | The caller's orders, newest first                                                                                                                                                                                                                                                  |
| GET    | `/api/orders/:id`        | owner/admin |                                                                                                                                                                                                                                                                                    |
| PUT    | `/api/orders/:id/pay`    | owner/admin | `{ id }` (the PayPal order id). With `PAYPAL_CLIENT_SECRET` set, the server checks the order, stock and amount, then captures the payment. Without it, the body is the client-side capture. Each PayPal payment can pay only one order. Marks the order paid and decrements stock. |
| PUT    | `/api/orders/:id/cancel` | owner/admin | Unpaid orders only                                                                                                                                                                                                                                                                 |
| PUT    | `/api/orders/:id/status` | admin       | `{ status }` moves `paid → shipped → delivered`, or cancels a pending or paid order                                                                                                                                                                                                |
| GET    | `/api/orders/admin/all`  | admin       | `?status&page&limit`. Returns `{ orders, page, pages, total }`.                                                                                                                                                                                                                    |

### Admin and config

| Method | Route                      | Access | Notes                                                                                              |
| ------ | -------------------------- | ------ | -------------------------------------------------------------------------------------------------- |
| GET    | `/api/admin/stats`         | admin  | Revenue, counts, orders by status, low stock, recent orders, and sales by day for the last 30 days |
| GET    | `/api/admin/products`      | admin  | All products, including hidden ones. Query: `keyword`, `page`, `limit`.                            |
| GET    | `/api/admin/image-library` | admin  | Paths of the bundled product images                                                                |
| GET    | `/api/config/paypal`       | public | PayPal client ID                                                                                   |
| GET    | `/api/config/payments`     | public | `{ paypalClientId, serverCapture }`                                                                |

## Deployment (Vercel)

The Vercel project `one-stop-eshop-api` uses root directory `backend`.

- `vercel.json` builds `api/index.ts` with `@vercel/node` and routes every path to it, so the whole API runs as one Node 22 function. Vercel compiles the TypeScript itself; `npm run build` isn't used there.
- The MongoDB connection is cached across warm invocations.
- Vercel's filesystem is read-only, so the API stores image URLs rather than accepting file uploads.

In the Vercel project:

- Set the environment variables above, with `NODE_ENV=production` and `PRODUCTION_CLIENT_ORIGIN` set to the frontend URL.
- MongoDB Atlas must allow connections from Vercel (Network Access `0.0.0.0/0`).
