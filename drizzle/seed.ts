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
import { medicines, conditions } from "~/server/db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env file");
}

const sql = postgres(process.env.DATABASE_URL);
const db = drizzle(sql, { schema: { medicines, conditions } });

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

export async function seed() {
  console.log("Seeding medicines...");
  await db.insert(medicines).values(medicineData).onConflictDoNothing();
  console.log(`Seeded ${medicineData.length} medicines`);

  console.log("Seeding conditions...");
  await db.insert(conditions).values(conditionData).onConflictDoNothing();
  console.log(`Seeded ${conditionData.length} conditions`);

  console.log("Seed completed!");
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

