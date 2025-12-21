# Nexora Job Portal - Frontend

A modern, full-featured job portal built with Next.js 15, React 19, TypeScript, and Chakra UI v3.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15 with App Router, React 19, TypeScript, Chakra UI v3
- **Authentication System**: Dedicated login and registration pages with proper routing
- **Advanced Job Search**: Comprehensive job search with filters (location, job type, experience, salary, remote)
- **Responsive Design**: Mobile-first, fully responsive design
- **Dark/Light Mode**: Built-in theme switching with next-themes
- **State Management**: Redux Toolkit for global state management
- **Form Handling**: React Hook Form with validation
- **Modern UI Components**: Chakra UI v3 with custom components

## 📁 Project Structure

## Local environment

Create a `.env.local` file at the project root (not committed) and add your backend URL:

```
API_URL=http://localhost:8000
```

Use the provided API route proxies under `/api/proxy/*` so the client never directly exposes your backend URL. The project includes a catch-all proxy at `/api/proxy/[...path]` which forwards requests to the backend (see `.env.local.example` for `API_URL` and optional `PROXY_ALLOWLIST`).

Authentication & route protection

- The app adds an `AuthContext` (client) and server `middleware` to protect routes.
- Middleware checks for an `access_token` cookie and redirects unauthenticated users from protected pages (`/dashboard`, `/jobs`) to `/login` (with a `from` param).
- Login currently stores `access_token` in `localStorage` and sets a fallback cookie so middleware can operate until the backend sets a secure httpOnly cookie. For best security, prefer the backend to set an httpOnly cookie on login (the proxy forwards `set-cookie`).
- Client-side protections (AuthGuard) are added to `/dashboard` and `/jobs` to avoid flash-of-unauthenticated content.

Testing locally

1. Start backend and frontend.
2. POST to `/api/proxy/auth/login` to get an `access_token` and confirm the app sets `localStorage` and a cookie.
3. Visit `/dashboard` — you should be redirected to `/login` if not authenticated and allowed into `/dashboard` if authenticated.



```
my-job-portal/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/             # Auth route group (doesn't affect URL)
│   │   │   ├── login/          # /login route
│   │   │   ├── register/       # /register route
│   │   │   └── layout.tsx      # Auth-specific layout
│   │   ├── dashboard/          # /dashboard route
│   │   ├── jobs/               # /jobs route
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # Organized by feature
│   │   ├── auth/               # Authentication components
│   │   ├── jobs/               # Job-related components
│   │   ├── layout/             # Layout components
│   │   ├── ui/                 # Reusable UI components
│   │   └── Providers.tsx       # Consolidated providers
│   ├── lib/                    # Utilities and configuration
│   │   ├── store.ts            # Redux store
│   │   ├── Hooks/
│   │   └── Slice/
```

## 🛠 Key Improvements Made

### 1. **Component Reorganization**
- Moved all components from `src/app/components/` to `src/components/`
- Organized components by feature (auth, jobs, layout, ui)
- Better separation of concerns

### 2. **Provider Consolidation**
- Unified Redux Provider, Chakra UI Provider, and Color Mode Provider
- Single `Providers.tsx` file for cleaner architecture

### 3. **Proper Dark Mode**
- Replaced manual dark mode implementation with next-themes
- Integrated with Chakra UI ColorModeProvider

### 4. **Authentication Routing**
- Created route groups for authentication (`(auth)`)
- Dedicated pages for login and registration

### 5. **Advanced Job Search**
- Comprehensive search functionality with real-time filtering
- Multiple filter options: location, job type, experience, salary, remote work

## 📱 Routes

- `/` - Home page with hero section and job listings
- `/login` - Sign in page
- `/register` - Registration page
- `/jobs` - Dedicated jobs page with search and filters
- `/dashboard` - User dashboard with application tracking

## 🚀 Getting Started

```bash
npm install
npm run dev
```
