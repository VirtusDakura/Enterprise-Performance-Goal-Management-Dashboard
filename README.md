# Enterprise Performance & Goal Management System

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

An enterprise-grade, decoupled full-stack B2B SaaS platform that enables organizations to align strategic objectives, track departmental goals with real-time velocity, and submit structured 360-degree peer performance reviews.

Built strictly using modern **ES Modules (ESM)**, **TypeScript**, **Node.js/Express**, **Prisma ORM with PostgreSQL**, and a reactive **Next.js + Tailwind CSS** frontend.

---

## Architecture

The system is structured as a decoupled monorepo adhering to clean architecture principles:

```
Enterprise-Performance-Goal-Management-Dashboard/
├── backend/                  # Node.js, Express, Prisma ORM (PostgreSQL), TypeScript (ESM)
│   ├── prisma/
│   │   ├── schema.prisma     # Relational schema (Department, Employee, Goal, PeerReview)
│   │   └── seed.ts           # Database seed script with corporate entities & reviews
│   ├── src/
│   │   ├── controllers/      # Request handlers & HTTP response mapping
│   │   ├── middleware/       # Zod validation & centralized error handler
│   │   ├── routes/           # Domain API routers (/api/goals, /api/analytics, etc.)
│   │   ├── services/         # Business logic & complex Prisma aggregations
│   │   ├── validations/      # Runtime Zod schema validators
│   │   ├── lib/              # Prisma singleton instance
│   │   ├── types/            # DTO interfaces and domain contracts
│   │   ├── app.ts            # Express application setup
│   │   └── server.ts         # Server entrypoint with graceful shutdown
│   ├── Dockerfile            # Multi-stage production container
│   ├── package.json          # ESM package configuration ("type": "module")
│   └── tsconfig.json         # ESNext bundler configuration
│
├── frontend/                 # Next.js 14 (App Router), Tailwind CSS, TypeScript
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx    # Root layout with dark enterprise theme
│   │   │   ├── page.tsx      # Reactive dashboard with optimistic UI updates
│   │   │   └── globals.css   # Tailored theme tokens, glassmorphism & slider styles
│   │   ├── components/
│   │   │   ├── Navbar.tsx            # Header with live sync indicator & goal creation
│   │   │   ├── AnalyticsWidgets.tsx  # KPI cards (Active Goals, Velocity, Top Dept, Reviews)
│   │   │   ├── GoalFilters.tsx       # Search, department pills, status, sort, view toggle
│   │   │   ├── GoalCard.tsx          # Card with optimistic slider & nested reviews drawer
│   │   │   ├── GoalTable.tsx         # High-density data table view
│   │   │   ├── ReviewModal.tsx       # 360° Peer Feedback modal with 1-5 star selector
│   │   │   ├── CreateGoalModal.tsx   # Goal creation and employee assignment dialog
│   │   │   └── Toast.tsx             # Floating notification alerts
│   │   ├── lib/
│   │   │   ├── api.ts        # Typed API client
│   │   │   └── utils.ts      # Date formatters, badges, and class helpers
│   │   └── types/            # TypeScript interfaces
│   ├── Dockerfile            # Multi-stage production container
│   ├── next.config.mjs       # ESM Next.js configuration
│   ├── postcss.config.mjs    # ESM PostCSS configuration
│   ├── tailwind.config.ts    # Tailwind theme configuration
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml        # Multi-container orchestration (Postgres, Backend, Frontend)
├── package.json              # Monorepo root scripts
└── README.md
```

---

## Relational Database Schema (PostgreSQL)

Configured in `backend/prisma/schema.prisma` with cascading integrity and indexes:

```mermaid
erDiagram
    DEPARTMENT ||--o{ EMPLOYEE : "employs"
    EMPLOYEE ||--o{ GOAL : "owns"
    GOAL ||--o{ PEER_REVIEW : "receives"

    DEPARTMENT {
        string id PK "UUID"
        string name UK "Unique department title"
        datetime createdAt
        datetime updatedAt
    }

    EMPLOYEE {
        string id PK "UUID"
        string name "Full name"
        string email UK "Unique corporate email"
        string role "Corporate title"
        string avatarUrl "Profile image"
        string departmentId FK
        datetime createdAt
        datetime updatedAt
    }

    GOAL {
        string id PK "UUID"
        string title "Goal summary"
        text description "Deliverables & acceptance criteria"
        datetime deadline "Target completion date"
        int progress "0 - 100 percentage"
        string employeeId FK
        datetime createdAt
        datetime updatedAt
    }

    PEER_REVIEW {
        string id PK "UUID"
        string reviewerName "Reviewer identity"
        text feedback "Constructive peer feedback"
        int rating "1 - 5 star score"
        string goalId FK
        datetime createdAt
        datetime updatedAt
    }
```

