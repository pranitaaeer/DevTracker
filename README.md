DevTrack — Developer Operating System

This repository is a scaffold for DevTrack: a production-oriented Next.js 15 app to track developer activity, projects, learning, interviews and achievements.

Key features in this scaffold:
- Next.js App Router (app/)
- TypeScript with strict mode
- Tailwind CSS
- Prisma schema for PostgreSQL (Supabase-friendly)
- Secure JWT cookie session adapter (lib/auth.ts) — can be swapped with Better Auth provider
- Server route for creating activities (app/api/actions/activity/create/route.ts)
- Singleton Prisma client (lib/prisma.ts)
- Clean, scalable folder structure separating UI, business logic and DB logic
- Reusable components, Zustand store for client state

Getting started
1. Copy .env.example to .env and set DATABASE_URL and JWT_SECRET.
2. npm install
3. npx prisma generate
4. npx prisma migrate dev --name init
5. npm run dev

Notes on authentication
- This scaffold integrates Better Auth using a Prisma adapter against a Supabase-hosted PostgreSQL database (Supabase used only as the DB). The adapter persists users, sessions and linked OAuth accounts in Prisma models.

Environment variables
- DATABASE_URL — PostgreSQL connection string (Supabase)
- BETTER_AUTH_COOKIE_NAME — optional cookie name for sessions (default: better_auth_session)
- BETTER_AUTH_REFRESH_COOKIE — optional refresh cookie name (default: better_auth_refresh)
- BETTER_AUTH_GOOGLE_CLIENT_ID — Google OAuth client id
- BETTER_AUTH_GOOGLE_CLIENT_SECRET — Google OAuth client secret
- BETTER_AUTH_GOOGLE_REDIRECT_URI — OAuth redirect URI (e.g., https://your-app.com/api/auth/google/callback)
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS — SMTP settings for outgoing emails
- EMAIL_FROM — email sender address
- NEXT_PUBLIC_APP_URL — public app URL used in emails

Next steps
- Implement client-side sign-in/register components that call server actions (app/actions/auth/*)
- Add charts (Recharts) for analytics in client components.
- Ensure to run prisma migrate after updating the schema: npx prisma migrate dev --name auth

Security & Hardening implemented
- OAuth state validation: OAuth state tokens are generated and persisted in the DB (oAuthState) and validated on callback.
- CSRF protection: server pages issue a CSRF token via a cookie and server actions validate it (double-submit cookie).
- Rate limiting: lightweight in-memory rate limiter for login/register actions; consider Redis-backed rate limiting in production.
- Email verification and password reset flows: endpoints to request and confirm email verification and password resets (tokens stored in VerificationToken table). Email sending uses nodemailer and requires SMTP config.
- Session management & refresh handling: sessions are opaque tokens stored in Session table along with refresh tokens and expiry; refresh endpoint rotates tokens.
- Security headers: middleware sets HSTS, CSP, X-Frame-Options, etc.
- Audit logging: AuditLog table and logAudit helper to record auth events.

Official Better Auth SDK integration
- The project uses the official Better Auth SDK and its official Prisma adapter. After installing the SDK packages locally the application will rely on the SDK as the single source of truth for authentication.
- To enable the SDK, install the packages locally:
  - npm install better-auth @better-auth/prisma-adapter
- The SDK is initialized in lib/auth.ts using the Prisma adapter and the existing Prisma client. The codebase now delegates all auth flows (email/password sign-up & sign-in, sessions, refresh, email verification, password reset, and OAuth) to the official SDK APIs.
- Run the following locally after installing packages:
  - npx prisma generate
  - npx prisma migrate dev --name better-auth
  - npm run dev

This scaffold focuses on architecture, security, and a clear separation of concerns.
