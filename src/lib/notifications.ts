/**
 * Browser notification system for medication reminders
 */

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

export function showNotification(
  title: string,
  options?: NotificationOptions,
): Notification | null {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return null;
  }

  return new Notification(title, {
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    ...options,
  });
}

export interface MedicationReminder {
  id: number;
  name: string;
  dosage?: string;
  times: string[];
}

/**
 * Parse time string (e.g., "8:00 AM") to hour and minute
 */
function parseTime(timeStr: string): { hour: number; minute: number } | null {
  const regex = /(\d+):(\d+)\s*(AM|PM)/i;
  const match = regex.exec(timeStr);
  if (!match) return null;

  let hour = parseInt(match[1]!, 10);
  const minute = parseInt(match[2]!, 10);
  const period = match[3]!.toUpperCase();

  if (period === "PM" && hour !== 12) {
    hour += 12;
  } else if (period === "AM" && hour === 12) {
    hour = 0;
  }

  return { hour, minute };
}

/**
 * Check if current time matches any medication reminder time
 */
function shouldNotify(medication: MedicationReminder): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  return medication.times.some((time) => {
    const parsed = parseTime(time);
    if (!parsed) return false;

    // Check if time is within the current minute (remind once per scheduled time)
    return parsed.hour === currentHour && parsed.minute === currentMinute;
  });
}

/**
 * Check medications and send notifications
 */
export async function checkMedicationReminders(
  medications: MedicationReminder[],
): Promise<void> {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    console.log("Notification permission not granted");
    return;
  }

  const activeMedications = medications.filter((med) => med.times && med.times.length > 0);

  for (const medication of activeMedications) {
    if (shouldNotify(medication)) {
      const message = medication.dosage
        ? `Time to take ${medication.name} (${medication.dosage})`
        : `Time to take ${medication.name}`;

      showNotification("Medication Reminder", {
        body: message,
        tag: `medication-${medication.id}`,
        requireInteraction: false,
      });

      console.log(`Notification sent for ${medication.name}`);
    }
  }
}

/**
 * Start medication reminder checker (runs every minute)
 */
export function startMedicationReminders(
  getMedications: () => MedicationReminder[],
): () => void {
  // Check immediately
  void checkMedicationReminders(getMedications());

  // Then check every minute
  const intervalId = setInterval(() => {
    void checkMedicationReminders(getMedications());
  }, 60000); // 60 seconds

  // Return cleanup function
  return () => {
    clearInterval(intervalId);
  };
}

