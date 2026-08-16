# Project-Drishti — Deployment Documentation

This document explains how Project-Drishti is deployed, including the backend, frontend, and database setup, along with how data flows through the system.

---

## 1. Overview

Project-Drishti is a full-stack healthcare appointment management platform, split into three independently deployed pieces:

| Layer      | Platform         | Purpose                                  |
|------------|------------------|-------------------------------------------|
| Frontend   | Cloudflare Workers | Serves the UI (React + TanStack Start)   |
| Backend    | Render           | Handles API requests, business logic     |
| Database   | MongoDB Atlas    | Stores all persistent data (users, appointments, etc.) |

---

## 2. Repository Structure

```
Project-Drishti/
├── backend/     → Node.js + Express API (deployed on Render)
├── frontend/    → React + TanStack Start app (deployed on Cloudflare Workers)
├── .gitignore
├── LICENSE
└── README.md
```

---

## 3. Backend Deployment (Render)

**Platform:** [Render](https://render.com) — Web Service, Free Tier

### Configuration
| Setting | Value |
|---|---|
| Repository | `jaikaran109/Project-Drishti` |
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` (runs `node server.js`) |
| Instance Type | Free |

### Environment Variables
Set under **Render → Environment**:

| Key | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string (cloud database, not local) |
| `JWT_SECRET` | Secret key used for signing authentication tokens |
| `PORT` | Port the server listens on (optional — Render auto-assigns if unset) |
| `ALLOWED_ORIGINS` | Comma-separated list of frontend URLs allowed to call this API (CORS) |
| `ADMIN_NAME`, `ADMIN_PHONE`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Default admin account seed values |

### Live Backend URL
```
https://project-drishti-le4s.onrender.com
```

### Notes
- The free instance **spins down after ~15 minutes of inactivity**. The first request after idle time may take 30–60 seconds to respond while the server wakes up.
- `ALLOWED_ORIGINS` must include the frontend's live URL once it's deployed, or API calls from the frontend will be blocked by CORS.

---

## 4. Database (MongoDB Atlas)

**Platform:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) — M0 Free Cluster

### Setup steps taken
1. Created a free M0 cluster.
2. Created a database user (`jaik04227_db_user`) with a password.
3. Under **Network Access**, added `0.0.0.0/0` (Allow Access from Anywhere) so Render's dynamic IPs can connect.
4. Retrieved the connection string via **Connect → Drivers**, added the database name (`drishti`) to the URI.

### Connection String Format
```
mongodb+srv://<username>:<password>@project-drishti.fti9nze.mongodb.net/drishti?appName=Project-Drishti
```

This value is stored only as the `MONGO_URI` environment variable on Render — it is **never committed to GitHub**.

### Verifying stored data
Any data submitted through the app (signups, appointments, etc.) can be viewed by:
1. Logging into MongoDB Atlas.
2. Opening the cluster → **Browse Collections**.
3. Navigating to the `drishti` database to see live documents (e.g. `users`, `appointments` collections).

---

## 5. Frontend Deployment (Cloudflare Workers)

**Platform:** Cloudflare Workers (via `wrangler`, using `@cloudflare/vite-plugin`)

The frontend is built with **TanStack Start** (React-based SSR framework), originally scaffolded via Lovable.dev, which pre-configures the Cloudflare deployment pipeline.

### Configuration
| Setting | Value |
|---|---|
| Repository | `jaikaran109/Project-Drishti` |
| Root Directory | `/frontend` |
| Build Command | `npm run build` |
| Deploy Command | `npx wrangler deploy` |

### Environment Variables
Set under **Cloudflare → Settings → Variables and secrets**:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://project-drishti-le4s.onrender.com` (the live backend URL) |

### Notes
- In local development, API calls are proxied via `vite.config.ts` (`/api → http://localhost:5000`). This proxy **only works locally** — in production, the frontend uses `VITE_API_URL` to call the live backend directly.
- After deployment, the Workers URL must be **enabled** under the Overview tab (it is disabled by default) to get a public-facing link.

---

## 6. Data Flow (End-to-End)

```
User fills a form on the deployed frontend
        ↓
Frontend sends an API request to VITE_API_URL (Render backend)
        ↓
Backend (Express + Mongoose) validates and processes the request
        ↓
Backend writes/reads data from MongoDB Atlas (drishti database)
        ↓
Response sent back to frontend → UI updates
```

All persistent data (user accounts, appointments, etc.) lives in **MongoDB Atlas**, not on Render or Cloudflare — both of those are stateless compute layers.

---

## 7. Common Issues Encountered & Fixes

| Issue | Cause | Fix |
|---|---|---|
| Render deploy failed — `uri parameter must be a string, got undefined` | `MONGO_URI` env variable missing on Render | Added `MONGO_URI` under Render → Environment |
| Render deploy failed — could not connect to MongoDB Atlas | Render's IP not whitelisted in Atlas | Added `0.0.0.0/0` under Atlas → Network Access |
| Cloudflare build failed | Root directory was set to `/` instead of `/frontend` | Updated Root Directory to `/frontend` |
| No live frontend URL after deploy | Workers.dev URL was disabled by default | Enabled the URL under Overview tab |
| Git showed `NotesApp` as an empty folder link on GitHub | `NotesApp` had its own nested `.git` folder (tracked as embedded repo) | Removed nested `.git`, re-added files as regular tracked files |

---

## 8. Useful Links

- Backend (Render): https://project-drishti-le4s.onrender.com
- GitHub Repo: https://github.com/jaikaran109/Project-Drishti
- MongoDB Atlas Cluster: `project-drishti.fti9nze.mongodb.net`
