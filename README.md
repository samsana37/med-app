# MedAlert - Health Management System

A web application for managing medications, tracking health metrics, and organizing medical information. Built with Next.js and TypeScript for a college proof of concept project.

## Quick Start

### 1. Install Dependencies

```bash
bun install
# or: npm install
```

### 2. Set Up Database

Create a `.env` file in the root directory:

```env
DATABASE_URL="your_postgresql_connection_string"
```

### 3. Set Up Database Tables

```bash
bun run db:push
```

### 4. Add Sample Data (Recommended)

```bash
bun run db:seed
```

This populates the database with:
- Demo user account
- Sample medications, mood entries, symptoms, and vital signs
- Medicine and condition database (20+ entries each)

### 5. Start Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Login

- **Email**: `demo@medalert.com`
- **Password**: `demo123`

## What You'll See

After logging in, you'll have access to:

- 📊 **Dashboard** - Overview with live stats and quick actions
- 💊 **Medications** - Manage medications with reminders
- 😊 **Mood Tracker** - Daily mood entries with calendar and trends
- 🤒 **Symptoms** - Log and track symptoms over time
- 💓 **Health Records** - Record vital signs (BP, heart rate, temperature, weight)
- 👥 **Emergency Contacts** - Manage up to 3 emergency contacts
- 🔍 **Database** - Search medicines and conditions
- 📝 **Journal** - Personal journal entries

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Database (via Drizzle ORM)
- **tRPC** - Type-safe API
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components

## Key Features

- ✅ Real-time data updates (auto-refresh every 30-60 seconds)
- ✅ Medication reminders with browser notifications
- ✅ Emergency alert system with critical health info
- ✅ 30-day mood calendar with trend charts
- ✅ Comprehensive symptom and vital signs tracking
- ✅ Searchable medicine/condition database

## Important Notes

⚠️ **This is a proof of concept demo project.**

- Frontend-only authentication (not production-ready)
- **Not HIPAA compliant** - Do not use for real medical data
- Designed for educational/demonstration purposes only

## Available Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run db:push` | Apply database schema changes |
| `bun run db:seed` | Add sample data to database |
| `bun run typecheck` | Check TypeScript errors |

## Need Help?

1. **Database connection issues?** Make sure your `DATABASE_URL` is correct in `.env`
2. **Can't login?** Use the demo credentials: `demo@medalert.com` / `demo123`
3. **No data showing?** Run `bun run db:seed` to populate the database

## Project Structure

```
src/
├── app/              # Pages and routes
├── components/       # React components
├── lib/             # Utilities (auth, notifications)
└── server/          # API routes and database
```

---

**Built for educational purposes** | College POC Project
