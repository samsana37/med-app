// Database schema for MedAlert
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * Multi-project schema feature of Drizzle ORM.
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `med-app_${name}`);

// Users table - password not stored (frontend auth only)
export const users = createTable(
  "user",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    email: d.varchar({ length: 255 }).notNull().unique(),
    name: d.varchar({ length: 255 }),
    age: d.integer(),
    bloodType: d.varchar({ length: 10 }),
    allergies: d.text(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [index("user_email_idx").on(t.email)],
);

// Caregivers (Emergency contacts)
export const caregivers = createTable(
  "caregiver",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d.integer().notNull().references(() => users.id, { onDelete: "cascade" }),
    name: d.varchar({ length: 255 }).notNull(),
    relationship: d.varchar({ length: 100 }),
    phone: d.varchar({ length: 50 }),
    email: d.varchar({ length: 255 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [index("caregiver_user_id_idx").on(t.userId)],
);

// Emergency alerts log
export const emergencyAlerts = createTable(
  "emergency_alert",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d.integer().notNull().references(() => users.id, { onDelete: "cascade" }),
    triggeredAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("emergency_alert_user_id_idx").on(t.userId),
    index("emergency_alert_triggered_at_idx").on(t.triggeredAt),
  ],
);

// Mood entries (1-5 scale)
export const moodEntries = createTable(
  "mood_entry",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d.integer().notNull().references(() => users.id, { onDelete: "cascade" }),
    mood: d.integer().notNull(), // 1-5 scale
    notes: d.text(),
    entryDate: d.date().notNull().default(sql`CURRENT_DATE`),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("mood_entry_user_id_idx").on(t.userId),
    index("mood_entry_date_idx").on(t.entryDate),
  ],
);

// Journal entries
export const journalEntries = createTable(
  "journal_entry",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d.integer().notNull().references(() => users.id, { onDelete: "cascade" }),
    title: d.varchar({ length: 255 }).notNull(),
    content: d.text().notNull(),
    entryDate: d.date().notNull().default(sql`CURRENT_DATE`),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("journal_entry_user_id_idx").on(t.userId),
    index("journal_entry_date_idx").on(t.entryDate),
  ],
);

// Medications
export const medications = createTable(
  "medication",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d.integer().notNull().references(() => users.id, { onDelete: "cascade" }),
    name: d.varchar({ length: 255 }).notNull(),
    dosage: d.varchar({ length: 100 }),
    times: d.jsonb().$type<string[]>(), // Array of time strings like ["8:00 AM", "8:00 PM"]
    active: d.boolean().notNull().default(true),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [index("medication_user_id_idx").on(t.userId)],
);

// Medication logs (when taken)
export const medicationLogs = createTable(
  "medication_log",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    medicationId: d.integer().notNull().references(() => medications.id, { onDelete: "cascade" }),
    userId: d.integer().notNull().references(() => users.id, { onDelete: "cascade" }),
    takenAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("medication_log_medication_id_idx").on(t.medicationId),
    index("medication_log_user_id_idx").on(t.userId),
    index("medication_log_taken_at_idx").on(t.takenAt),
  ],
);

// Symptoms
export const symptoms = createTable(
  "symptom",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d.integer().notNull().references(() => users.id, { onDelete: "cascade" }),
    name: d.varchar({ length: 255 }).notNull(),
    severity: d.varchar({ length: 50 }).notNull(), // Mild, Moderate, Severe
    notes: d.text(),
    symptomDate: d.date().notNull().default(sql`CURRENT_DATE`),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("symptom_user_id_idx").on(t.userId),
    index("symptom_date_idx").on(t.symptomDate),
  ],
);

// Vital signs
export const vitalSigns = createTable(
  "vital_sign",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d.integer().notNull().references(() => users.id, { onDelete: "cascade" }),
    type: d.varchar({ length: 100 }).notNull(), // e.g., "blood_pressure", "heart_rate", "temperature", "weight"
    value: d.varchar({ length: 255 }).notNull(), // Store as string for flexibility (e.g., "120/80", "72 bpm")
    recordedAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("vital_sign_user_id_idx").on(t.userId),
    index("vital_sign_recorded_at_idx").on(t.recordedAt),
  ],
);

// Medicines database (seeded)
export const medicines = createTable(
  "medicine",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 255 }).notNull(),
    uses: d.text(),
    sideEffects: d.text(),
  }),
  (t) => [index("medicine_name_idx").on(t.name)],
);

// Conditions database (seeded)
export const conditions = createTable(
  "condition",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 255 }).notNull(),
    symptoms: d.text(),
    description: d.text(),
  }),
  (t) => [index("condition_name_idx").on(t.name)],
);
