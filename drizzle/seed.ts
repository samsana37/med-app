// Load environment variables before importing anything that uses env
import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
config({ path: resolve(process.cwd(), ".env") });

// Directly connect to database for seeding (bypass env validation)
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import {
  medicines,
  conditions,
  users,
  medications,
  medicationLogs,
  moodEntries,
  journalEntries,
  symptoms,
  vitalSigns,
  caregivers,
} from "~/server/db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env file");
}

const sql = postgres(process.env.DATABASE_URL);
const db = drizzle(sql, {
  schema: {
    medicines,
    conditions,
    users,
    medications,
    medicationLogs,
    moodEntries,
    journalEntries,
    symptoms,
    vitalSigns,
    caregivers,
  },
});

const medicineData = [
  {
    name: "Aspirin",
    uses: "Pain relief, fever reduction, anti-inflammatory. Used to prevent heart attacks and strokes.",
    sideEffects: "Stomach irritation, nausea, increased bleeding risk, allergic reactions",
  },
  {
    name: "Ibuprofen",
    uses: "Pain relief, fever reduction, anti-inflammatory. Used for headaches, muscle pain, arthritis.",
    sideEffects: "Stomach upset, dizziness, headache, increased risk of heart attack or stroke",
  },
  {
    name: "Acetaminophen (Tylenol)",
    uses: "Pain relief and fever reduction. Commonly used for headaches and minor aches.",
    sideEffects: "Liver damage if taken in excess, nausea, allergic reactions",
  },
  {
    name: "Metformin",
    uses: "Type 2 diabetes treatment. Helps control blood sugar levels.",
    sideEffects: "Nausea, diarrhea, stomach upset, lactic acidosis (rare)",
  },
  {
    name: "Lisinopril",
    uses: "High blood pressure, heart failure, heart attack recovery.",
    sideEffects: "Dizziness, dry cough, fatigue, kidney problems",
  },
  {
    name: "Atorvastatin (Lipitor)",
    uses: "Lowers cholesterol and reduces risk of heart disease.",
    sideEffects: "Muscle pain, liver problems, memory loss, increased blood sugar",
  },
  {
    name: "Levothyroxine (Synthroid)",
    uses: "Treats hypothyroidism (underactive thyroid).",
    sideEffects: "Hair loss, weight changes, heart palpitations, insomnia",
  },
  {
    name: "Amlodipine",
    uses: "High blood pressure and chest pain (angina).",
    sideEffects: "Swelling of legs/ankles, dizziness, flushing, headache",
  },
  {
    name: "Omeprazole (Prilosec)",
    uses: "Treats acid reflux, stomach ulcers, heartburn.",
    sideEffects: "Headache, diarrhea, stomach pain, vitamin B12 deficiency",
  },
  {
    name: "Albuterol",
    uses: "Asthma and COPD treatment. Opens airways for easier breathing.",
    sideEffects: "Shakiness, nervousness, rapid heartbeat, chest pain",
  },
  {
    name: "Amoxicillin",
    uses: "Antibiotic for bacterial infections like pneumonia, ear infections, strep throat.",
    sideEffects: "Diarrhea, nausea, rash, allergic reactions",
  },
  {
    name: "Gabapentin",
    uses: "Treats nerve pain, seizures, and restless legs syndrome.",
    sideEffects: "Dizziness, drowsiness, unsteady walking, memory problems",
  },
  {
    name: "Sertraline (Zoloft)",
    uses: "Depression, anxiety, panic disorder, OCD treatment.",
    sideEffects: "Nausea, insomnia, drowsiness, sexual dysfunction, weight changes",
  },
  {
    name: "Furosemide (Lasix)",
    uses: "Diuretic for high blood pressure and fluid retention.",
    sideEffects: "Frequent urination, dehydration, low potassium, dizziness",
  },
  {
    name: "Tramadol",
    uses: "Pain relief for moderate to severe pain.",
    sideEffects: "Dizziness, nausea, constipation, drowsiness, risk of addiction",
  },
  {
    name: "Metoprolol",
    uses: "High blood pressure, chest pain, heart failure, heart attack prevention.",
    sideEffects: "Tiredness, dizziness, slow heartbeat, cold hands/feet",
  },
  {
    name: "Pantoprazole",
    uses: "Acid reflux, stomach ulcers, Zollinger-Ellison syndrome.",
    sideEffects: "Headache, diarrhea, nausea, abdominal pain",
  },
  {
    name: "Montelukast (Singulair)",
    uses: "Asthma prevention and seasonal allergies.",
    sideEffects: "Headache, stomach pain, fatigue, mood changes",
  },
  {
    name: "Losartan",
    uses: "High blood pressure and kidney protection in diabetes.",
    sideEffects: "Dizziness, fatigue, low blood pressure, increased potassium",
  },
  {
    name: "Sitagliptin",
    uses: "Type 2 diabetes treatment. Helps lower blood sugar.",
    sideEffects: "Nausea, diarrhea, joint pain, upper respiratory infection",
  },
];

