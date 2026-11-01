# PLACEMENT RADAR — Readiness & Gap Studio 🎯

> **A full-stack placement readiness platform powered by React 18, Vite, Tailwind CSS, Zustand, and an Express + SQLite (Prisma ORM) backend. University students calibrate their skills, benchmark against 10 industry roles, visualize skill gaps on a dynamic radar chart, follow a week-by-week study roadmap, build an ATS-friendly resume, and export executive readiness reports.**

---

## 🏗️ Architecture Overview

```
c:\Users\hp\Gvt
├── .env.example                # Frontend environment template
├── .env                        # Frontend environment (VITE_API_URL=/api/v1)
├── package.json                # Frontend & full-stack orchestrator scripts
├── vite.config.js              # Vite config with /api proxy to backend (localhost:5000)
├── src/                        # React frontend (Pages, Components, Stores, Utils)
│   ├── services/api.js         # Axios client with JWT refresh queue & interceptors
│   ├── store/useAuthStore.js   # JWT-based authentication Zustand store
│   ├── store/useAppStore.js    # Data store with optimistic updates & debounced autosave
│   ├── pages/                  # Route views (Login, Signup, Skills, Role, Radar, Roadmap, Resume, Report, Settings)
│   └── components/             # Reusable UI components & ProtectedRoute
└── server/                     # Express 4 + Prisma ORM + SQLite Backend
    ├── .env.example            # Backend environment template
    ├── .env                    # Backend environment config
    ├── prisma/
    │   ├── schema.prisma       # Prisma schema (7 models, cascade deletes, indexes)
    │   └── dev.db              # SQLite zero-setup database file
    ├── src/
    │   ├── config/             # Zod-validated env and Prisma client instance
    │   ├── middleware/         # Auth JWT verification, validation, rate limiting, error handlers
    │   ├── utils/              # Bcrypt, JWT generation/verification, standard response wrappers
    │   ├── services/           # Pure calculation engines: analysis, roadmap, resume ATS
    │   ├── controllers/        # Express route controllers for all domains
    │   ├── routes/             # Express API v1 routers
    │   ├── jobs/               # Daily guest cleanup cron job
    │   ├── seed/               # Reference benchmarks & demo user seeder
    │   ├── app.js              # Express app setup (Helmet, CORS, HPP, Compression, Morgan)
    │   └── server.js           # Server bootstrap & cleanup job initialization
    └── tests/                  # Unit tests for pure calculations, crypto, roadmap, and ATS
```

---

## ⚡ Quick Start & Run Instructions

### 1. Install Dependencies
In the root directory, install frontend and server dependencies:
```bash
# Install root/client dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 2. Initialize Database & Seed Demo Data
```bash
cd server
# Generate Prisma Client & push schema to SQLite
npx prisma generate
npx prisma db push

# Seed reference data and demo candidate account
node src/seed/seed.js
cd ..
```

### 3. Run Backend and Frontend Concurrently
From the root directory, run both servers in parallel:
```bash
npm run dev:all
```
- **Frontend**: `http://localhost:5173` (proxies `/api` to port 5000)
- **Backend API**: `http://localhost:5000/api/v1`
- **Health Check**: `http://localhost:5000/api/v1/health`

### 🔑 Demo Account Credentials
- **Email**: `demo@placementradar.dev`
- **Password**: `Demo1234!`
- *Alternatively, click **"Continue as Guest"** on `/login` to generate a 7-day auto-expiring sandbox profile with pre-calibrated starter data.*

---

## 🧪 Testing

The backend includes a comprehensive unit test suite covering auth cryptography, ATS scoring, XYZ bullet diagnostics, streak logic, and readiness calculations:
```bash
cd server
npm test
```

---

## 📡 API Reference (`/api/v1`)

All endpoints return a consistent JSON response shape:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "errors": null
}
```

### 1. Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/signup` | Registers new candidate with initialized ratings & resume | Public |
| `POST` | `/auth/login` | Authenticates candidate, sets 7-day httpOnly refresh cookie | Public |
| `POST` | `/auth/guest` | Creates ephemeral 7-day guest account | Public |
| `POST` | `/auth/refresh` | Rotates refresh token & issues new 15-min access token | Refresh Cookie |
| `POST` | `/auth/logout` | Revokes stored refresh token & clears cookie | Bearer Token |
| `GET` | `/auth/me` | Returns current candidate profile & preferences | Bearer Token |
| `PATCH` | `/auth/password` | Changes password after validating old password | Bearer Token |

