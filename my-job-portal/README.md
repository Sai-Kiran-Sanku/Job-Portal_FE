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

Visit [http://localhost:3000](http://localhost:3000) to see the application.
