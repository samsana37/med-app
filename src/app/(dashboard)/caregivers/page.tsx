"use client";

import { useState } from "react";
import { getCurrentUser } from "~/lib/auth";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Phone, Mail } from "lucide-react";

export default function CaregiversPage() {
  const user = getCurrentUser();
  const userId = user?.id ?? 1;

  // Real-time updates for caregivers
  const { data: caregivers, refetch } = api.caregiver.getAll.useQuery(
    { userId },
    { refetchInterval: 60000 } // Update every minute
  );
  const createCaregiver = api.caregiver.create.useMutation({
    onSuccess: () => {
      toast.success("Emergency contact added successfully");
      refetch();
      setIsDialogOpen(false);
      setFormData({ name: "", relationship: "", phone: "", email: "" });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add contact");
    },
  });

  const deleteCaregiver = api.caregiver.delete.useMutation({
    onSuccess: () => {
      toast.success("Contact removed");
      refetch();
    },
    onError: () => {
      toast.error("Failed to remove contact");
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    createCaregiver.mutate({
      userId,
      ...formData,
    });
  };

  const canAddMore = (caregivers?.length ?? 0) < 3;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emergency Contacts</h1>
          <p className="mt-2 text-gray-600">Manage your emergency contacts (max 3)</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!canAddMore}>
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Emergency Contact</DialogTitle>
              <DialogDescription>
                Add a contact person to be notified in case of emergency
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  placeholder="e.g., Spouse, Parent, Friend"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g., +1 234-567-8900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@example.com"
                />
              </div>
              <Button type="submit" className="w-full" disabled={createCaregiver.isPending}>
                {createCaregiver.isPending ? "Adding..." : "Add Contact"}
              </Button>
              {!canAddMore && (
                <p className="text-sm text-red-600">Maximum of 3 contacts allowed</p>
              )}
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!caregivers || caregivers.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">No emergency contacts added yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Add up to 3 emergency contacts to be notified in case of emergency
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {caregivers.map((caregiver) => (
            <Card key={caregiver.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {caregiver.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm("Are you sure you want to remove this contact?")) {
                        deleteCaregiver.mutate({ id: caregiver.id });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </CardTitle>
                {caregiver.relationship && (
                  <CardDescription>{caregiver.relationship}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                {caregiver.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{caregiver.phone}</span>
                  </div>
                )}
                {caregiver.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{caregiver.email}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {caregivers && caregivers.length >= 3 && (
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="py-4">
            <p className="text-sm text-blue-800">
              You have reached the maximum of 3 emergency contacts. Remove one to add another.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

