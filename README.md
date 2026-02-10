# 361_Course_Project

Candidate–job matching web application: job seekers create profiles, recruiters create job listings, and the system matches them automatically. Built with React, Node.js/Express, and Python microservices over ZeroMQ.

- **[Architecture](docs/ARCHITECTURE.md)** – System design, data flow, and ZeroMQ integration.
- **[Implementation Plan](docs/IMPLEMENTATION_PLAN.md)** – Phased build steps and conventions.
- **[Sprint 1](docs/SPRINT_1.md)** – First sprint: accept profiles and jobs, generate matches, display to users (core functionality).
- **[User Stories](docs/USER_STORIES.md)** – Acceptance criteria and non-functional requirements for features (e.g. profile creation).

## How to run (Sprint 1)

1. **Matching service (Python)** – must be running first:
   ```bash
   cd services/matching && pip install -r requirements.txt && python http_server.py
   ```
   Listens on `http://localhost:5000`. (For ZMQ instead: `python server.py` and set `ZMQ_MATCHING_ENDPOINT` in backend; requires Node `zeromq` package.)

2. **Backend (Node)**:
   ```bash
   cd backend && npm install && npm run dev
   ```
   API at `http://localhost:3001`. Copy `.env.example` to `.env` to set `MATCHING_SERVICE_URL` (default `http://localhost:5000`) or JWT secret.

3. **Seed sample data** (10 job seeker profiles, 10 job listings):
   ```bash
   cd backend && npm run seed
   ```
   Logins: `jobseeker1@example.com` … `jobseeker10@example.com`, `recruiter@example.com` (password: `password`).

4. **Frontend (React)**:
   ```bash
   cd frontend && npm install && npm run dev
   ```
   App at `http://localhost:5173`. Uses Vite proxy to the backend.

---

Main course project repository for 361

Project Ideas:
-ATS system
-Mechanic Forum

Group Members:
Armam Ahmed
Akiranandhan Reddy Jaklapally
Jackson Manriquez
Aditi Thakir
Nathan Price
