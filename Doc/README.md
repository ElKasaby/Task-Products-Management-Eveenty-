# Eveenty API

## Overview

Eveenty is a Node.js/TypeScript REST API for managing products, orders and payments using PostgreSQL, Prisma ORM, Stripe, and JWT-based authentication. Swagger is enabled for API documentation and a Postman collection is included.

---

## Tech Stack

- **Runtime**: Node.js, TypeScript
- **Framework**: Express 5
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT (Bearer token)
- **Payments**: Stripe
- **Docs**: Swagger (OpenAPI 3) at `/api-docs`
- **Containerization**: Docker, docker-compose

---

## Environment Variables

Create a `.env` file in the project root (`node js task for Eveenty/.env`). The file is used both locally and by Docker.

Minimum required variables:

```bash
# Database connection (local app, DB exposed on localhost:5434)
DATABASE_URL="postgresql://your-user:your-password@localhost:5434/eveenty?schema=public"

# JWT secret used to sign access tokens
JWT_SECRET="your-strong-jwt-secret"

# Stripe secret key (use a test key during development)
STRIPE_SECRET_KEY="sk_test_xxx"

# Port for the HTTP server (optional, defaults to 8080 in code)
PORT=8080
```

When running **both app and database in Docker** via `docker-compose`, the app connects to the database service by its container name `db`:

```bash
# Example DATABASE_URL for docker-compose app container
DATABASE_URL="postgresql://your-user:your-password@db:5432/eveenty?schema=public"
```

Adjust values if you change the database credentials or ports.

---

## Local Development Setup (Host Node.js)

### 1. Prerequisites

- Node.js **20+** (or compatible version)
- npm
- PostgreSQL 15+ (either installed locally or using Docker)

### 2. Clone and install dependencies

```bash
npm install
```

### 3. Start PostgreSQL

You can either use your own PostgreSQL instance, or reuse the Docker compose DB service:

```bash
# Start only the database service in the background
docker compose up db -d
```

This exposes PostgreSQL on `localhost:5434` with:

- User: `your-user`
- Password: `your-password`
- Database: `eveenty`

Make sure your local `.env` has:

```bash
DATABASE_URL="postgresql://your-user:your-password@localhost:5434/eveenty?schema=public"
```

### 4. Run Prisma migrations & generate client

Apply existing migrations and generate the Prisma client:

```bash
npx prisma generate
npx prisma migrate deploy
```

(If you are setting up for the very first time and need to create an initial migration, you can use `npx prisma migrate dev --name init` instead.)

### 5. Run the application in dev mode

```bash
npm run dev
```

The server will start on `http://localhost:8080` (or on `PORT` from `.env` if set).

### 6. Accessing the API and docs locally

- Health check: `GET http://localhost:8080/`
- Swagger UI: `GET http://localhost:8080/api-docs`
- Auth base path: `http://localhost:8080/auth`
- User endpoints: `http://localhost:8080/users`
- Admin endpoints: `http://localhost:8080/admin`

To call protected endpoints, first sign up / log in to obtain a JWT and then send it as:

```http
Authorization: Bearer <your-jwt-token>
```

---

## Running with Docker (App + DB)

This project includes a `Dockerfile` and `docker-compose.yml` to run the API and PostgreSQL together.

### 1. Ensure `.env` is configured for Docker

Use a `DATABASE_URL` that points to the `db` service:

```bash
DATABASE_URL="postgresql://postgres:your-password@db:5432/eveenty?schema=public"
JWT_SECRET="your-strong-jwt-secret"
STRIPE_SECRET_KEY="sk_test_xxx"
PORT=8080
```

### 2. Build and start the stack

From the project root:

```bash
# Build images and start containers
docker compose up --build
```

What happens:

- `db` (PostgreSQL) starts and is health-checked.
- `app` (Eveenty API) is built from the `Dockerfile`.
- Inside the `app` container the following runs (see `docker-compose.yml`):
  - `npx prisma generate`
  - `npx prisma migrate deploy`
  - `npm run start` (runs the compiled `dist/server.js`)

### 3. Accessing the app in Docker

Once containers are healthy:

- API base URL: `http://localhost:8080/`
- Swagger UI: `http://localhost:8080/api-docs`

### 4. Stopping containers

```bash
docker compose down
```

This stops and removes the containers. The PostgreSQL data is persisted in the `pgdata` named volume.

---

## Swagger API Documentation

Swagger is configured in `src/swagger.ts` and served at:

- `http://localhost:8080/api-docs`

All main endpoints are grouped under tags like **Auth**, **Users**, and **Admin**. Use the Authorize button in Swagger UI to provide a Bearer token (JWT) when calling protected routes.

---

## Postman Collection

A ready-to-use Postman collection is provided:

- `Doc/Eveenty API.postman_collection.json`

To use it:

1. Open Postman.
2. Import the file from the `Doc` directory.
3. Set the base URL environment variable to `http://localhost:8080`.
4. Authenticate via the auth endpoints to obtain a JWT, then use it in the `Authorization` header.

---

## Scripts Reference

From `package.json`:

- `npm run dev` – Run the server in watch mode (development, uses `src/server.ts`).
- `npm run build` – Compile TypeScript to JavaScript (`dist/`).
- `npm run start` – Run the compiled server (`dist/server.js`).
- `npm test` – Run Jest tests.

---

## Common Workflows

- **First-time local setup**

  1. `npm install`
  2. `docker compose up db -d`
  3. Configure `.env` with `DATABASE_URL`, `JWT_SECRET`, `STRIPE_SECRET_KEY`.
  4. `npx prisma generate`
  5. `npx prisma migrate deploy`
  6. `npm run dev`

- **Full Docker stack**
  1. Configure `.env` for Docker (`DATABASE_URL` host = `db`).
  2. `docker compose up --build`
  3. Open `http://localhost:8080/api-docs` in the browser.
