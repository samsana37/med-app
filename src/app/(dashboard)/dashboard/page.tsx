"use client";

import { useState } from "react";
import { getCurrentUser } from "~/lib/auth";
import { api } from "~/trpc/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import Link from "next/link";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export default function DashboardPage() {
  const user = getCurrentUser();
  const userId = user?.id ?? 1;
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  const { data: medications } = api.medication.getActive.useQuery({ userId });
  const { data: caregivers } = api.caregiver.getAll.useQuery({ userId });
  const { data: symptoms } = api.symptom.getAll.useQuery({ userId });
  const { data: moodEntries } = api.mood.getAll.useQuery({ userId });

  const triggerAlert = api.caregiver.triggerAlert.useMutation({
    onSuccess: () => {
      toast.success("Emergency alert logged");
    },
  });

  const handleEmergencyClick = () => {
    setIsEmergencyOpen(true);
    triggerAlert.mutate({ userId });
  };

  const handleCopyEmergencyInfo = () => {
    const userInfo = `
EMERGENCY ALERT - ${user?.name || "User"}
Date: ${new Date().toLocaleString()}

PATIENT INFORMATION:
- Name: ${user?.name || "N/A"}
- Age: ${user?.age || "N/A"}
- Blood Type: ${user?.bloodType || "N/A"}
- Allergies: ${user?.allergies || "None recorded"}

EMERGENCY CONTACTS:
${caregivers?.map((c) => `
- ${c.name} (${c.relationship || "Contact"})
  Phone: ${c.phone || "N/A"}
  Email: ${c.email || "N/A"}
`).join("") || "No contacts added"}
    `.trim();

    navigator.clipboard.writeText(userInfo);
    toast.success("Emergency information copied to clipboard");
  };

  // Get recent symptoms (last 7 days)
  const recentSymptoms = symptoms?.filter((s) => {
    const symptomDate = new Date(s.symptomDate);
    const daysAgo = (Date.now() - symptomDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 7;
  }).length ?? 0;

  // Get mood entries this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyMoods = moodEntries?.filter((m) => {
    const entryDate = new Date(m.entryDate);
    return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
  }).length ?? 0;
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to your health management center</p>
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
                <p><strong>Name:</strong> {user?.name || "N/A"}</p>
                <p><strong>Age:</strong> {user?.age || "N/A"}</p>
                <p><strong>Blood Type:</strong> {user?.bloodType || "N/A"}</p>
                <p><strong>Allergies:</strong> {user?.allergies || "None recorded"}</p>
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
            <CardTitle className="text-lg">Today's Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{medications?.length ?? 0}</p>
            <p className="text-sm text-gray-600">to take</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{recentSymptoms}</p>
            <p className="text-sm text-gray-600">this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mood Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{monthlyMoods}</p>
            <p className="text-sm text-gray-600">this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Caregivers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{caregivers?.length ?? 0}</p>
            <p className="text-sm text-gray-600">contacts</p>
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
            <CardTitle>Today's Medications</CardTitle>
            <CardDescription>Check off medications you've taken</CardDescription>
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
            <CardDescription>How are you feeling today?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">😢</Button>
              <Button variant="outline" size="sm">😟</Button>
              <Button variant="outline" size="sm">😐</Button>
              <Button variant="outline" size="sm">🙂</Button>
              <Button variant="outline" size="sm">😊</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

