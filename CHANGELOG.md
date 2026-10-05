# Changelog

## v2.0.0

[compare changes](https://github.com/iamsomraj/MERN-Shopping-App/compare/d4aec81...v2.0.0)

### ✨ Highlights

- **Frontend on React 19.3 + Vite 8**: `@vitejs/plugin-react` 6, TypeScript 5.9, and ESLint 9 flat config (`npm run lint` works again).
- **Backend rewritten in TypeScript** on **Express 5** and **Mongoose 9**: strict types, typed models, zod-validated environment, ESLint + Prettier.
- **API test suite**: 21 Vitest + Supertest tests against an in-memory MongoDB.
- **Self-hosted product images**: images no longer depend on fakestoreapi.com, which went down and broke every product image.
- **Direct links work on Vercel**: opening or refreshing a page like `/products/:id` no longer returns 404.
- **Release tooling**: versions and this changelog are generated with changelogen from Conventional Commits.

### 🔒 Security & bug fixes

- Registration no longer lets anyone make themselves an admin (`isAdmin` in the request body is ignored).
- Orders can only be read or marked paid by their owner or an admin.
- Order totals are computed from database prices instead of prices sent by the client.
- Requests without a token get `401` immediately instead of hanging until the function times out.
- Updating a profile or user without an email no longer overwrites the email with the password hash.
- Saving a user no longer re-hashes an already-hashed password (which broke login after profile edits).
- `GET /api/orders/admin/all` works again (it was shadowed by `/:id`).
- Malformed ids return `404` instead of `500`; admin user lists no longer include password hashes.
- Error responses are sent once (no more "headers already sent").

### ⚠️ Breaking changes

- The backend requires **Node 22**. Start it with `npm run dev`, or `npm run build` then `npm start`, instead of `node index`.
- `POST /api/orders` validates `{ products: [{ product, qty }] }` and ignores client-sent `price`/`name`.
- The backend refuses to start if `MONGODB_URI` or `SECRET` is missing or any env value is invalid.

### 🚀 Enhancements

- **backend:** 🎉 migrate API to TypeScript with zod env validation and hardened auth ([b3bfe45](https://github.com/iamsomraj/MERN-Shopping-App/commit/b3bfe45))

### 🩹 Fixes

- Self-host product images (fakestoreapi.com is down) ([b854e20](https://github.com/iamsomraj/MERN-Shopping-App/commit/b854e20))
- Add SPA rewrite so deep links don't 404 on Vercel ([143da6e](https://github.com/iamsomraj/MERN-Shopping-App/commit/143da6e))
- **backend:** 🐛 stop profile updates corrupting email and re-hashing passwords ([16a91b4](https://github.com/iamsomraj/MERN-Shopping-App/commit/16a91b4))
- **backend:** 🚀 build the TypeScript API entry with @vercel/node and pin Node 22 ([507ddae](https://github.com/iamsomraj/MERN-Shopping-App/commit/507ddae))

### 📖 Documentation

- 📝 update READMEs for React 19 / Vite 8 and the TypeScript backend ([f3db743](https://github.com/iamsomraj/MERN-Shopping-App/commit/f3db743))
- 📝 document Node 22 and the Vercel API build setup ([74bc56a](https://github.com/iamsomraj/MERN-Shopping-App/commit/74bc56a))

### 🏡 Chore

- **frontend:** ⬆️ upgrade to React 19.3, Vite 8 and ESLint flat config ([a2b1c82](https://github.com/iamsomraj/MERN-Shopping-App/commit/a2b1c82))
- **backend:** ⬆️ upgrade to Express 5, Mongoose 9 and latest packages ([d1dd1e0](https://github.com/iamsomraj/MERN-Shopping-App/commit/d1dd1e0))
- 🔧 add changelogen release tooling and root package.json ([bf63c4c](https://github.com/iamsomraj/MERN-Shopping-App/commit/bf63c4c))

### ✅ Tests

- **backend:** ✅ add API tests with Vitest, Supertest and in-memory MongoDB ([78c8d9d](https://github.com/iamsomraj/MERN-Shopping-App/commit/78c8d9d))
- **backend:** 🔐 generate throwaway test credentials instead of hardcoding them ([44a19f3](https://github.com/iamsomraj/MERN-Shopping-App/commit/44a19f3))

### ❤️ Contributors

- Somraj Mukherjee <iamsomraj@gmail.com>
