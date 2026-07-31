# DevTrack — Developer Operating System

DevTrack is a production-oriented **Next.js 15** application designed to track developer activity, projects, AI-generated tasks, learning, interviews, and achievements.

---

## 🚀 Tech Stack & Key Features

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4
- **Database & Backend**: Supabase 
- **Authentication**: Clerk (`@clerk/nextjs`)
- **AI Integration**: OpenRouter API (for AI task generation)
- **State Management**: Zustand
- **UI & Components**: Custom Components

---

## 🛠️ Environment Variables Setup

Project ke root directory me **`.env`** ya **`.env.local`** file banayein aur ye exact variables fill karein:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# AI Task Integration
OPENROUTER_API_KEY=sk-xxxxxxxxxxxxxxxx

# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-publishable-key
CLERK_SECRET_KEY=your-secret-key

# Clerk Route Redirects
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

```
---

## Getting Started Locally
npm install
npm run build

---

## 🔐 Authentication (Clerk)

Dedicated sign-in & sign-up pages (/sign-in, /sign-up).

User session verification across Server Components, Client Components, and Next.js API routes.

after Successful login automatic /dashboard redirect logic.

---

## 🗄️ Database Integration (Supabase)

The native Supabase JS Client (@supabase/supabase-js) is used for backend storage and database queries.

All Supabase interaction helper queries and database instances are centralized inside the lib/supabase/ folder

## 🤖 AI Features (OpenRouter)

DevTrack helps auto-generate developer workflows and tasks using the OpenRouter API (/app/api/ai/generate-task/route.ts)