# Bau Logistics

Bau Logistics is a prototype role-based construction workforce and site management system focused on Germany-based operations. The stack combines a React + TypeScript frontend, an Express API, Prisma ORM, and PostgreSQL.

## Project structure

```
bau-logistics/
├── client/   # React + TypeScript frontend (Vite + TailwindCSS)
├── server/   # Node.js + Express backend with JWT auth & RBAC middleware
├── prisma/   # Shared Prisma schema
```

The backend exposes JWT-protected routes, while the frontend currently offers a minimal login and dashboard shell for manual verification.

---

## Review guide

Follow the steps below to run both applications locally and validate the main flows.

### 1. Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ with a user that can create databases
- Two terminal windows (one for the backend, one for the frontend)

### 2. Install dependencies

From the repository root:

```bash
cd bau-logistics/server
npm install

cd ../client
npm install
```

### 3. Configure environment variables

Create the backend `.env` file based on the template:

```bash
cd ../server
cp .env.example .env
```

Update the values in `.env`:

- `DATABASE_URL` – connection string to your PostgreSQL instance
- `JWT_SECRET` – random string used to sign access tokens
- `PORT` – (optional) API port, defaults to `3001`

### 4. Prepare the database

1. Create the database (name must match the `DATABASE_URL`):

   ```bash
   createdb bau_logistics
   ```

2. From `bau-logistics/server`, push the Prisma schema and generate the client:

   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. (Optional) Open Prisma Studio to inspect data:

   ```bash
   npx prisma studio
   ```

### 5. Seed an admin user

The app requires credentials stored with a bcrypt hash. Run the command below from `bau-logistics/server` (replace `SecurePass123` with any password you prefer) to generate a hash:

```bash
node --input-type=module -e "import('bcrypt').then(({ default: bcrypt }) => bcrypt.hash('SecurePass123', 10).then(console.log))"
```

Insert a user record with the generated hash (replace `<HASH>`):

```sql
INSERT INTO "User" (username, password, role)
VALUES ('admin', '<HASH>', 'ADMIN');
```

You can run the SQL through `psql`, Prisma Studio, or your preferred client.

### 6. Run the backend API

```bash
cd bau-logistics/server
npm run dev
```

The API will be available at `http://localhost:3001`. Useful endpoints:

- `GET /api/health` – service heartbeat
- `POST /api/auth/login` – returns a JWT when valid credentials are supplied
- `GET /api/users` – requires a bearer token and `ADMIN` role, returns non-sensitive user data

Example login request with `curl`:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"SecurePass123"}'
```

Use the returned token to access protected routes:

```bash
curl http://localhost:3001/api/users \
  -H "Authorization: Bearer <TOKEN>"
```

### 7. Run the frontend

In a new terminal:

```bash
cd bau-logistics/client
npm run dev
```

The Vite dev server prints the local URL (defaults to `http://localhost:5173`). Navigate there to test the login UI. On successful authentication, the JWT is stored in `localStorage`, and the placeholder dashboard is displayed.

### 8. Review checklist

- Backend responds with `{ "status": "ok" }` on `GET /api/health`
- Invalid credentials are rejected with `401`
- Valid credentials return a JWT that unlocks `GET /api/users`
- Frontend login form calls the backend and handles success/error states
- Dashboard renders after login and retains the token across refreshes

Following the steps above replicates the environment the scaffold was designed for and lets you validate the current functionality.
