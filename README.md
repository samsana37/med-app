# MedAlert - Health Management System

A comprehensive health management application built with Next.js, TypeScript, and the T3 Stack. This is a proof of concept for a college project.

## Features

- **Authentication**: Frontend-only authentication with localStorage session management
- **Medication Management**: Add medications, set reminder times, track adherence
- **Emergency Alerts**: Manage up to 3 emergency contacts, trigger alerts with critical health info
- **Mood Tracking**: 5-level mood scale, 30-day calendar view, trend line chart, journal entries
- **Symptom Tracker**: Log symptoms with severity levels, timeline and list views
- **Health Records**: Track vital signs (blood pressure, heart rate, temperature, weight)
- **Medicine Database**: Searchable database of 20+ common medicines and conditions
- **Browser Notifications**: Medication reminders via Web Notifications API

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Vercel Postgres)
- **ORM**: Drizzle ORM
- **API**: tRPC
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database (or Vercel Postgres free tier)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd med-app
```

2. Install dependencies
```bash
bun install
# or
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your `DATABASE_URL`:
```
DATABASE_URL="postgresql://user:password@host:port/database"
```

4. Run database migrations
```bash
bun run db:push
```

5. Seed the database (optional)
```bash
bun run db:seed
```

6. Start the development server
```bash
bun run dev
# or
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Credentials

- **Email**: `demo@medalert.com`
- **Password**: `demo123`

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run typecheck` - Type check TypeScript
- `bun run lint` - Run ESLint
- `bun run db:push` - Push schema changes to database
- `bun run db:generate` - Generate migration files
- `bun run db:seed` - Seed database with sample data
- `bun run db:studio` - Open Drizzle Studio

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Public auth routes
│   ├── (dashboard)/       # Protected dashboard routes
│   └── api/               # API routes (tRPC)
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utility functions
├── server/               # Server-side code
│   ├── api/             # tRPC routers
│   └── db/              # Database configuration
└── styles/              # Global styles
```

## Database Schema

- `users` - User profiles
- `caregivers` - Emergency contacts
- `emergency_alerts` - Alert history
- `mood_entries` - Mood tracking data
- `journal_entries` - Journal entries
- `medications` - User medications
- `medication_logs` - Medication adherence logs
- `symptoms` - Symptom logs
- `vital_signs` - Health metrics
- `medicines` - Seeded medicine database
- `conditions` - Seeded condition database

## Security Note

⚠️ **This is a proof of concept for demonstration purposes only.**

- Frontend-only authentication (not secure for production)
- No backend authentication validation
- Not HIPAA compliant
- Do not use for actual medical data

## Deployment

This project can be deployed to Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your `DATABASE_URL` environment variable
4. Deploy

## License

This project is for educational purposes only.

## Contributing

This is a college POC project. Contributions are not expected, but feedback is welcome!
