"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "~/lib/auth";
import { api } from "~/trpc/react";

interface LiveStatsProps {
  interval?: number; // milliseconds
}

export function LiveStats({ interval = 30000 }: LiveStatsProps) {
  const user = getCurrentUser();
  const userId = user?.id ?? 1;
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Real-time data queries
  const { data: medications } = api.medication.getActive.useQuery(
    { userId },
    { refetchInterval: interval }
  );
  const { data: symptoms } = api.symptom.getAll.useQuery(
    { userId },
    { refetchInterval: interval }
  );
  const { data: moodEntries } = api.mood.getAll.useQuery(
    { userId },
    { refetchInterval: interval }
  );
  const { data: caregivers } = api.caregiver.getAll.useQuery(
    { userId },
    { refetchInterval: interval }
  );

  // Update timestamp when data refreshes
  useEffect(() => {
    if (medications || symptoms || moodEntries || caregivers) {
      setLastUpdate(new Date());
    }
  }, [medications, symptoms, moodEntries, caregivers]);

  // Calculate recent symptoms (last 7 days)
  const recentSymptoms = symptoms?.filter((s) => {
    const symptomDate = new Date(s.symptomDate);
    const daysAgo = (Date.now() - symptomDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 7;
  }).length ?? 0;

  // Calculate monthly moods
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyMoods = moodEntries?.filter((m) => {
    if (!m.entryDate) return false;
    const entryDate = new Date(m.entryDate);
    return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
  }).length ?? 0;

  // Calculate today's pending medications
  const todayMedications = medications?.filter((med) => med.active) ?? [];

  return {
    medications: todayMedications.length,
    symptoms: recentSymptoms,
    moods: monthlyMoods,
    caregivers: caregivers?.length ?? 0,
    lastUpdate,
  };
}