---

## Running with Docker (Recommended)

The repository provides full Docker orchestration with container healthchecks:

### Option A: Start PostgreSQL Only (For Local Development)
```bash
# Start PostgreSQL on port 5432 with persistent volume
docker compose up -d postgres

# Push schema and seed database
cd backend
npx prisma db push
npm run seed
cd ..

# Run dev servers concurrently
npm run dev
```

### Option B: Start Full Application Stack in Containers
```bash
# Build and start postgres, backend API, and frontend web client
docker compose up --build
```

- **Frontend Application**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **PostgreSQL Database**: `localhost:5432`

### Option C: Cloud Deployment (Vercel + Render + Neon)
For complete instructions on deploying the frontend to **Vercel**, the API to **Render**, and the database to **Neon**, see the [Cloud Deployment Guide](DEPLOYMENT.md).

---

## Local Development Setup

### Prerequisites
- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher
- **PostgreSQL**: Local instance or via `docker compose up -d postgres`

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment
In `backend/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/enterprise_performance?schema=public"
CORS_ORIGIN="http://localhost:3000"
```

In `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Synchronize Schema & Seed Database
```bash
cd backend
npx prisma db push
npm run seed
cd ..
```

### 4. Start Development Servers
From the root directory:
```bash
npm run dev
```

- **Backend API**: `http://localhost:5000` (Health probe: `http://localhost:5000/api/health`)
- **Frontend Dashboard**: `http://localhost:3000`

---

## REST API Specification

Base URL: `http://localhost:5000/api`

### Goals Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/goals` | Fetch all goals with nested `employee`, `department`, and `reviews`. Supports filtering via `departmentId`, `status`, and `search`. |
| `GET` | `/api/goals/:id` | Fetch a single goal by UUID. |
| `POST` | `/api/goals` | Create a new goal assigned to an employee with Zod payload validation. |
| `PATCH` | `/api/goals/:id/progress` | Update goal progress percentage (0–100%). |
| `POST` | `/api/goals/:id/reviews` | Submit a 360° peer review with a 1–5 rating and text feedback. |

#### Update Goal Progress
```bash
curl -X PATCH http://localhost:5000/api/goals/<GOAL_ID>/progress \
  -H "Content-Type: application/json" \
  -d '{"progress": 85}'
```

#### Submit 360° Peer Review
```bash
curl -X POST http://localhost:5000/api/goals/<GOAL_ID>/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "reviewerName": "Marcus Chen",
    "rating": 5,
    "feedback": "Outstanding execution on zero-trust perimeter automation. Reduced audit prep time by 70%."
  }'
```

### Analytics Endpoint

`GET /api/analytics`

Computes real-time organization metrics using Prisma relational aggregations:
- `totalActiveGoals`: Goals with `progress < 100`.
- `totalCompletedGoals`: Goals with `progress == 100`.
- `companyAverageProgress`: Organization-wide mean velocity across all goals.
- `topDepartment`: Department with the highest average goal progress, including goal count and employee headcount.
- `departmentBreakdown`: Velocity summaries per department.
- `averageReviewRating`: Organization-wide mean peer review score out of 5.

---

## Key Technical Decisions

### Modern ES Modules & Modern Tooling
- The backend runs natively in **Node.js ESM mode** (`"type": "module"`) using **`tsx`** for high-velocity TypeScript execution and hot-reloading without CommonJS transpilation overhead.
- Frontend uses **Next.js 14 App Router** with native `.mjs` configuration modules.

### Complex Prisma Aggregations
- Employs `prisma.goal.aggregate({ _avg: { progress: true } })` for company-wide velocity calculation.
- Calculates department velocity by aggregating goal progress through employee relations, properly handling zero-goal departments and ties.
- Uses PostgreSQL case-insensitive search (`mode: 'insensitive'`) for performant text queries across title, description, and employee name.

### State Management & Optimistic UI
- **Instant Visual Feedback**: Goal cards maintain optimistic local state; adjusting the slider immediately updates the progress bar and percentage indicator.
- **Debounced Backend Sync**: Network requests are debounced by 350ms to eliminate server flooding during slider dragging, with automatic rollback and toast notification on failure.
- **Dynamic Status Transitions**: Hitting 100% updates the card to "Completed" with an emerald badge and triggers a background sync of organization analytics.