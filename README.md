# ShortlyX - NestJS & Next.js URL Shortener with Analytics

ShortlyX is a production-quality full-stack URL shortening and analytics platform built using a modular **NestJS** backend and a responsive **Next.js** frontend.

---

## Folder Structure

```
URL Shortener/
├── backend/
│   ├── src/
│   │   ├── prisma/             # NestJS global database service & module
│   │   ├── auth/               # Module, controller, service, custom guard, & decorator
│   │   ├── url/                # Shortening & root redirection controller/service
│   │   ├── analytics/          # Metric aggregation controller/service
│   │   ├── app.module.ts       # NestJS master module configuration
│   │   └── main.ts             # Entry point (boots NestJS on Express adapter)
│   ├── prisma/
│   │   └── schema.prisma       # PostgreSQL models definition
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── app/                # Next.js App Router (Layouts & Pages)
    │   ├── components/         # Modular dashboard components & charts
    │   ├── context/            # Auth & React Query providers
    │   ├── services/           # Axios client configurations
    │   └── types/              # TS interface definitions
    ├── package.json
    ├── tailwind.config.ts
    └── .env.local
```

---

## Setup Instructions

### Prerequisites
- **Node.js**: v18+ (tested on v25.4)
- **NPM**: v10+ (tested on v11.8)
- **PostgreSQL**: v14+ (tested on v15.18)

---

### Step 1: Database Setup
Make sure PostgreSQL is running locally. On macOS (Homebrew):
```bash
brew services start postgresql@15
```
Prisma will automatically create the database schema on migration.

---

### Step 2: Backend Setup (NestJS)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Initialize environment variables in `.env`:
   ```env
   PORT=5001
   DATABASE_URL="postgresql://<username>@localhost:5432/url_shortener?schema=public"
   JWT_SECRET="super_secret_jwt_key_12345_67890"
   API_URL="http://localhost:5001"
   ```
3. Install dependencies, run database migrations, and generate Prisma client:
   ```bash
   npm install
   npx prisma migrate dev --name init --schema=prisma/schema.prisma
   ```
4. Start the NestJS development server:
   ```bash
   npm run start
   ```
   The backend will run on [http://localhost:5001](http://localhost:5001).

---

### Step 3: Frontend Setup (Next.js)
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Initialize environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5001/api"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The frontend app will run on [http://localhost:3000](http://localhost:3000).

---

## API Documentation

### Base URL
All URL and Auth REST API requests are prefixed with `/api`.
In local development, the backend base path is `http://localhost:5001/api`.

---

### 1. Authentication

#### Register User
- **Endpoint**: `POST /api/auth/signup`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "fa3c01a8-fbe5-40d7-aad7-5ba8b8f3a2b5",
        "name": "John Doe",
        "email": "john@example.com",
        "createdAt": "2026-06-13T08:38:21.752Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
  ```

#### Login User
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "fa3c01a8-fbe5-40d7-aad7-5ba8b8f3a2b5",
        "name": "John Doe",
        "email": "john@example.com",
        "createdAt": "2026-06-13T08:38:21.752Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
  ```

---

### 2. URL Management
*All URL routes require a valid JWT passed in the header: `Authorization: Bearer <token>`.*

#### Create Shortened URL
- **Endpoint**: `POST /api/urls`
- **Request Body**:
  ```json
  {
    "originalUrl": "https://www.google.com"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "URL shortened successfully",
    "data": {
      "id": "87be7f0a-989b-441d-bdf5-e2d86b9022e7",
      "userId": "fa3c01a8-fbe5-40d7-aad7-5ba8b8f3a2b5",
      "originalUrl": "https://www.google.com",
      "shortCode": "GY50ky",
      "shortUrl": "http://localhost:5001/GY50ky",
      "clickCount": 0,
      "createdAt": "2026-06-13T08:38:21.962Z"
    }
  }
  ```

#### List User URLs
- **Endpoint**: `GET /api/urls`
- **Query Parameters**:
  - `search` (Optional): Filter original urls or shortcodes.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "87be7f0a-989b-441d-bdf5-e2d86b9022e7",
        "userId": "fa3c01a8-fbe5-40d7-aad7-5ba8b8f3a2b5",
        "originalUrl": "https://www.google.com",
        "shortCode": "GY50ky",
        "shortUrl": "http://localhost:5001/GY50ky",
        "clickCount": 1,
        "createdAt": "2026-06-13T08:38:21.962Z"
      }
    ]
  }
  ```

#### Delete Shortened URL
- **Endpoint**: `DELETE /api/urls/:id`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "URL deleted successfully",
    "data": {
      "success": true
    }
  }
  ```

---

### 3. Redirection (Public)

#### Redirect short link
- **Endpoint**: `GET /:shortCode`
- **Behavior**: Increments the click count, logs device/browser using client User-Agent, and returns a `302 Found` redirection header pointing the browser to the original URL.

---

### 4. Analytics
*Requires a valid JWT passed in the header: `Authorization: Bearer <token>`.*

#### Retrieve URL Analytics
- **Endpoint**: `GET /api/urls/:id/analytics`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "url": {
        "id": "87be7f0a-989b-441d-bdf5-e2d86b9022e7",
        "originalUrl": "https://www.google.com",
        "shortCode": "GY50ky",
        "shortUrl": "http://localhost:5001/GY50ky",
        "createdAt": "2026-06-13T08:38:21.962Z"
      },
      "analytics": {
        "totalClicks": 1,
        "lastVisited": "2026-06-13T08:59:23.491Z",
        "recentVisits": [
          {
            "id": "48370ae7-ea40-4b09-beb8-becbd3b8bb92",
            "visitedAt": "2026-06-13T08:59:23.491Z",
            "browser": "Chrome",
            "device": "Desktop"
          }
        ],
        "clickHistory": [
          {
            "date": "2026-06-13",
            "count": 1
          }
        ],
        "browserBreakdown": [
          {
            "name": "Chrome",
            "value": 1
          }
        ],
        "deviceBreakdown": [
          {
            "name": "Desktop",
            "value": 1
          }
        ]
      }
    }
  }
  ```

---

## Deployment Guide (NestJS)

### 1. Database (e.g. Neon, Supabase)
1. Provision a PostgreSQL instance.
2. Set the connection URL under `DATABASE_URL`.

### 2. Backend (Render / Railway)
1. Set framework build variables:
   - Build Command: `npm install && npm run build`
   - Start Command: `npx prisma migrate deploy --schema=prisma/schema.prisma && node dist/src/main`
2. Configure Environment Variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `API_URL` (public backend endpoint)

### 3. Frontend (Vercel)
1. Set NEXT_PUBLIC_API_URL pointing to the deployed backend url (`https://your-backend-url.com`).
