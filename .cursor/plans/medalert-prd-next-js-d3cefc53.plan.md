<!-- d3cefc53-9ed4-4b0e-a904-5d840b2319f9 75c3b0c9-684e-46ab-aa83-78431abff44a -->
# MedAlert - Product Requirements Document (College POC)

## 1. Executive Summary

**Product Name:** MedAlert

**Project Type:** College Proof of Concept

**Platform:** Web Application (Next.js with T3 Stack)

**Target Audience:** Individual patients managing their own health

**Scope:** Simplified, feature-rich POC demonstrating core healthcare management capabilities without enterprise complexity

---

## 2. Technical Stack (Simplified)

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Vercel Postgres free tier)
- **ORM:** Drizzle ORM
- **API:** tRPC
- **Styling:** Tailwind CSS + shadcn/ui components
- **Auth:** Frontend-only string equality check (no backend auth)
- **Validation:** Zod schemas
- **Deployment:** Vercel (free tier)

### Simplified Decisions

- **No file uploads** - avoid storage complexity/costs
- **Browser notifications only** - no SMS/email infrastructure
- **No password reset** - keep auth simple for POC
- **No backend authentication** - frontend string equality check only
- **Seeded database** - pre-populate medicine/disease data
- **No email verification** - streamline onboarding

---

## 3. Core Features (MVP)

### 3.1 Authentication

- Simple frontend login with email/password (string equality check only)
- No backend authentication - purely client-side validation for POC
- Login state stored in localStorage/sessionStorage
- Logout clears session
- Simple profile: name, age, blood type, allergies (text only)

### 3.2 Emergency Alert System

- Add up to 3 emergency contacts (name, relationship, phone, email)
- Prominent red "Emergency Alert" button on dashboard
- Click shows modal with all caregiver info + user's critical health data
- Copy-to-clipboard functionality (no actual sending)
- Log when emergency button is clicked

### 3.3 Mental Health & Wellness

- Daily mood entry: 5 emoji scale (😢 😟 😐 🙂 😊) + optional note
- Simple journal: title + text content (basic textarea)
- Calendar view showing 30-day mood history with color coding
- Line chart showing mood trends

### 3.4 Medicine Reminders

- Add medication: name, dosage, times per day (e.g., "8:00 AM, 8:00 PM")
- Browser notifications at scheduled times (Web Notifications API)
- Today's medication checklist with "Mark as Taken" button
- Medication history log

### 3.5 Symptom Tracker

- Log symptoms: name, severity (Mild/Moderate/Severe), date, notes
- List view of all symptoms with date filter
- Simple timeline view

### 3.6 Digital Health Records (Text-Only)

- Health profile: height, weight, blood type, allergies, conditions
- Vital signs log: blood pressure, heart rate, temperature, weight
- Table view of vital signs history with dates

### 3.7 Diseases & Medicines Database

- Pre-seeded ~20 common medicines (name, uses, side effects)
- Pre-seeded ~20 common conditions (name, symptoms, description)
- Simple search functionality
- No admin interface - data via migration seed

---

## 4. Database Schema (Minimal)

**Core Tables:**

- `users` - id, email, name, age, blood_type, allergies, created_at (password not stored - frontend auth only)
- `caregivers` - id, user_id, name, relationship, phone, email
- `emergency_alerts` - id, user_id, triggered_at
- `mood_entries` - id, user_id, mood (1-5), notes, entry_date
- `journal_entries` - id, user_id, title, content, entry_date
- `medications` - id, user_id, name, dosage, times (JSON), active
- `medication_logs` - id, medication_id, user_id, taken_at
- `symptoms` - id, user_id, name, severity, notes, symptom_date
- `vital_signs` - id, user_id, type, value, recorded_at
- `medicines` - id, name, uses, side_effects (seeded)
- `conditions` - id, name, symptoms, description (seeded)

---

## 5. Pages & Routes

### Public Routes

- `/` - Landing page (hero + features overview)
- `/auth/signin` - Login (frontend string equality check)

### Protected Routes