const conditionData = [
  {
    name: "Hypertension (High Blood Pressure)",
    symptoms: "Often no symptoms. May include headaches, shortness of breath, nosebleeds",
    description: "A condition where blood pressure is consistently elevated. Can lead to heart disease, stroke, and kidney problems.",
  },
  {
    name: "Type 2 Diabetes",
    symptoms: "Increased thirst, frequent urination, fatigue, blurred vision, slow healing wounds",
    description: "A chronic condition affecting how the body processes blood sugar. Requires lifestyle changes and medication management.",
  },
  {
    name: "Asthma",
    symptoms: "Shortness of breath, wheezing, chest tightness, coughing (especially at night)",
    description: "A chronic lung condition causing inflammation and narrowing of airways. Triggered by allergens, exercise, or irritants.",
  },
  {
    name: "Arthritis",
    symptoms: "Joint pain, stiffness, swelling, reduced range of motion, warmth around joints",
    description: "Inflammation of one or more joints. Common types include osteoarthritis and rheumatoid arthritis.",
  },
  {
    name: "Acid Reflux (GERD)",
    symptoms: "Heartburn, regurgitation, chest pain, difficulty swallowing, chronic cough",
    description: "Stomach acid flows back into the esophagus, causing irritation. Often triggered by certain foods or lying down after eating.",
  },
  {
    name: "Depression",
    symptoms: "Persistent sadness, loss of interest, fatigue, sleep disturbances, difficulty concentrating, thoughts of self-harm",
    description: "A mood disorder causing persistent feelings of sadness and loss of interest. Requires medical and psychological treatment.",
  },
  {
    name: "Anxiety Disorders",
    symptoms: "Excessive worry, restlessness, fatigue, difficulty concentrating, irritability, muscle tension, sleep problems",
    description: "Mental health conditions characterized by excessive fear and worry. Can interfere with daily activities.",
  },
  {
    name: "COPD (Chronic Obstructive Pulmonary Disease)",
    symptoms: "Shortness of breath, chronic cough, wheezing, chest tightness, frequent respiratory infections",
    description: "A group of lung diseases that block airflow. Primarily caused by smoking and long-term exposure to irritants.",
  },
  {
    name: "Heart Disease",
    symptoms: "Chest pain, shortness of breath, fatigue, irregular heartbeat, swelling in legs/feet",
    description: "Various conditions affecting the heart. Includes coronary artery disease, heart failure, and arrhythmias.",
  },
  {
    name: "Hypothyroidism",
    symptoms: "Fatigue, weight gain, cold intolerance, dry skin, hair loss, constipation, depression",
    description: "Underactive thyroid gland. Body doesn't produce enough thyroid hormone, slowing metabolism.",
  },
  {
    name: "Migraine",
    symptoms: "Severe headache (often one-sided), nausea, vomiting, sensitivity to light and sound, visual disturbances",
    description: "A neurological condition causing recurrent moderate to severe headaches. Can be triggered by various factors.",
  },
  {
    name: "Influenza (Flu)",
    symptoms: "Fever, chills, body aches, fatigue, cough, sore throat, runny nose, headache",
    description: "Viral respiratory infection. More severe than common cold. Can lead to complications, especially in high-risk groups.",
  },
  {
    name: "Common Cold",
    symptoms: "Runny or stuffy nose, sneezing, sore throat, cough, mild headache, slight body aches",
    description: "Viral infection of the upper respiratory tract. Usually mild and resolves within a week or two.",
  },
  {
    name: "Bronchitis",
    symptoms: "Persistent cough (with mucus), chest discomfort, fatigue, mild fever, shortness of breath",
    description: "Inflammation of the bronchial tubes. Can be acute (short-term) or chronic (long-term, often from smoking).",
  },
  {
    name: "Pneumonia",
    symptoms: "Cough with phlegm, fever, chills, difficulty breathing, chest pain, fatigue, confusion (in elderly)",
    description: "Infection that inflames air sacs in one or both lungs. Can be bacterial, viral, or fungal. Requires medical attention.",
  },
  {
    name: "Urinary Tract Infection (UTI)",
    symptoms: "Burning sensation when urinating, frequent urination, cloudy or bloody urine, pelvic pain",
    description: "Infection in any part of the urinary system. More common in women. Usually treated with antibiotics.",
  },
  {
    name: "Sinusitis",
    symptoms: "Facial pain/pressure, nasal congestion, thick nasal discharge, reduced sense of smell, cough",
    description: "Inflammation of the sinuses. Can be acute (short-term) or chronic (long-term). Often follows a cold or allergies.",
  },
  {
    name: "Gastritis",
    symptoms: "Upper abdominal pain, nausea, vomiting, bloating, loss of appetite, indigestion",
    description: "Inflammation of the stomach lining. Can be caused by infection, medications, or excessive alcohol consumption.",
  },
  {
    name: "Insomnia",
    symptoms: "Difficulty falling asleep, waking up frequently, waking too early, daytime fatigue, irritability",
    description: "Sleep disorder making it hard to fall or stay asleep. Can be acute or chronic. Often related to stress or medical conditions.",
  },
  {
    name: "Allergic Rhinitis (Hay Fever)",
    symptoms: "Sneezing, runny or stuffy nose, itchy eyes/nose/throat, watery eyes, coughing",
    description: "Allergic reaction to airborne allergens like pollen, dust mites, or pet dander. Can be seasonal or year-round.",
  },
];

