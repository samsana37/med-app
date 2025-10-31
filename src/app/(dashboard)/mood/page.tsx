"use client";

import { useState } from "react";
import { getCurrentUser } from "~/lib/auth";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { toast } from "sonner";
import { Plus, BookOpen, Trash2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const moodEmojis = [
  { value: 1, emoji: "😢", label: "Very Sad" },
  { value: 2, emoji: "😟", label: "Sad" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "🙂", label: "Happy" },
  { value: 5, emoji: "😊", label: "Very Happy" },
];

export default function MoodPage() {
  const user = getCurrentUser();
  const userId = user?.id ?? 1;

  // Real-time updates for mood entries
  const { data: moodEntries, refetch } = api.mood.getAll.useQuery(
    { userId },
    { refetchInterval: 60000 } // Update every minute
  );
  const { data: journals, refetch: refetchJournals } = api.mood.getAllJournals.useQuery(
    { userId },
    { refetchInterval: 60000 } // Update every minute
  );

  const createMood = api.mood.create.useMutation({
    onSuccess: () => {
      toast.success("Mood logged successfully");
      refetch();
      setIsDialogOpen(false);
      setMoodData({ mood: 3, notes: "", entryDate: "" });
    },
    onError: () => {
      toast.error("Failed to log mood");
    },
  });

  const createJournal = api.mood.createJournal.useMutation({
    onSuccess: () => {
      toast.success("Journal entry created");
      refetchJournals();
      setIsJournalDialogOpen(false);
      setJournalData({ title: "", content: "", entryDate: "" });
    },
    onError: () => {
      toast.error("Failed to create journal entry");
    },
  });

  const deleteJournal = api.mood.deleteJournal.useMutation({
    onSuccess: () => {
      toast.success("Journal entry deleted");
      refetchJournals();
    },
    onError: () => {
      toast.error("Failed to delete journal entry");
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isJournalDialogOpen, setIsJournalDialogOpen] = useState(false);
  const [moodData, setMoodData] = useState({ mood: 3, notes: "", entryDate: "" });
  const [journalData, setJournalData] = useState({ title: "", content: "", entryDate: "" });

  const handleMoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMood.mutate({
      userId,
      mood: moodData.mood,
      notes: moodData.notes || undefined,
      entryDate: moodData.entryDate || undefined,
    });
  };

  const handleQuickMood = (mood: number) => {
    createMood.mutate({
      userId,
      mood,
    });
  };

  const handleJournalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalData.title.trim() || !journalData.content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }
    createJournal.mutate({
      userId,
      ...journalData,
    });
  };

  // Get mood history for the last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  const getMoodForDate = (date: string) => {
    return moodEntries?.find((entry) => {
      if (!entry.entryDate) return false;
      const entryDate = new Date(entry.entryDate).toISOString().split("T")[0];
      return entryDate === date;
    });
  };

  const getMoodColor = (mood?: number) => {
    if (!mood) return "bg-gray-100";
    if (mood <= 2) return "bg-red-200";
    if (mood === 3) return "bg-yellow-200";
    return "bg-green-200";
  };

  // Prepare data for line chart (last 30 days)
  const chartData = last30Days.map((date) => {
    if (!date) return null;
    const entry = getMoodForDate(date);
    return {
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      mood: entry?.mood ?? null,
      fullDate: date,
    };
  }).filter((d): d is { date: string; mood: number; fullDate: string } => d !== null && d.mood !== null && d.date !== "");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mood & Wellness</h1>
          <p className="mt-2 text-gray-600">Track your mood and journal your thoughts</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Log Mood
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Your Mood</DialogTitle>
                <DialogDescription>How are you feeling today?</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleMoodSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Mood</Label>
                  <div className="flex gap-2">
                    {moodEmojis.map((mood) => (
                      <Button
                        key={mood.value}
                        type="button"
                        variant={moodData.mood === mood.value ? "default" : "outline"}
                        onClick={() => setMoodData({ ...moodData, mood: mood.value })}
                        className="flex-1 flex-col h-auto py-3"
                      >
                        <span className="text-2xl">{mood.emoji}</span>
                        <span className="text-xs mt-1">{mood.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={moodData.notes}
                    onChange={(e) => setMoodData({ ...moodData, notes: e.target.value })}
                    placeholder="How are you feeling? What's on your mind?"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date (Optional)</Label>
                  <Input
                    id="date"
                    type="date"
                    value={moodData.entryDate}
                    onChange={(e) => setMoodData({ ...moodData, entryDate: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={createMood.isPending}>
                  {createMood.isPending ? "Logging..." : "Log Mood"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isJournalDialogOpen} onOpenChange={setIsJournalDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <BookOpen className="mr-2 h-4 w-4" />
                New Journal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Journal Entry</DialogTitle>
                <DialogDescription>Write about your day or thoughts</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleJournalSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={journalData.title}
                    onChange={(e) => setJournalData({ ...journalData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={journalData.content}
                    onChange={(e) => setJournalData({ ...journalData, content: e.target.value })}
                    rows={8}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={createJournal.isPending}>
                  {createJournal.isPending ? "Creating..." : "Create Entry"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Mood Entry */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Mood Entry</CardTitle>
          <CardDescription>Tap an emoji to quickly log your mood</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {moodEmojis.map((mood) => (
              <Button
                key={mood.value}
                variant="outline"
                size="lg"
                onClick={() => handleQuickMood(mood.value)}
                className="flex-1 flex-col h-auto py-4"
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className="text-xs mt-2">{mood.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mood Trend Line Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Mood Trends</CardTitle>
          <CardDescription>Line chart showing your mood over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  domain={[1, 5]}
                  tick={{ fontSize: 12 }}
                  label={{ value: "Mood (1-5)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip 
                  formatter={(value: number) => [
                    moodEmojis.find((m) => m.value === value)?.label ?? value,
                    "Mood"
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Mood Level"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <p>No mood data to display. Start logging your mood to see trends!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mood Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>30-Day Mood History</CardTitle>
            <CardDescription>Color-coded calendar view of your mood</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {last30Days.map((date) => {
                if (!date) return null;
                const entry = getMoodForDate(date);
                const mood = entry?.mood;
                const dateObj = new Date(date);
                const day = dateObj.getDate();
                const moodLabel = entry && mood ? moodEmojis.find((m) => m.value === mood)?.label ?? "No entry" : "No entry";
                return (
                  <div
                    key={date}
                    className={`aspect-square rounded p-1 text-xs ${getMoodColor(mood)} flex items-center justify-center`}
                    title={moodLabel}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-200 rounded" />
                <span>Sad (1-2)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-200 rounded" />
                <span>Neutral (3)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-200 rounded" />
                <span>Happy (4-5)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 rounded" />
                <span>No entry</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Mood Entries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Mood Entries</CardTitle>
            <CardDescription>Your latest mood logs</CardDescription>
          </CardHeader>
          <CardContent>
            {!moodEntries || moodEntries.length === 0 ? (
              <p className="text-sm text-gray-500">No mood entries yet</p>
            ) : (
              <div className="space-y-3">
                {moodEntries.slice(0, 10).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {moodEmojis.find((m) => m.value === entry.mood)?.emoji}
                      </span>
                      <div>
                        <p className="font-medium">
                          {moodEmojis.find((m) => m.value === entry.mood)?.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          {entry.entryDate ? new Date(entry.entryDate).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>
                    {entry.notes && (
                      <p className="text-sm text-gray-600 max-w-xs truncate">{entry.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Journal Entries */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Journal Entries</CardTitle>
          <CardDescription>Your personal journal and thoughts</CardDescription>
        </CardHeader>
        <CardContent>
          {!journals || journals.length === 0 ? (
            <p className="text-sm text-gray-500">No journal entries yet</p>
          ) : (
            <div className="space-y-4">
              {journals.map((journal) => (
                <div key={journal.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{journal.title}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this journal entry?")) {
                          deleteJournal.mutate({ id: journal.id });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(journal.entryDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{journal.content}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

