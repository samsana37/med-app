"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "~/lib/auth";
import { api } from "~/trpc/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import Link from "next/link";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { QuickMoodEntry } from "~/components/quick-mood-entry";

export default function DashboardPage() {
  const user = getCurrentUser();
  const userId = user?.id ?? 1;
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  // Enable real-time updates with refetch intervals
  const { data: medications } = api.medication.getActive.useQuery(
    { userId },
    { refetchInterval: 30000 } // Refetch every 30 seconds
  );
  const { data: caregivers, refetch: refetchCaregivers } = api.caregiver.getAll.useQuery(
    { userId },
    { refetchInterval: 60000 } // Refetch every minute
  );
  const { data: symptoms } = api.symptom.getAll.useQuery(
    { userId },
    { refetchInterval: 45000 } // Refetch every 45 seconds
  );
  const { data: moodEntries, refetch: refetchMoods } = api.mood.getAll.useQuery(
    { userId },
    { refetchInterval: 60000 } // Refetch every minute
  );

  const triggerAlert = api.caregiver.triggerAlert.useMutation({
    onSuccess: () => {
      toast.success("Emergency alert logged");
      // Refetch data after alert
      void refetchCaregivers();
    },
  });

  const handleEmergencyClick = () => {
    setIsEmergencyOpen(true);
    triggerAlert.mutate({ userId });
  };

  const handleCopyEmergencyInfo = () => {
    const userInfo = `
EMERGENCY ALERT - ${user?.name ?? "User"}
Date: ${new Date().toLocaleString()}

PATIENT INFORMATION:
- Name: ${user?.name ?? "N/A"}
- Age: ${user?.age ?? "N/A"}
- Blood Type: ${user?.bloodType ?? "N/A"}
- Allergies: ${user?.allergies ?? "None recorded"}

EMERGENCY CONTACTS:
${caregivers?.map((c) => `
- ${c.name} (${c.relationship ?? "Contact"})
  Phone: ${c.phone ?? "N/A"}
  Email: ${c.email ?? "N/A"}
`).join("") ?? "No contacts added"}
    `.trim();

    void navigator.clipboard.writeText(userInfo);
    toast.success("Emergency information copied to clipboard");
  };

  // Get recent symptoms (last 7 days) - real-time calculated
  const recentSymptoms = symptoms?.filter((s) => {
    const symptomDate = new Date(s.symptomDate);
    const daysAgo = (Date.now() - symptomDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 7;
  }).length ?? 0;

  // Get mood entries this month - real-time calculated
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyMoods = moodEntries?.filter((m) => {
    if (!m.entryDate) return false;
    const entryDate = new Date(m.entryDate);
    return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
  }).length ?? 0;

  // Real-time clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome to your health management center</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Live Updates</p>
          <p className="text-lg font-mono font-semibold text-blue-600">
            {currentTime.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Emergency Alert Button */}
      <div className="mb-8">
        <Card className="border-red-500 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">Emergency Alert</CardTitle>
            <CardDescription>
              Click to view emergency contacts and critical health information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" size="lg" className="w-full md:w-auto" onClick={handleEmergencyClick}>
              🚨 Emergency Alert
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEmergencyOpen} onOpenChange={setIsEmergencyOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-red-700">🚨 Emergency Alert Information</DialogTitle>
            <DialogDescription>
              Critical health information and emergency contacts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Patient Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-1">
                <p><strong>Name:</strong> {user?.name ?? "N/A"}</p>
                <p><strong>Age:</strong> {user?.age ?? "N/A"}</p>
                <p><strong>Blood Type:</strong> {user?.bloodType ?? "N/A"}</p>
                <p><strong>Allergies:</strong> {user?.allergies ?? "None recorded"}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Emergency Contacts</h3>
              {caregivers && caregivers.length > 0 ? (
                <div className="space-y-2">
                  {caregivers.map((caregiver) => (
                    <div key={caregiver.id} className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">{caregiver.name}</p>
                      {caregiver.relationship && <p className="text-sm text-gray-600">{caregiver.relationship}</p>}
                      {caregiver.phone && <p className="text-sm">📞 {caregiver.phone}</p>}
                      {caregiver.email && <p className="text-sm">✉️ {caregiver.email}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No emergency contacts added</p>
              )}
            </div>

            <Button onClick={handleCopyEmergencyInfo} className="w-full">
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today&apos;s Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-600">{medications?.length ?? 0}</p>
                <p className="text-sm text-gray-600">to take</p>
              </div>
              {medications && medications.length > 0 && (
                <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-3xl font-bold text-orange-600">{recentSymptoms}</p>
                <p className="text-sm text-gray-600">this week</p>
              </div>
              {recentSymptoms > 0 && (
                <span className="h-3 w-3 bg-orange-500 rounded-full animate-pulse" />
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mood Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-600">{monthlyMoods}</p>
                <p className="text-sm text-gray-600">this month</p>
              </div>
              {monthlyMoods > 0 && (
                <span className="h-3 w-3 bg-purple-500 rounded-full animate-pulse" />
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Caregivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-3xl font-bold text-green-600">{caregivers?.length ?? 0}</p>
                <p className="text-sm text-gray-600">contacts</p>
              </div>
              {caregivers && caregivers.length > 0 && (
                <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/medications">
              <Button variant="outline" className="w-full justify-start">
                💊 Add Medication
              </Button>
            </Link>
            <Link href="/mood">
              <Button variant="outline" className="w-full justify-start">
                😊 Log Mood
              </Button>
            </Link>
            <Link href="/symptoms">
              <Button variant="outline" className="w-full justify-start">
                📋 Log Symptom
              </Button>
            </Link>
            <Link href="/health">
              <Button variant="outline" className="w-full justify-start">
                💓 Log Vital Signs
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Medications</CardTitle>
            <CardDescription>Check off medications you&apos;ve taken</CardDescription>
          </CardHeader>
          <CardContent>
            {medications && medications.length > 0 ? (
              <div className="space-y-2">
                {medications.slice(0, 3).map((med) => (
                  <div key={med.id} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{med.name}</span>
                  </div>
                ))}
                {medications.length > 3 && (
                  <Link href="/medications">
                    <Button variant="link" className="text-sm">
                      View all {medications.length} medications →
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No medications scheduled for today</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Mood Entry</CardTitle>
            <CardDescription>How are you feeling right now?</CardDescription>
          </CardHeader>
          <CardContent>
            <QuickMoodEntry userId={userId} onSuccess={() => void refetchMoods()} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

