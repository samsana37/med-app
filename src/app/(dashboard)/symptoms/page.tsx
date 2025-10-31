"use client";

import { useState } from "react";
import { getCurrentUser } from "~/lib/auth";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

const severityColors = {
  Mild: "bg-green-100 text-green-800",
  Moderate: "bg-yellow-100 text-yellow-800",
  Severe: "bg-red-100 text-red-800",
};

export default function SymptomsPage() {
  const user = getCurrentUser();
  const userId = user?.id ?? 1;

  // Real-time updates for symptoms
  const { data: symptoms, refetch } = api.symptom.getAll.useQuery(
    { userId },
    { refetchInterval: 45000 } // Update every 45 seconds
  );
  const createSymptom = api.symptom.create.useMutation({
    onSuccess: () => {
      toast.success("Symptom logged successfully");
      refetch();
      setIsDialogOpen(false);
      setFormData({ name: "", severity: "Mild", notes: "", symptomDate: "" });
    },
    onError: () => {
      toast.error("Failed to log symptom");
    },
  });

  const deleteSymptom = api.symptom.delete.useMutation({
    onSuccess: () => {
      toast.success("Symptom deleted");
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete symptom");
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    severity: "Mild" as "Mild" | "Moderate" | "Severe",
    notes: "",
    symptomDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a symptom name");
      return;
    }

    createSymptom.mutate({
      userId,
      ...formData,
      symptomDate: formData.symptomDate || undefined,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Symptom Tracker</h1>
          <p className="mt-2 text-gray-600">Log and track your symptoms over time</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Log Symptom
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Symptom</DialogTitle>
              <DialogDescription>
                Record a symptom you're experiencing
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Symptom Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Headache, Fever, Nausea"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">Severity *</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) =>
                    setFormData({ ...formData, severity: value as "Mild" | "Moderate" | "Severe" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mild">Mild</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.symptomDate}
                  onChange={(e) => setFormData({ ...formData, symptomDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional details about the symptom"
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full" disabled={createSymptom.isPending}>
                {createSymptom.isPending ? "Logging..." : "Log Symptom"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timeline View */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Symptom Timeline</CardTitle>
          <CardDescription>Chronological view of your symptoms</CardDescription>
        </CardHeader>
        <CardContent>
          {!symptoms || symptoms.length === 0 ? (
            <p className="text-sm text-gray-500">No symptoms logged yet</p>
          ) : (
            <div className="space-y-4">
              {symptoms.map((symptom) => (
                <div
                  key={symptom.id}
                  className="flex items-start gap-4 border-l-4 pl-4 py-2"
                  style={{
                    borderLeftColor:
                      symptom.severity === "Severe"
                        ? "#ef4444"
                        : symptom.severity === "Moderate"
                          ? "#eab308"
                          : "#22c55e",
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{symptom.name}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded ${severityColors[symptom.severity as keyof typeof severityColors]}`}
                      >
                        {symptom.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(symptom.symptomDate).toLocaleDateString()}
                    </p>
                    {symptom.notes && (
                      <p className="text-sm text-gray-700 mt-2">{symptom.notes}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this symptom?")) {
                        deleteSymptom.mutate({ id: symptom.id });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* List View */}
      <Card>
        <CardHeader>
          <CardTitle>All Symptoms</CardTitle>
          <CardDescription>Complete list of logged symptoms</CardDescription>
        </CardHeader>
        <CardContent>
          {!symptoms || symptoms.length === 0 ? (
            <p className="text-sm text-gray-500">No symptoms logged yet</p>
          ) : (
            <div className="space-y-2">
              {symptoms.map((symptom) => (
                <div
                  key={symptom.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{symptom.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(symptom.symptomDate).toLocaleDateString()} • {symptom.severity}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this symptom?")) {
                        deleteSymptom.mutate({ id: symptom.id });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