// Demo user data
const demoUserData = {
  email: "demo@medalert.com",
  name: "John Doe",
  age: 35,
  bloodType: "O+",
  allergies: "Penicillin, Shellfish",
};

// Demo medications
const demoMedications = [
  {
    name: "Aspirin",
    dosage: "100mg",
    times: ["8:00 AM", "8:00 PM"],
    active: true,
  },
  {
    name: "Metformin",
    dosage: "500mg",
    times: ["7:00 AM", "7:00 PM"],
    active: true,
  },
  {
    name: "Lisinopril",
    dosage: "10mg",
    times: ["9:00 AM"],
    active: true,
  },
];

// Demo caregivers
const demoCaregivers = [
  {
    name: "Sarah Doe",
    relationship: "Spouse",
    phone: "+1 (555) 123-4567",
    email: "sarah.doe@example.com",
  },
  {
    name: "Dr. Michael Smith",
    relationship: "Primary Care Physician",
    phone: "+1 (555) 234-5678",
    email: "m.smith@healthclinic.com",
  },
  {
    name: "Emergency Contact",
    relationship: "Friend",
    phone: "+1 (555) 345-6789",
    email: "emergency@example.com",
  },
];

// Generate mood entries for last 30 days
function generateMoodEntries(userId: number) {
  const entries = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulate realistic mood patterns (better on weekends, some variation)
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseMood = isWeekend ? 4 : 3;
    const mood = Math.max(1, Math.min(5, baseMood + Math.floor(Math.random() * 3) - 1));
    
    entries.push({
      userId,
      mood,
      notes: i % 5 === 0 ? `Feeling ${mood >= 4 ? "good" : mood <= 2 ? "down" : "okay"} today` : null,
      entryDate: date.toISOString().split("T")[0],
    });
  }
  
  return entries;
}

// Generate journal entries
function generateJournalEntries(userId: number) {
  const titles = [
    "Weekly Reflection",
    "Feeling Grateful Today",
    "Health Check-in",
    "Mental Wellness Notes",
    "Daily Thoughts",
    "Progress Update",
    "Weekend Recap",
  ];
  
  const contents = [
    "This week has been pretty good overall. I've been consistent with my medications and feeling better.",
    "Today I'm grateful for my health, family, and the ability to manage my conditions effectively.",
    "Regular check-in: mood is stable, symptoms are manageable. Need to continue following my medication schedule.",
    "Mental health is just as important as physical health. Taking time for self-care makes a huge difference.",
    "Had a good day today. Managed to stay on top of all my medications and felt energetic.",
    "Noticed improvement in my overall well-being since starting to track everything in this app.",
    "Weekend was relaxing. Used the time to catch up on rest and take care of myself.",
  ];
  
  const entries = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i * 3); // Spread entries over 3 weeks
    
    entries.push({
      userId,
      title: titles[i] ?? `Entry ${i + 1}`,
      content: contents[i] ?? "This is a sample journal entry.",
      entryDate: date.toISOString().split("T")[0],
    });
  }
  
  return entries;
}