- `/dashboard` - Overview with stats and emergency button
- `/medications` - Medication list + add form + today's checklist
- `/mood` - Mood tracker + journal entries
- `/symptoms` - Symptom log + add form
- `/health` - Health profile + vital signs log
- `/database` - Medicine/condition search (tabs)
- `/caregivers` - Emergency contact management
- `/profile` - Edit profile

### Dashboard Components

- Emergency alert button (prominent red)
- Today's medication checklist
- Quick mood entry
- Recent symptoms count
- Quick stats cards

---

## 6. UI/UX Approach

- **Component Library:** shadcn/ui (pre-built, accessible, professional)
- **Design:** Clean, minimal, mobile-first responsive
- **Colors:** Blue primary, red for emergency, green for success
- **Forms:** Simple with Zod validation
- **Feedback:** Toast notifications for actions

---

## 7. Notifications (Simplified)

- Browser Web Notifications API for medication reminders
- Request permission on first login
- Client-side check every minute for scheduled meds
- In-app toast notifications as backup

---

## 8. Development Timeline

**Week 1: Foundation**

- T3 Stack setup (Next.js, Drizzle, tRPC)
- Database schema + migrations
- Simple frontend authentication (string equality check)
- Basic layout + navigation

**Week 2: Core Features**

- Medications + browser reminders
- Emergency contacts + alert button
- Profile + dashboard

**Week 3: Health Tracking**

- Mood tracker + journal
- Symptom tracker
- Vital signs logging

**Week 4: Database & Polish**

- Seed medicine/condition data
- Search functionality
- UI polish with shadcn/ui
- Testing + Vercel deployment

---

## 9. Out of Scope (POC)

❌ SMS/Email notifications
❌ File uploads for documents
❌ Password reset flow
❌ Advanced charts/analytics
❌ Mobile app
❌ Drug interaction checking
❌ PDF exports
❌ Multi-language support
❌ HIPAA compliance (demo disclaimer required)

---

## 10. Success Criteria

✅ Users can login with frontend authentication
✅ Users can add medications and receive browser reminders
✅ Users can add 3 emergency contacts and trigger alert
✅ Users can track daily mood and journal
✅ Users can log symptoms and vital signs
✅ Users can search medicine/condition database
✅ Dashboard shows feature overview
✅ Responsive design works on mobile
✅ Deployed live on Vercel

---

## 11. Demo Flow (Presentation)

1. Login with demo credentials (frontend check)
2. Add profile info (blood type, allergies)
3. Add 3 emergency contacts
4. Click emergency alert button
5. Add 2 medications, show checklist
6. Log mood, view calendar
7. Log symptom, view history
8. Log vital signs
9. Search medicine database
10. Show dashboard overview

---

## 12. Tech Decisions

✅ PostgreSQL via Vercel Postgres (free tier)
✅ No file storage - text-only POC
✅ Browser notifications only (Web API)
✅ shadcn/ui for professional UI quickly
✅ Vercel deployment (one-click)
✅ Frontend-only authentication (string equality check for POC simplicity)

---

## Key Files to Create

- `src/server/db/schema.ts` - Drizzle schema
- `src/server/api/routers/*.ts` - tRPC routes (medications, mood, symptoms, etc.)
- `src/app/(auth)/*` - Auth pages
- `src/app/(dashboard)/*` - Protected app pages
- `src/components/ui/*` - shadcn/ui components
- `src/lib/notifications.ts` - Browser notification logic
- `drizzle/seed.ts` - Seed medicine/condition data

### To-dos

- [ ] Initialize T3 Stack project with Next.js, TypeScript, tRPC, Drizzle ORM, and Tailwind CSS
- [ ] Design and implement complete database schema with Drizzle ORM migrations
- [ ] Implement frontend-only authentication with string equality check and localStorage session
- [ ] Build main layout, navigation, and reusable UI components with Tailwind CSS
- [ ] Implement medication management, reminders, and adherence tracking
- [ ] Build caregiver management and emergency alert system with notifications
- [ ] Create mood tracking, journaling interface, and wellness resources
- [ ] Implement symptom logging, timeline view, and analysis charts
- [ ] Build vital signs tracking, document upload, and health summary dashboard
- [ ] Create medicine and disease database with search functionality and admin interface
- [ ] Implement web push notifications and email notification system
- [ ] Perform security audit, testing, optimization, and deploy to production