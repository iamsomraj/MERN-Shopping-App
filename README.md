# One Stop EShop (MERN-Shopping-App)

One Stop EShop - A Modern Fullstack E-commerce Website Built with React, Redux Toolkit, TanStack Query, Express, TypeScript, Tailwind CSS, Heroicons, MongoDB and PayPal.

## Features

- User Authentication and Registration using Tokens
- Home Page for Product Listing
- Product Listing with Pagination
- Option to Add Item To Cart
- Option to edit User Profile Details
- Ability to pay for orders
- Modern Payment Gateway using Paypal Client SDK
- Admin inventory and order management
- Dark mode
- much more

## Preview Link

✅ [Live] [https://one-stop-eshop.vercel.app/] 😊

## Walkthrough of Payment

✅ [Overview] [https://youtu.be/QjBAAmpt8oM]

## Run This Application

Requirements: **Node.js 22** and a **MongoDB** database (MongoDB Atlas, or a local `mongod` / Docker container).

- Clone One Stop EShop Repository

```bash
git clone https://github.com/iamsomraj/MERN-Shopping-App.git
cd MERN-Shopping-App
```

- Setup Environment Variables

Copy `.env.example` to `.env` in both `backend/` and `frontend/` and fill in the values.

**Backend** (validated at startup, so the server won't start with missing values):

- `MONGODB_URI`: Your MongoDB URI (required)
- `SECRET`: Secret used to sign login tokens (required)
- `NODE_ENV`: `development`, `production` or `test`
- `PORT`: Port for the backend server (default `4500`)
- `PAYPAL_CLIENT_ID`: PayPal client ID
- `PRODUCTION_CLIENT_ORIGIN`: Frontend URL allowed by CORS in production
- `DEVELOPMENT_CLIENT_ORIGIN`: Frontend URL allowed by CORS in development (default `http://localhost:5173`)

**Frontend**:

- `VITE_NODE_ENV`: Vite Node environment (e.g., "development")
- `VITE_PRODUCTION_BASE_URL`: Production base URL for the frontend
- `VITE_DEVELOPMENT_BASE_URL`: Development base URL for the frontend
- `VITE_PRODUCTION_API`: Production API URL for the frontend
- `VITE_DEVELOPMENT_API`: Development API URL for the frontend (e.g. `http://localhost:4500`)

- Install, seed sample data and start One Stop EShop

```bash
cd backend
npm install
npm run up      # seeds sample users + products (deletes existing data!)
npm run dev     # API on http://localhost:4500

# in a second terminal
cd frontend
npm install
npm run dev     # app on http://localhost:5173
```

Sample logins (password `123456`): `admin@example.com` (admin), `john@example.com`, `jane@example.com`.

More detail, including all scripts, the API reference, tests and project structure:

- [backend/README.md](backend/README.md)
- [frontend/README.md](frontend/README.md)

## Checks

```bash
cd backend  && npm run typecheck && npm run lint && npm test
cd frontend && npm run lint && npm run build
```

Backend tests run against an in-memory MongoDB and never touch the database in your `.env`.

## Deployment

Both apps are deployed on Vercel as separate projects, built automatically from `main`:

| Project              | Root directory | URL                                       |
| -------------------- | -------------- | ----------------------------------------- |
| `one-stop-eshop`     | `frontend`     | https://one-stop-eshop.vercel.app         |
| `one-stop-eshop-api` | `backend`      | https://somraj-mern-shop-api.vercel.app   |

Set the environment variables above in each Vercel project. The API needs `NODE_ENV=production` and `PRODUCTION_CLIENT_ORIGIN=https://one-stop-eshop.vercel.app`, and MongoDB Atlas must allow connections from anywhere (`0.0.0.0/0`). Product images are self-hosted in `frontend/public/images/products`.

## Releases

Versions and the [CHANGELOG](CHANGELOG.md) are generated with [changelogen](https://github.com/unjs/changelogen) from [Conventional Commits](https://www.conventionalcommits.org/) (e.g. `feat(backend): ✨ …`, `fix(frontend): 🐛 …`). To cut a release from an up-to-date `main`:

```bash
npm install                                               # once, in the repo root
npm run release                                           # bump version, update CHANGELOG.md, commit, tag, push
GITHUB_TOKEN=$(gh auth token) npx changelogen gh release  # publish the GitHub Release
```

## Tech Stack

**Frontend:**

- React 19
- Vite 8
- TypeScript
- TanStack Query (React Query) v5
- Redux Toolkit
- React Router 7
- Tailwind CSS 4
- React Paypal SDK

**Backend:**

- Node 22
- Express 5
- TypeScript
- Mongoose 9
- MongoDB
- Zod (env validation)
- Vitest + Supertest (tests)

**Language Used:**

- TypeScript

## Developer

LinkedIn : [iamsomraj](https://www.linkedin.com/in/iamsomraj/) 😊

Portfolio: [Somraj Mukherjee](https://iamsomraj.github.io/) 😊

## Show Your Support

Give me a star ⭐

if this project helped you 👦 👧

## Contributing

Pull requests are welcome. 🤝 For major changes, please open an issue first to discuss what you would like to change. 🙏

Please use Conventional Commits and make sure `npm test` (backend) and `npm run lint` / `npm run build` (both apps) pass. ✌

## License

[MIT](https://choosealicense.com/licenses/mit/) 📰
