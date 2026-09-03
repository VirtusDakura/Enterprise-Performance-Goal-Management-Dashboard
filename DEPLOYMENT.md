# Deployment & Cloud Integration Guide

This guide details how to deploy the decoupled full-stack architecture using **Neon** (PostgreSQL), **Render** (Express API), and **Vercel** (Next.js Dashboard).

---

## Architecture Overview

```mermaid
graph LR
    User[Client Browser] -->|HTTPS| Vercel[Vercel: Next.js Frontend]
    Vercel -->|REST API Requests| Render[Render: Express.js ESM Backend]
    Render -->|SSL Encrypted Query| Neon[(Neon: Serverless PostgreSQL)]
```

---

## Step 1: Database Setup with Neon

1. Navigate to [neon.tech](https://neon.tech) and sign in.
2. Click **Create Project**:
   - **Project Name**: `enterprise-performance`
   - **Postgres Version**: 16 (default)
   - **Region**: Choose the region closest to your users / Render service (e.g., `US East (Ohio)` or `EU Frankfurt`).
3. Under **Connection Details**, copy your pooled connection string:
   ```
   postgresql://username:password@ep-xyz-123.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. **Push Schema and Seed Neon Database from your local machine**:
   Open a terminal in the `backend/` directory:
   ```bash
   cd backend

   # 1. Temporarily point to Neon or pass inline:
   npx prisma db push --schema=prisma/schema.prisma

   # 2. Run seed script to populate departments, employees, goals, and reviews:
   npm run seed
   ```
   *(Alternatively, paste your Neon URL into `backend/.env` under `DATABASE_URL` before running `npx prisma db push` and `npm run seed`)*.

---

## Step 2: Deploy Backend to Render

1. Push your repository to **GitHub**.
2. Log in to [render.com](https://render.com) and click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the Web Service settings:
   - **Name**: `enterprise-performance-api`
   - **Region**: Same region as your Neon database (e.g. `Ohio (US East)`).
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm install && npx prisma generate && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
   - **Instance Type**: `Free`

5. Add **Environment Variables**:

   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production optimizations |
   | `DATABASE_URL` | `postgresql://...sslmode=require` | Your Neon connection string |
   | `CORS_ORIGIN` | `https://*.vercel.app` | Or your specific Vercel URL once deployed |

6. Click **Create Web Service**.
7. Once deployed, Render will provide a service URL, e.g.:
   `https://enterprise-performance-api.onrender.com`
8. Verify backend health by visiting:
   `https://enterprise-performance-api.onrender.com/api/health`
   Expected response:
   ```json
   {
     "status": "ok",
     "timestamp": "...",
     "service": "enterprise-performance-api"
   }
   ```

---

## Step 3: Deploy Frontend to Vercel

1. Log in to [vercel.com](https://vercel.com) and click **Add New...** -> **Project**.
2. Select your GitHub repository.
3. In the project configuration screen:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click **Edit** and select `frontend`.
4. Expand the **Environment Variables** section and add:

   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://enterprise-performance-api.onrender.com/api` | Render backend URL + `/api` |

5. Click **Deploy**.
6. Vercel will build and deploy the Next.js frontend, generating a production domain, e.g.:
   `https://enterprise-performance-dashboard.vercel.app`

---

## Step 4: Final Handshake (CORS Verification)

Once your Vercel URL is live:
1. Go to your **Render Dashboard** -> `enterprise-performance-api` -> **Environment**.
2. Update `CORS_ORIGIN` to your exact Vercel URL (e.g. `https://enterprise-performance-dashboard.vercel.app`).
3. Save changes (Render will automatically redeploy in seconds).

---

## Summary of Environment Variables

### Backend (Render)
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
CORS_ORIGIN=https://enterprise-performance-dashboard.vercel.app
```

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://enterprise-performance-api.onrender.com/api
```
