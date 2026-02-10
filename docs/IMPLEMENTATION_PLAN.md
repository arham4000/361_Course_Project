# Implementation Plan

This document provides phased, actionable steps to build the candidate–job matching application from an empty repo to a working system. For system design and data flow, see [ARCHITECTURE.md](ARCHITECTURE.md).

**First sprint:** See [SPRINT_1.md](SPRINT_1.md) for a scoped goal (accept profiles and jobs, generate matches, display to users) and which phases/tasks map to it.

---

## Repo and Tooling

- **Layout:** Monorepo with:
  - `frontend/` – React app
  - `backend/` – Express API
  - `services/` – Python microservices (e.g. `services/matching/`)
  - `docs/` – Architecture and this plan
- **Node:** Use a consistent Node version (e.g. 18+ or 20+); document in `backend/package.json` engines or in README.
- **Python:** Use a virtual environment for the matching service (e.g. `python -m venv venv` under `services/matching/` or at repo root). Document Python version (e.g. 3.10+).
- **Running:**
  - Frontend: `cd frontend && npm install && npm run dev`
  - Backend: `cd backend && npm install && npm run dev` (or `node server.js`)
  - Matching service: `cd services/matching && pip install -r requirements.txt && python -m matching` (or equivalent)

---

## Phase 1 – Scaffold

1. Create the directory layout: `frontend/`, `backend/`, `services/matching/`, `docs/`.
2. **Frontend:** Initialize a React app (Vite or Create React App) inside `frontend/`. Ensure it has a dev script and a build script.
3. **Backend:** Initialize `backend/` with `package.json`, an Express server that listens on a configurable port (e.g. 3001), and a single health route (e.g. `GET /health` returning `{ ok: true }`).
4. **Matching service:** In `services/matching/`, add a minimal Python script that binds a ZMQ REP socket (e.g. `tcp://*:5555`), receives one message, and replies with a fixed JSON response (e.g. `{"status":"ok"}`). Add `requirements.txt` with `pyzmq` (and any version pin you want).
5. Update the main README with short “How to run” sections for frontend, backend, and matching service, and links to `docs/ARCHITECTURE.md` and `docs/IMPLEMENTATION_PLAN.md`.

---

## Phase 2 – Backend Core

1. **Express setup:** Add CORS middleware (allow frontend origin). Load config from environment (e.g. `PORT`, `ZMQ_MATCHING_ENDPOINT` or `ZMQ_MATCHING_PORT`). Keep the health route.
2. **Database:** Choose a DB (e.g. SQLite for dev, PostgreSQL for prod). Add schema for:
   - **Users:** id, email, passwordHash, role (`job_seeker` | `recruiter`), createdAt.
   - **JobSeekerProfiles:** id, userId, name, skills (or JSON/text), experience, preferences (or JSON/text), createdAt, updatedAt.
   - **JobListings:** id, userId, title, description, requirements, createdAt, updatedAt.
   Optionally add a **Matches** or match-cache table later; not required for initial flow.
3. **Auth:** Implement:
   - `POST /api/auth/register` – body: email, password, role; hash password, insert User, return success or error.
   - `POST /api/auth/login` – body: email, password; verify, issue JWT (payload: userId, role), return token and role.
   - Middleware: for protected routes, verify JWT and set `req.user = { id, role }`. Return 401 if missing or invalid.
4. **CRUD (minimal):** Endpoints for the app to use later:
   - Job seeker profile: `POST /api/profiles`, `GET /api/profiles/me` (or by userId), `PUT /api/profiles/:id` (ensure owner).
   - Job listings: `POST /api/jobs`, `GET /api/jobs` (list recruiter’s jobs), `GET /api/jobs/:id` (ensure owner or allow for matches).
   Enforce ownership using `req.user.id` and `req.user.role`.

---

## Phase 3 – Python Matching Service

1. **ZMQ REP server:** Bind REP socket (e.g. `tcp://*:5555`), read one message per request, parse JSON. Expect a shape like `{ "type": "match_job", "jobId": "..." }` or `{ "type": "match_profile", "profileId": "..." }` (see [ARCHITECTURE.md](ARCHITECTURE.md) and Phase 4 for contract).
2. **Stub matching:** For each request type, return a stub response, e.g. `{ "matches": [], "error": null }` or a few dummy match IDs. Document in code or README where to plug in the real matching algorithm (e.g. “Replace stub in `match_job()` / `match_profile()`”).
3. **Startup/shutdown:** Handle process signals (e.g. SIGTERM) to close the socket and exit cleanly. Optionally add a note about running in Docker (same port exposed, same message contract).

---

## Phase 4 – Express–ZMQ Bridge

