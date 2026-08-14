# Horizon International School — Premium Website

A full-stack, premium marketing website for a K-12 international school, featuring an **interactive 3D campus model** built with React Three Fiber, a Postgres-backed programs/events system, and a working admissions inquiry form.

## Highlights

- **3D interactive campus** — a procedurally-built campus (buildings, trees, pathways) rendered with Three.js / React Three Fiber, fully orbit-controllable, with reduced-motion support for accessibility
- **Dynamic content, not hardcoded** — learning stages (Early Years → Senior School) and upcoming campus events are stored in Postgres via Drizzle ORM and rendered server-side
- **Working admissions pipeline** — a validated `/api/inquiries` endpoint that stores parent/guardian enquiries directly in the database
- **Smooth, accessible animations** — Framer Motion throughout, with `useReducedMotion` respected for users who prefer minimal motion
- **Type-safe end to end** — TypeScript + Drizzle-inferred types from schema to UI, zero `any`

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| UI | React, TypeScript, Tailwind CSS v4 |
| 3D Graphics | Three.js, @react-three/fiber, @react-three/drei |
| Animation | Framer Motion |
| Database | PostgreSQL |
| ORM | Drizzle ORM + drizzle-kit |
| Icons | Lucide React |

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Server component: fetches/seeds programs + events
│   │   ├── layout.tsx                  # Root layout, SEO metadata
│   │   ├── globals.css                 # Design system (colors, type scale, components)
│   │   ├── api/
│   │   │   ├── health/route.ts         # DB health check
│   │   │   └── inquiries/route.ts      # Admissions form submission endpoint
│   │   └── components/
│   │       ├── SchoolExperience.tsx    # Main page UI: hero, programs, events, admissions form
│   │       └── CampusModel.tsx         # Interactive 3D campus (React Three Fiber)
│   └── db/
│       ├── index.ts                    # Postgres connection (Drizzle)
│       └── schema.ts                   # programs / campusEvents / admissionInquiries tables
├── drizzle.config.json
└── .env.example
```

## Getting Started

### Prerequisites
- Node.js 20+
- A PostgreSQL database (local via Docker, or a free hosted instance — Neon, Supabase, or Railway all work)

### Setup

```bash
git clone https://github.com/<your-username>/horizon-school-website.git
cd horizon-school-website
npm install
cp .env.example .env
# edit .env with your DATABASE_URL
npx drizzle-kit push     # creates the tables
npm run dev
```

Open `http://localhost:3000`.

## Database Schema

Three tables, defined in `src/db/schema.ts`:

- **`programs`** — the six learning stages shown on the homepage (Early Years through Senior School, plus STEAM and Arts/Sport/Leadership), each with a slug, title, description, and duration
- **`campus_events`** — upcoming open days, parent evenings, and showcases
- **`admission_inquiries`** — parent/guardian submissions from the admissions form (name, email, phone, entry stage, message)

On first request, `page.tsx` upserts seed data for programs and events (`onConflictDoUpdate` on slug), so the site is fully populated the moment the database is connected — no manual seeding step required.

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Checks the database connection is alive |
| POST | `/api/inquiries` | Submits an admissions enquiry — validates name, email, and entry stage before inserting |

## Notes on This Build

This project was originally generated from a template and repurposed into a school marketing site. During review, a few leftover inconsistencies from that process were cleaned up:

- The main UI component was still named `CollegeExperience.tsx` despite the content being a K-12 school — renamed to `SchoolExperience.tsx`
- Seed data slugs (e.g. `computer-science-ai`, `business-innovation`) didn't match their actual K-12 content (Early Years, Primary School, etc.) — corrected to consistent, descriptive slugs
- An internal DB pool variable still referenced the original generator tool's name — renamed to be project-specific

TypeScript and ESLint both run clean after these fixes.

## License

MIT
