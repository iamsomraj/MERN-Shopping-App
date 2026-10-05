# One Stop EShop — API

Express 5 + Mongoose 9 REST API for One Stop EShop, written in TypeScript.

## Requirements

- Node.js **22** (same as Vercel)
- A MongoDB database (MongoDB Atlas, or a local `mongod` / Docker container)

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in the values
npm run up             # seed sample users and products (wipes existing data!)
npm run dev            # http://localhost:4500
```

### Environment variables

Validated with [zod](https://zod.dev) at startup (`src/config/env.ts`). A missing or invalid value stops the server with a clear message instead of failing on the first request.

| Variable                    | Required | Default                 | Description                                     |
| --------------------------- | -------- | ----------------------- | ----------------------------------------------- |
| `MONGODB_URI`               | ✅       |                         | MongoDB connection string                       |
| `SECRET`                    | ✅       |                         | Secret used to sign JWTs                        |
| `NODE_ENV`                  |          | `development`           | `development`, `production` or `test`           |
| `PORT`                      |          | `4500`                  | Port for local server                           |
| `PAYPAL_CLIENT_ID`          |          | `''`                    | PayPal client id served at `/api/config/paypal` |
| `PRODUCTION_CLIENT_ORIGIN`  |          |                         | Allowed CORS origin when `NODE_ENV=production`  |
| `DEVELOPMENT_CLIENT_ORIGIN` |          | `http://localhost:5173` | Allowed CORS origin otherwise                   |

## Scripts

| Script                            | What it does                                               |
| --------------------------------- | ---------------------------------------------------------- |
| `npm run dev`                     | Start with hot reload (`tsx watch`)                        |
| `npm run build`                   | Compile to `dist/` with `tsc`                              |
| `npm start`                       | Run the compiled server (`dist/src/server.js`)             |
| `npm run typecheck`               | Type-check without emitting                                |
| `npm run lint`                    | ESLint (flat config, typescript-eslint)                    |
| `npm run format` / `format:check` | Prettier                                                   |
| `npm test` / `test:watch`         | Vitest + Supertest against an in-memory MongoDB            |
| `npm run up`                      | Seed sample data (**deletes** all orders, products, users) |
| `npm run down`                    | Delete all data                                            |

Seeded logins (password `123456`): `admin@example.com` (admin), `john@example.com`, `jane@example.com`.

## Project structure

```
api/index.ts            Vercel serverless entry (exports the Express app)
src/
  app.ts                Express app: CORS, logging, routes, error handling
  server.ts             Local entry: connects to MongoDB and listens on PORT
  seeder.ts             npm run up / down
  config/               env validation, cached MongoDB connection
  controllers/          admin/, order/, product/, user/ request handlers
  middlewares/          auth (userAuth/adminAuth), errors, multer upload
  models/               typed Mongoose models: User, Product, Order
  routes/               /api/users, /api/products, /api/orders
  data/                 seed data
tests/                  API tests (in-memory MongoDB, never touches .env)
```

## API

| Method         | Route                   | Access      | Notes                                                       |
| -------------- | ----------------------- | ----------- | ----------------------------------------------------------- |
| GET            | `/api/products?page=n`  | public      | 8 per page, returns `{ products, page, pages }`             |
| GET            | `/api/products/:id`     | public      |                                                             |
| POST           | `/api/products`         | admin       | multipart, `image` (JPEG/PNG ≤ 5 MB)                        |
| DELETE         | `/api/products/:id`     | admin       | toggles availability                                        |
| POST           | `/api/users`            | public      | register (never grants admin)                               |
| POST           | `/api/users/login`      | public      | returns a JWT (5 days)                                      |
| GET            | `/api/users/profile`    | user        |                                                             |
| PUT            | `/api/users/profile`    | user        | name / email / password                                     |
| GET            | `/api/users`            | admin       | all users except the caller                                 |
| GET/PUT/DELETE | `/api/users/:id`        | admin       |                                                             |
| POST           | `/api/orders`           | user        | `{ products: [{ product, qty }] }`; prices come from the DB |
| GET            | `/api/orders`           | user        | the caller's orders                                         |
| GET            | `/api/orders/:id`       | owner/admin |                                                             |
| PUT            | `/api/orders/:id`       | owner/admin | marks the order paid                                        |
| GET            | `/api/orders/admin/all` | admin       |                                                             |
| GET            | `/api/config/paypal`    | public      | PayPal client id                                            |

Protected routes expect `Authorization: Bearer <token>`. Errors are returned as `{ message, stack }` (`stack` is `null` in production).

## Deployment (Vercel)

The Vercel project `one-stop-eshop-api` uses root directory `backend`. `vercel.json` builds `api/index.ts` with `@vercel/node` (TypeScript is compiled by Vercel; `npm run build` isn't used on Vercel) and routes every path to it, so the whole API runs as one Node 22 function. The MongoDB connection is cached across warm invocations.

Set the environment variables above in the Vercel project, with `NODE_ENV=production` and `PRODUCTION_CLIENT_ORIGIN` set to the frontend URL. MongoDB Atlas must allow connections from Vercel (Network Access `0.0.0.0/0`).
