"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "~/lib/auth";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Check, X } from "lucide-react";

export default function MedicationsPage() {
  const user = getCurrentUser();
  const userId = user?.id ?? 1;

  // Real-time updates for medications
  const { data: medications, refetch } = api.medication.getAll.useQuery(
    { userId },
    { refetchInterval: 30000 } // Update every 30 seconds
  );
  const { data: activeMedications, refetch: refetchActive } = api.medication.getActive.useQuery(
    { userId },
    { refetchInterval: 30000 } // Update every 30 seconds
  );
  const createMedication = api.medication.create.useMutation({
    onSuccess: () => {
      toast.success("Medication added successfully");
      void refetch();
      void refetchActive();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add medication");
    },
  });

  const logMedication = api.medication.logTaken.useMutation({
    onSuccess: () => {
      toast.success("Medication marked as taken");
      void refetch();
      void refetchActive();
    },
    onError: () => {
      toast.error("Failed to log medication");
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    times: [] as string[],
    timeInput: "",
  });

  const handleAddTime = () => {
    if (formData.timeInput.trim()) {
      setFormData({
        ...formData,
        times: [...formData.times, formData.timeInput.trim()],
        timeInput: "",
      });
    }
  };

  const handleRemoveTime = (index: number) => {
    setFormData({
      ...formData,
      times: formData.times.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a medication name");
      return;
    }

    createMedication.mutate({
      userId,
      name: formData.name,
      dosage: formData.dosage || undefined,
      times: formData.times.length > 0 ? formData.times : undefined,
      active: true,
    });

    setFormData({ name: "", dosage: "", times: [], timeInput: "" });
  };

  // Real-time clock for medication timing
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get today's medications with real-time status
  const todayMedications = activeMedications?.filter((med) => med.active) ?? [];

  // Check if medication is due (within current hour)
  const isMedicationDue = (med: { times: string[] | null | undefined } | undefined) => {
    if (!med?.times || !Array.isArray(med.times)) return false;
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    return med.times.some((timeStr: string) => {
      // Parse time like "8:00 AM" or "8:00 PM"
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return false;
      
      let hour = parseInt(match[1]!, 10);
      const minute = parseInt(match[2]!, 10);
      const period = match[3]!.toUpperCase();
      
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
      
      // Check if within current hour (with 5 minute buffer)
      return hour === currentHour && Math.abs(minute - currentMinute) <= 5;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medications</h1>
          <p className="mt-2 text-gray-600">Manage your medications and reminders</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
              <DialogDescription>
                Enter medication details and schedule reminder times
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medication Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Aspirin"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  placeholder="e.g., 100mg"
                />
              </div>
              <div className="space-y-2">
                <Label>Reminder Times</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.timeInput}
                    onChange={(e) => setFormData({ ...formData, timeInput: e.target.value })}
                    placeholder="e.g., 8:00 AM"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTime())}
                  />
                  <Button type="button" onClick={handleAddTime} variant="outline">
                    Add Time
                  </Button>
                </div>
                {formData.times.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.times.map((time, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-md"
                      >
                        <span className="text-sm">{time}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTime(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={createMedication.isPending}>
                {createMedication.isPending ? "Adding..." : "Add Medication"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Medications */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Today's Medications</CardTitle>
          <CardDescription>Check off medications you've taken today</CardDescription>
        </CardHeader>
        <CardContent>
          {todayMedications.length === 0 ? (
            <p className="text-sm text-gray-500">No medications scheduled for today</p>
          ) : (
            <div className="space-y-2">
              {todayMedications.map((med) => {
                const isDue = isMedicationDue(med);
                return (
                  <div
                    key={med.id}
                    className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                      isDue ? "border-orange-500 bg-orange-50 animate-pulse" : ""
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{med.name}</p>
                        {isDue && (
                          <span className="px-2 py-0.5 text-xs font-semibold bg-orange-500 text-white rounded-full animate-bounce">
                            Due Now!
                          </span>
                        )}
                      </div>
                      {med.dosage && <p className="text-sm text-gray-600">{med.dosage}</p>}
                      {med.times && med.times.length > 0 && (
                        <p className="text-xs text-gray-500">
                          Times: {Array.isArray(med.times) ? med.times.join(", ") : ""}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={isDue ? "default" : "outline"}
                      onClick={() =>
                        logMedication.mutate({
                          medicationId: med.id,
                          userId,
                        })
                      }
                      disabled={logMedication.isPending}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Mark as Taken
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Medications */}
      <Card>
        <CardHeader>
          <CardTitle>All Medications</CardTitle>
          <CardDescription>View and manage all your medications</CardDescription>
        </CardHeader>
        <CardContent>
          {!medications || medications.length === 0 ? (
            <p className="text-sm text-gray-500">No medications added yet</p>
          ) : (
            <div className="space-y-3">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{med.name}</p>
                      {!med.active && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    {med.dosage && <p className="text-sm text-gray-600">{med.dosage}</p>}
                    {med.times && med.times.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Reminders: {Array.isArray(med.times) ? med.times.join(", ") : ""}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

