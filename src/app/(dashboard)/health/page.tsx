"use client";

import { useState } from "react";
import { getCurrentUser } from "~/lib/auth";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export default function HealthPage() {
  const user = getCurrentUser();
  const userId = user?.id ?? 1;

  const { data: vitalSigns, refetch } = api.health.getAllVitalSigns.useQuery({ userId });
  const createVitalSign = api.health.createVitalSign.useMutation({
    onSuccess: () => {
      toast.success("Vital sign logged successfully");
      refetch();
      setIsDialogOpen(false);
      setFormData({ type: "blood_pressure", value: "" });
    },
    onError: () => {
      toast.error("Failed to log vital sign");
    },
  });

  const deleteVitalSign = api.health.deleteVitalSign.useMutation({
    onSuccess: () => {
      toast.success("Vital sign deleted");
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete vital sign");
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "blood_pressure",
    value: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.value.trim()) {
      toast.error("Please enter a value");
      return;
    }

    createVitalSign.mutate({
      userId,
      ...formData,
    });
  };

  const vitalSignTypes = [
    { value: "blood_pressure", label: "Blood Pressure" },
    { value: "heart_rate", label: "Heart Rate" },
    { value: "temperature", label: "Temperature" },
    { value: "weight", label: "Weight" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Records</h1>
          <p className="mt-2 text-gray-600">Track your vital signs and health profile</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Log Vital Sign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Vital Sign</DialogTitle>
              <DialogDescription>
                Record a vital sign measurement
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {vitalSignTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Value *</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder={
                    formData.type === "blood_pressure"
                      ? "e.g., 120/80"
                      : formData.type === "heart_rate"
                        ? "e.g., 72 bpm"
                        : formData.type === "temperature"
                          ? "e.g., 98.6°F"
                          : "e.g., 150 lbs"
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={createVitalSign.isPending}>
                {createVitalSign.isPending ? "Logging..." : "Log Vital Sign"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Health Profile */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Health Profile</CardTitle>
          <CardDescription>Your basic health information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-gray-600">Name</Label>
              <p className="font-medium">{user?.name || "Not set"}</p>
            </div>
            <div>
              <Label className="text-gray-600">Age</Label>
              <p className="font-medium">{user?.age || "Not set"}</p>
            </div>
            <div>
              <Label className="text-gray-600">Blood Type</Label>
              <p className="font-medium">{user?.bloodType || "Not set"}</p>
            </div>
            <div>
              <Label className="text-gray-600">Allergies</Label>
              <p className="font-medium">{user?.allergies || "None recorded"}</p>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" asChild>
              <a href="/profile">Edit Profile</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vital Signs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vital Signs History</CardTitle>
          <CardDescription>Table view of all recorded vital signs</CardDescription>
        </CardHeader>
        <CardContent>
          {!vitalSigns || vitalSigns.length === 0 ? (
            <p className="text-sm text-gray-500">No vital signs logged yet</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vitalSigns.map((vital) => {
                    const typeLabel =
                      vitalSignTypes.find((t) => t.value === vital.type)?.label || vital.type;
                    return (
                      <TableRow key={vital.id}>
                        <TableCell>
                          {new Date(vital.recordedAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">{typeLabel}</TableCell>
                        <TableCell>{vital.value}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this vital sign?")) {
                                deleteVitalSign.mutate({ id: vital.id });
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

