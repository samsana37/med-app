"use client";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

const moodEmojis = [
  { value: 1, emoji: "😢", label: "Very Sad" },
  { value: 2, emoji: "😟", label: "Sad" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "🙂", label: "Happy" },
  { value: 5, emoji: "😊", label: "Very Happy" },
];

interface QuickMoodEntryProps {
  userId: number;
  onSuccess?: () => void;
}

export function QuickMoodEntry({ userId, onSuccess }: QuickMoodEntryProps) {
  const createMood = api.mood.create.useMutation({
    onSuccess: () => {
      toast.success("Mood logged!");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to log mood");
    },
  });

  const handleQuickMood = (mood: number) => {
    createMood.mutate({
      userId,
      mood,
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        {moodEmojis.map((mood) => (
          <Button
            key={mood.value}
            variant="outline"
            size="sm"
            onClick={() => handleQuickMood(mood.value)}
            disabled={createMood.isPending}
            className="hover:scale-110 transition-transform flex-1"
            title={mood.label}
          >
            {mood.emoji}
          </Button>
        ))}
      </div>
      <a href="/mood" className="block">
        <Button variant="link" size="sm" className="text-xs w-full">
          View full mood tracker →
        </Button>
      </a>
    </div>
  );
}