// Generate symptoms
function generateSymptoms(userId: number) {
  const symptomNames = [
    "Headache",
    "Fatigue",
    "Joint Pain",
    "Dizziness",
    "Nausea",
    "Chest Tightness",
    "Shortness of Breath",
    "Mild Fever",
    "Muscle Aches",
  ];
  
  const severities: Array<"Mild" | "Moderate" | "Severe"> = ["Mild", "Moderate", "Severe"];
  
  const entries = [];
  const today = new Date();
  
  // Add symptoms over the last 2 weeks
  for (let i = 0; i < 8; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i * 2);
    
    const symptomName = symptomNames[Math.floor(Math.random() * symptomNames.length)]!;
    const severity = severities[Math.floor(Math.random() * severities.length)]!;
    
    entries.push({
      userId,
      name: symptomName,
      severity,
      notes: severity === "Severe" ? "Worth monitoring closely" : severity === "Moderate" ? "Manageable but noticeable" : "Mild discomfort",
      symptomDate: date.toISOString().split("T")[0],
    });
  }
  
  return entries;
}

// Generate vital signs
function generateVitalSigns(userId: number) {
  const entries = [];
  const today = new Date();
  
  // Blood pressure readings (normal range: 90-120/60-80)
  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i * 2);
    date.setHours(8 + Math.floor(Math.random() * 12)); // Random time during day
    
    const systolic = 110 + Math.floor(Math.random() * 15);
    const diastolic = 70 + Math.floor(Math.random() * 10);
    
    entries.push({
      userId,
      type: "blood_pressure",
      value: `${systolic}/${diastolic}`,
      recordedAt: date,
    });
  }
  
  // Heart rate readings (normal: 60-100 bpm)
  for (let i = 0; i < 8; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i * 2.5);
    date.setHours(8 + Math.floor(Math.random() * 12));
    
    const heartRate = 65 + Math.floor(Math.random() * 25);
    
    entries.push({
      userId,
      type: "heart_rate",
      value: `${heartRate} bpm`,
      recordedAt: date,
    });
  }
  
  // Temperature readings (normal: 98.6°F)
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i * 3);
    date.setHours(8 + Math.floor(Math.random() * 12));
    
    const temp = 97.5 + Math.random() * 1.5;
    
    entries.push({
      userId,
      type: "temperature",
      value: `${temp.toFixed(1)}°F`,
      recordedAt: date,
    });
  }
  
  // Weight readings
  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i * 5);
    date.setHours(8);
    
    const weight = 165 + Math.random() * 10; // Fluctuating around 170 lbs
    
    entries.push({
      userId,
      type: "weight",
      value: `${weight.toFixed(1)} lbs`,
      recordedAt: date,
    });
  }
  
  return entries;
}

// Generate medication logs
function generateMedicationLogs(userId: number, medicationIds: number[]): Array<{ medicationId: number; userId: number; takenAt: Date }> {
  const logs: Array<{ medicationId: number; userId: number; takenAt: Date }> = [];
  const today = new Date();
  
  // Log medications taken over the last 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Each medication might have been taken multiple times
    medicationIds.forEach((medId) => {
      // 80% chance of taking medication each day
      if (Math.random() > 0.2) {
        const takenAt = new Date(date);
        takenAt.setHours(8 + Math.floor(Math.random() * 12)); // Random time during day
        
        logs.push({
          medicationId: medId,
          userId,
          takenAt,
        });
      }
    });
  }
  
  return logs;
}