1. **ZMQ client in Node:** In the Express app, add a ZMQ client (e.g. `zeromq` package) using a REQ socket. Connect to the Python REP endpoint (e.g. `tcp://localhost:5555`). Send JSON request, receive JSON response. Use a timeout (e.g. 5s) and on timeout or parse error return 503 or 500 with a clear message.
2. **Match routes:** Implement:
   - `GET /api/jobs/:id/matches` – Recruiter only. Load job by id, ensure ownership. Send `{ type: "match_job", jobId }` to Python; return the `matches` array (or error) to client.
   - `GET /api/profiles/:id/matches` – Job seeker only. Load profile by id, ensure ownership. Send `{ type: "match_profile", profileId }` to Python; return the `matches` array (or error) to client.
3. **Error handling:** Distinguish “no matches” (empty list, 200) from “matching service unavailable” (503) and invalid/forbidden request (4xx).

---

## Phase 5 – Frontend Structure

1. **React Router:** Set up routes:
   - `/` – Home
   - `/login` – Login page
   - `/job-seeker/dashboard` – Job seeker dashboard
   - `/job-seeker/profile` – Create/edit profile
   - `/job-seeker/matches` – Browse job matches
   - `/recruiter/dashboard` – Recruiter dashboard
   - `/recruiter/jobs` or `/recruiter/jobs/new` – Create job listing
   - `/recruiter/jobs/:id/matches` – Candidate matches for a specific job
2. **Auth context/store:** Store JWT and role (e.g. in context or state) after login. Role-based redirect: after login, redirect job_seeker to `/job-seeker/dashboard` and recruiter to `/recruiter/dashboard`. For “/”, redirect logged-in users by role or show a simple landing with links to login.
3. **Guards:** Protect role-specific routes: if user is not logged in, redirect to `/login`; if role doesn’t match the section (e.g. recruiter on `/job-seeker/*`), redirect to their dashboard or home.
4. **Shared UI:** Navbar or layout that shows “Dashboard”, “Profile” / “Jobs”, “Matches” as appropriate for the role, and a logout action.

---

## Phase 6 – Frontend Pages and API Wiring

1. **Login:** Login form calls `POST /api/auth/login`, stores token and role, then redirects by role (see Phase 5). Show validation errors.
2. **Job seeker:**
   - **Create profile:** Form (name, skills, experience, preferences) → `POST /api/profiles` (and optionally `PUT` for edit). Redirect or confirm success.
   - **Dashboard:** List current user’s profile(s) via `GET /api/profiles/me` (or equivalent); link to create/edit and to “Browse matches”.
   - **Browse matches:** `GET /api/profiles/:id/matches` (use current user’s profile id); display list of matched jobs (title, description, etc. if API returns them or fetch by id).
3. **Recruiter:**
   - **Create job:** Form (title, description, requirements) → `POST /api/jobs`. Redirect or confirm.
   - **Dashboard:** List recruiter’s jobs via `GET /api/jobs`; link to “Create job” and to “View matches” per job.
   - **Job candidate matches:** For a job id, `GET /api/jobs/:id/matches`; display list of matched candidates (e.g. profile summary); ensure only the job owner can access.
4. **API client:** Use fetch or axios with base URL from env (e.g. `VITE_API_URL` or `REACT_APP_API_URL`). Attach JWT to requests (e.g. `Authorization: Bearer <token>`).

---

## Phase 7 – Polish and Ops

1. **Environment:** Add `.env.example` for backend (PORT, DB URL, JWT secret, ZMQ endpoint) and for frontend (API URL). Add `.env.example` for the matching service (port or bind address). Do not commit real `.env` files.
2. **Validation:** Validate request bodies on Express (e.g. express-validator or manual checks) for register, login, profile, and job creation. Return 400 with clear messages.
3. **Errors:** Ensure API returns consistent error shape (e.g. `{ error: "message" }` or `{ message, code }`). Frontend shows user-friendly messages for 4xx/5xx.
4. **Tests (optional):** Add a few integration or unit tests for auth and match routes if time allows; document how to run them.
5. **Deployment notes:** In README or a short `docs/DEPLOYMENT.md`, note run order: (1) Database up, (2) Python matching service up and bound to ZMQ port, (3) Express up, (4) Frontend built and served (or use dev servers for local). List required env vars for each component.

---

## Alignment with Architecture

- ZMQ pattern, message shape, and who is client/server: see [ARCHITECTURE.md](ARCHITECTURE.md#zeromq-integration).
- Data flow for matching (create profile/job → DB; request matches → Express → ZMQ → Python → response): see [ARCHITECTURE.md](ARCHITECTURE.md#data-flow-matching-pipeline).
- Auth and roles: see [ARCHITECTURE.md](ARCHITECTURE.md#auth-and-roles).

Keep this plan and the architecture doc in sync when changing APIs or adding services.
