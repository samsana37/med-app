"use client";

import { useEffect, useRef } from "react";
import { getCurrentUser } from "~/lib/auth";
import { api } from "~/trpc/react";
import { startMedicationReminders, type MedicationReminder } from "~/lib/notifications";

export function MedicationNotifications() {
  const user = getCurrentUser();
  const userId = user?.id ?? 1;

  const { data: medications } = api.medication.getActive.useQuery({ userId });
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!medications) return;

    // Convert medications to reminder format
    const reminders: MedicationReminder[] = medications
      .filter((med) => med.active && med.times && Array.isArray(med.times) && med.times.length > 0)
      .map((med) => ({
        id: med.id,
        name: med.name,
        dosage: med.dosage ?? undefined,
        times: Array.isArray(med.times) ? med.times : [],
      }));

    // Clean up previous interval
    if (cleanupRef.current) {
      cleanupRef.current();
    }

    // Start new reminder checker
    const getMedications = () => reminders;
    cleanupRef.current = startMedicationReminders(getMedications);

    // Cleanup on unmount
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [medications]);

  // Request permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(console.error);
      }
    }
  }, []);

  return null; // This component doesn't render anything
}