export async function seed() {
  console.log("🌱 Starting database seed...");

  // Seed medicines
  console.log("📦 Seeding medicines...");
  await db.insert(medicines).values(medicineData).onConflictDoNothing();
  console.log(`✅ Seeded ${medicineData.length} medicines`);

  // Seed conditions
  console.log("📋 Seeding conditions...");
  await db.insert(conditions).values(conditionData).onConflictDoNothing();
  console.log(`✅ Seeded ${conditionData.length} conditions`);

  // Check if demo user exists, create if not
  console.log("👤 Creating demo user...");
  const allUsers = await db.query.users.findMany();
  const existingUser = allUsers.find((u) => u.email === demoUserData.email);

  let userId: number;
  if (existingUser) {
    userId = existingUser.id;
    console.log(`✅ Demo user already exists (ID: ${userId})`);
    
    // Update user with demo data
    await db
      .update(users)
      .set(demoUserData)
      .where(eq(users.id, userId));
    console.log("✅ Updated demo user profile");
  } else {
    const [newUser] = await db.insert(users).values(demoUserData).returning();
    userId = newUser!.id;
    console.log(`✅ Created demo user (ID: ${userId})`);
  }

  // Seed caregivers
  console.log("👥 Seeding caregivers...");
  const existingCaregivers = await db.query.caregivers.findMany({
    where: (caregivers, { eq }) => eq(caregivers.userId, userId),
  });

  if (existingCaregivers.length === 0) {
    const caregiverInserts = demoCaregivers.map((caregiver) => ({
      ...caregiver,
      userId,
    }));
    await db.insert(caregivers).values(caregiverInserts);
    console.log(`✅ Seeded ${demoCaregivers.length} caregivers`);
  } else {
    console.log(`✅ Caregivers already exist (${existingCaregivers.length})`);
  }

  // Seed medications
  console.log("💊 Seeding medications...");
  const allMedications = await db.query.medications.findMany();
  const existingMedications = allMedications.filter((m) => m.userId === userId);

  let medicationIds: number[];
  if (existingMedications.length === 0) {
    const medicationInserts = demoMedications.map((med) => ({
      ...med,
      userId,
    }));
    const inserted = await db.insert(medications).values(medicationInserts).returning();
    medicationIds = inserted.map((m) => m.id);
    console.log(`✅ Seeded ${demoMedications.length} medications`);
  } else {
    medicationIds = existingMedications.map((m) => m.id);
    console.log(`✅ Medications already exist (${existingMedications.length})`);
  }

  // Seed medication logs
  console.log("📝 Seeding medication logs...");
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const allLogs = await db.query.medicationLogs.findMany();
  const existingLogs = allLogs.filter(
    (log) => log.userId === userId && new Date(log.takenAt) >= sevenDaysAgo
  );

  if (existingLogs.length === 0) {
    const logs = generateMedicationLogs(userId, medicationIds);
    await db.insert(medicationLogs).values(logs);
    console.log(`✅ Seeded ${logs.length} medication logs`);
  } else {
    console.log(`✅ Medication logs already exist (${existingLogs.length})`);
  }

  // Seed mood entries
  console.log("😊 Seeding mood entries...");
  const allMoods = await db.query.moodEntries.findMany();
  const existingMoods = allMoods.filter((m) => m.userId === userId);

  if (existingMoods.length === 0) {
    const moodData = generateMoodEntries(userId);
    await db.insert(moodEntries).values(moodData);
    console.log(`✅ Seeded ${moodData.length} mood entries`);
  } else {
    console.log(`✅ Mood entries already exist (${existingMoods.length})`);
  }

  // Seed journal entries
  console.log("📔 Seeding journal entries...");
  const allJournals = await db.query.journalEntries.findMany();
  const existingJournals = allJournals.filter((j) => j.userId === userId);

  if (existingJournals.length === 0) {
    const journalData = generateJournalEntries(userId);
    await db.insert(journalEntries).values(journalData);
    console.log(`✅ Seeded ${journalData.length} journal entries`);
  } else {
    console.log(`✅ Journal entries already exist (${existingJournals.length})`);
  }

  // Seed symptoms
  console.log("🤒 Seeding symptoms...");
  const allSymptoms = await db.query.symptoms.findMany();
  const existingSymptoms = allSymptoms.filter((s) => s.userId === userId);

  if (existingSymptoms.length === 0) {
    const symptomData = generateSymptoms(userId);
    await db.insert(symptoms).values(symptomData);
    console.log(`✅ Seeded ${symptomData.length} symptoms`);
  } else {
    console.log(`✅ Symptoms already exist (${existingSymptoms.length})`);
  }

  // Seed vital signs
  console.log("💓 Seeding vital signs...");
  const allVitals = await db.query.vitalSigns.findMany();
  const existingVitals = allVitals.filter((v) => v.userId === userId);

  if (existingVitals.length === 0) {
    const vitalData = generateVitalSigns(userId);
    await db.insert(vitalSigns).values(vitalData);
    console.log(`✅ Seeded ${vitalData.length} vital signs`);
  } else {
    console.log(`✅ Vital signs already exist (${existingVitals.length})`);
  }

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - User: ${demoUserData.email}`);
  console.log(`   - Medications: ${demoMedications.length}`);
  console.log(`   - Caregivers: ${demoCaregivers.length}`);
  console.log(`   - Mood entries: 30 days`);
  console.log(`   - Journal entries: 7 entries`);
  console.log(`   - Symptoms: 8 entries`);
  console.log(`   - Vital signs: ~30 entries`);
  console.log(`   - Medication logs: Multiple entries`);
}

// Run seed if this file is executed directly
seed()
  .then(() => {
    console.log("Seeding finished");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(() => {
    sql.end();
  });