### 2. User & Settings (`/api/v1/users`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `PATCH` | `/users/profile` | Updates name, college, and graduation year | Bearer Token |
| `PATCH` | `/users/settings` | Updates theme, mode, fontScale, reduceMotion, onboardingDone | Bearer Token |
| `GET` | `/users/export` | Exports entire candidate workspace as JSON | Bearer Token |
| `POST` | `/users/import` | Imports and synchronizes workspace inside a Prisma transaction | Bearer Token |
| `DELETE` | `/users/me` | Permanently deletes user account & cascades all data | Bearer Token |

### 3. Reference Metadata (`/api/v1/meta`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/meta/skills` | Lists all 30 core skills, categories, and descriptions | Public |
| `GET` | `/meta/roles` | Lists 10 target roles, skill benchmark levels, and weights | Public |
| `GET` | `/meta/company-modes` | Lists 4 company modes (Product, FAANG, Startup, Service) | Public |

### 4. Skills Calibration (`/api/v1/skills`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/skills` | Returns candidate's 30 skill ratings and confidence flags | Bearer Token |
| `PUT` | `/skills/:skillId` | Upserts individual skill level (0–5) and confidence bonus | Bearer Token |
| `PUT` | `/skills/bulk` | Batch upsert ratings inside a Prisma transaction | Bearer Token |
| `DELETE` | `/skills` | Resets all skill ratings to 0 | Bearer Token |

### 5. Role & Benchmark Comparison (`/api/v1/role`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/role` | Returns active target role and company mode | Bearer Token |
| `PUT` | `/role` | Updates candidate target role and company mode | Bearer Token |
| `GET` | `/role/compare` | Compares match readiness % across all 10 roles sorted desc | Bearer Token |

### 6. Analysis & What-If Engine (`/api/v1/analysis`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/analysis` | Calculates readiness score (0–100), verdict, 6-axis radar, gaps | Bearer Token |
| `POST` | `/analysis/what-if` | Computes simulated score boost from temporary overrides | Bearer Token |
| `POST` | `/analysis/snapshot` | Upserts daily readiness progress snapshot (max 1/day) | Bearer Token |
| `GET` | `/analysis/history` | Returns historical readiness score snapshots for line chart | Bearer Token |

### 7. Learning Roadmap (`/api/v1/roadmap`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/roadmap/generate` | Generates 4/8/12/16-week curated sprint based on deficits | Bearer Token |
| `GET` | `/roadmap` | Retrieves roadmap sprint weeks, tasks, resources, and streak | Bearer Token |
| `PATCH` | `/roadmap/tasks/:taskId` | Toggles task done; returns `weekCompleted: true` for confetti | Bearer Token |
| `PATCH` | `/roadmap/settings` | Updates roadmap duration and daily commitment hours | Bearer Token |
| `POST` | `/roadmap/pomodoro` | Logs focus/break pomodoro session | Bearer Token |

### 9. Mock Interview Module (`/api/v1/interview`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/interview/start` | Initiates new mock interview session with role questions | Bearer Token |
| `POST` | `/interview/submit-answer` | Evaluates written answer (Relevance, Correctness, Completeness) | Bearer Token |
| `POST` | `/interview/finish` | Finalizes interview session, computes diagnostic feedback | Bearer Token |
| `GET` | `/interview/history` | Lists past candidate interview sessions and scores | Bearer Token |
| `GET` | `/interview/session/:id` | Returns complete interview question breakdown & feedback | Bearer Token |

### 10. Technical Skill Verification (`/api/v1/verify`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/verify/topics` | Returns 9 verified technical assessment topics & difficulties | Bearer Token |
| `POST` | `/verify/start` | Generates timed 5-minute quiz for chosen topic & level | Bearer Token |
| `POST` | `/verify/submit` | Grades quiz submissions, logs verified score & explanations | Bearer Token |
| `GET` | `/verify/history` | Returns verified skill assessment test history | Bearer Token |

### 11. Dashboard Cockpit (`/api/v1/dashboard`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/dashboard/overview` | Executive metrics: 4 pillars, velocity, recent feed, radar | Bearer Token |

### 12. ATS Resume & Job Match Studio (`/api/v1/resume`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/resume` | Retrieves saved resume structure and template settings | Bearer Token |
| `PUT` | `/resume` | Autosaves resume sections with debounced payload | Bearer Token |
| `POST` | `/resume/job-match` | Compares candidate resume with pasted job description | Bearer Token |
| `POST` | `/resume/parse-text` | Extracts structured skills, education, and bullets from text | Bearer Token |
| `POST` | `/resume/sync-skills` | Imports calibrated skills with level >= 3 into resume skills | Bearer Token |
| `POST` | `/resume/ats-score` | Analyzes resume ATS match, keyword density, and metrics | Bearer Token |
| `POST` | `/resume/improve-bullet` | Identifies weak verbs and recommends XYZ metric formulations | Bearer Token |

