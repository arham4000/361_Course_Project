# Sprint 1: Core Matching Flow

## Goal

To enable the system to **accept job seeker profiles and job listings**, **generate matches between them**, and **display those matches to users**, demonstrating the core functionality of the application.

## Definition of Done

- A job seeker can register, create a profile (e.g. name, skills, experience), and see a list of **matched job listings** for that profile.
- A recruiter can register, create a job listing (e.g. title, description, requirements), and see a list of **matched job seekers** for that job.
- Matching is performed by the Python microservice over ZeroMQ (not hardcoded in the API). The matching logic can be simple (e.g. keyword overlap) but must be real enough to demonstrate different results for different inputs.
- All three components run locally: React frontend, Express backend, Python matching service.

## In Scope

| Area | What to build |
|------|----------------|
| **Scaffold** | [Phase 1](IMPLEMENTATION_PLAN.md#phase-1--scaffold): `frontend/`, `backend/`, `services/matching/`, health route, minimal ZMQ REP. |
| **Backend** | [Phase 2](IMPLEMENTATION_PLAN.md#phase-2--backend-core): CORS, DB (Users, JobSeekerProfiles, JobListings), register + login (JWT), `POST/GET /api/profiles` (and `GET /api/profiles/me`), `POST/GET /api/jobs` (list recruiter’s jobs, get one by id). Enforce role and ownership. |
| **Matching service** | [Phase 3](IMPLEMENTATION_PLAN.md#phase-3--python-matching-service) + real matching: ZMQ REP, accept `match_job` and `match_profile`. For **match_job**, receive job + list of profiles (sent by Express); return ordered profile ids. For **match_profile**, receive profile + list of jobs; return ordered job ids. Use a simple algorithm (e.g. keyword/skills overlap) so results vary by input. |
| **Express–ZMQ** | [Phase 4](IMPLEMENTATION_PLAN.md#phase-4--express-zmq-bridge): ZMQ client in Express, `GET /api/jobs/:id/matches` (recruiter), `GET /api/profiles/:id/matches` (job seeker). Express loads job (or profile) and full list of profiles (or jobs) from DB, sends them to Python, returns the ranked list. Include timeout and 503 if service is down. |
| **Frontend** | [Phase 5](IMPLEMENTATION_PLAN.md#phase-5--frontend-structure) + [Phase 6](IMPLEMENTATION_PLAN.md#phase-6--frontend-pages-and-api-wiring): Router, auth (login + register), role-based redirect. **Job seeker:** create profile page per [User Story 1](USER_STORIES.md#user-story-1-create-a-job-seeker-profile) (10 input fields + 2 file uploads: resume, cover letter; single page), dashboard (show my profile + link to matches), browse matches page per [User Story 3](USER_STORIES.md#user-story-3-see-relevant-openings) (call `GET /api/profiles/:id/matches`; display only matched jobs with title, company, location, match score; 80% threshold; show match criteria; no ads/notifications). **Recruiter:** create job page per [User Story 8](USER_STORIES.md#user-story-8-create-a-job-listing) (≤10 input fields, single page; matching criteria—e.g. required skills, experience level, location—selectable and displayed; submit only when criteria set), dashboard (list my jobs + link to matches per job), job candidate matches page per [User Story 3](USER_STORIES.md#user-story-3-see-relevant-openings) (call `GET /api/jobs/:id/matches`; display only matched profiles with key details and match score; 80% threshold; show match criteria; no ads/notifications). API client with JWT. |

## Out of Scope for Sprint 1

- Edit profile / edit job (create-only is enough to demonstrate matching).
- Match caching or persistence; matches are computed on demand.
- Password reset, email verification, or advanced auth.
- Deployment or production config; local run only.
- Comprehensive tests or validation polish (minimal validation is fine).
- Phase 7 polish (e.g. `.env.example` and deployment notes can be a quick add if time allows, but not required for “done”).

## Implementation Order

1. **Scaffold** – Create frontend, backend, and matching service; backend health route; Python REP that echoes or returns a fixed response.
2. **Backend data and auth** – DB schema, migrate/create tables; register and login with JWT; profile and job CRUD with role checks.
3. **Matching service logic** – Define JSON contract (request: job + profiles array, or profile + jobs array; response: ordered ids). Implement simple matching (e.g. score by keyword overlap), return ranked ids.
4. **Express match routes** – ZMQ client; load job + all profiles (or profile + all jobs) from DB; send to Python; return matches. Handle errors and timeouts.
5. **Frontend** – Auth pages and context; job seeker create profile + dashboard + matches page; recruiter create job + dashboard + candidate matches page; wire all to API with JWT.

## Contract: Match Request/Response (Sprint 1)

So Express and Python stay aligned:

- **Match for a job (recruiter view)**  
  - Request: `{ "type": "match_job", "job": { "id", "title", "description", "requirements" }, "profiles": [ { "id", "name", "skills", "experience" }, ... ] }`  
  - Response: `{ "matchIds": [ "profileId1", "profileId2", ... ], "error": null }` (ordered best-first). On error: `{ "matchIds": [], "error": "message" }`.

- **Match for a profile (job seeker view)**  
  - Request: `{ "type": "match_profile", "profile": { "id", "name", "skills", "experience" }, "jobs": [ { "id", "title", "description", "requirements" }, ... ] }`  
  - Response: `{ "matchIds": [ "jobId1", "jobId2", ... ], "error": null }` (ordered best-first). On error: `{ "matchIds": [], "error": "message" }`.

Express fetches full job/profile and full list of profiles/jobs from the DB and sends them in the request so the Python service remains stateless.

## Success Criteria

- End-to-end: Create a job seeker and a recruiter, add one profile and one job, then create a second profile (or job) with different skills. Request matches for the job and for a profile; the displayed lists should reflect the matching logic (e.g. better keyword overlap appears first).
- Matching is clearly driven by the Python service (e.g. change the algorithm and see results change).