### 13. Executive Report (`/api/v1/report`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/report` | Aggregates dossier: score, radar, gaps, velocity, 30-day plan | Bearer Token |
| `GET` | `/report/summary` | Returns markdown-formatted summary for one-click sharing | Bearer Token |

### 14. Health (`/api/v1/health`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/health` | Verifies server uptime and SQLite database connectivity | Public |

---

## 🔒 Security & Data Integrity
1. **Zero Password Leakage**: Passwords are hashed with `bcryptjs` (salt cost 12). Password hashes are never selected or returned in any API response.
2. **Dual-Token JWT Architecture**:
   - Access token: 15-minute validity, stored in client memory.
   - Refresh token: 7-day validity, delivered via `httpOnly` secure cookie.
   - Token revocation: SHA-256 hash of refresh tokens is stored in the database. When the user logs out, the token is revoked immediately.
3. **Database Cascade Deletion**: All child tables (`SkillRating`, `Roadmap`, `RoadmapWeek`, `RoadmapTask`, `Resume`, `Snapshot`, `PomodoroSession`, `RefreshToken`) have `onDelete: Cascade` linked to `User.id`. Deleting an account completely cleans up all associated records.
4. **Guest Auto-Purge**: Guest accounts expire after 7 days (`guestExpiresAt`). A scheduled cron job (`node-cron`) automatically deletes expired guests and cascades their data daily and upon server startup.

---

## 🚀 Production Deployment Notes

### SQLite Deployment (Render / Railway / Fly.io)
SQLite stores the entire database in a single local file (`server/prisma/dev.db`). In containerized environments with ephemeral filesystems (like Render or Railway free tiers), the file system resets when the dyno/container restarts or redeploys:
1. **Attach a Persistent Volume / Disk**:
   - In Render or Railway, create a Persistent Disk (e.g. mounted at `/data`).
   - In `server/.env`, set:
     ```env
     DATABASE_URL="file:/data/dev.db"
     ```
2. **PostgreSQL Migration Path**:
   Switching to managed PostgreSQL requires only two adjustments:
   - In `server/prisma/schema.prisma`:
     ```prisma
     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
     }
     ```
   - In `server/.env`:
     ```env
     DATABASE_URL="postgresql://user:password@hostname:5432/dbname?schema=public"
     ```
   - Run `npx prisma db push` or `npx prisma migrate deploy`.

---

## 📋 Page-by-Page Verification Checklist

- [x] **Auth & Onboarding (`/login`, `/signup`)**
  - Sign up a new user with graduation year and college.
  - Test password strength meter and inline validation.
  - Test 3-slide onboarding modal.
  - Test 1-click **"Continue as Guest"**.
- [x] **Skills Calibration (`/skills`)**
  - Adjust sliders; verify live level badge and category counts update.
  - Toggle "Solve live without Google" confidence checkbox.
  - Verify auto-saving with live "Saved ✓" indicator.
  - Verify "Reset All" clears ratings on both client and backend.
- [x] **Target Role & Company Mode (`/role`)**
  - Switch between Product, FAANG, Startup, and Service modes; verify requirements scale.
  - Select target role; verify navbar role pill updates instantly.
  - Verify side-by-side match percentages in "Compare All Roles".
- [x] **Radar & Gaps (`/radar`)**
  - Verify 6-axis category radar polygon and circular readiness gauge.
  - Test What-If Simulator with temporary overrides; observe live delta without altering saved skills.
  - Test "Apply to Skills" to commit simulated scores.
- [x] **Roadmap (`/roadmap`)**
  - Generate customized sprint plan for selected role.
  - Check off tasks; verify completion percentage and streak counter increment.
  - Complete all tasks in a week; verify **celebratory confetti explosion** fires.
  - Test 25/5 Pomodoro focus timer.
- [x] **ATS Resume Studio (`/resume`)**
  - Edit resume sections with debounced autosave.
  - Click "Sync Calibrated Skills" to import level 3+ skills.
  - Check real-time ATS compatibility gauge and suggestions.
  - Test Bullet Improver with weak phrases (e.g. "worked on").
  - Test "Print / Download PDF" with A4 print layout.
- [x] **Executive Report (`/report`)**
  - Verify aggregated student dossier and 30-day action plan.
  - Inspect score velocity history chart.
  - Test "Copy Summary" for shareable markdown text.
- [x] **Studio Settings (`/settings`)**
  - Switch between 6 accent themes (Brick Red, Ocean Blue, Forest Green, Royal Purple, Sunset Orange, Slate Mono).
  - Toggle Dark Mode.
  - Export and import full workspace JSON.
