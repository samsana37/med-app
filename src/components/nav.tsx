"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, getCurrentUser } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Medications", href: "/medications" },
  { name: "Mood", href: "/mood" },
  { name: "Symptoms", href: "/symptoms" },
  { name: "Health", href: "/health" },
  { name: "Database", href: "/database" },
  { name: "Caregivers", href: "/caregivers" },
  { name: "Profile", href: "/profile" },
];

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const user = getCurrentUser();
  const userId = user?.id ?? 1;

  // Real-time data for notifications/badges
  const { data: medications } = api.medication.getActive.useQuery(
    { userId },
    { refetchInterval: 30000 }
  );
  const { data: symptoms } = api.symptom.getAll.useQuery(
    { userId },
    { refetchInterval: 60000 }
  );

  // Calculate due medications (simple check - any active medication)
  const dueMedicationsCount = medications?.filter((med) => med.active).length ?? 0;
  
  // Recent symptoms (last 3 days) for notification
  const recentSymptomsCount = symptoms?.filter((s) => {
    const symptomDate = new Date(s.symptomDate);
    const daysAgo = (Date.now() - symptomDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 3;
  }).length ?? 0;

  const handleSignOut = () => {
    signOut();
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              MedAlert
            </Link>
            <div className="hidden space-x-4 md:flex">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                // Show badges for certain pages
                const showBadge = (item.href === "/medications" && dueMedicationsCount > 0) ||
                                  (item.href === "/symptoms" && recentSymptomsCount > 0);
                const badgeCount = item.href === "/medications" ? dueMedicationsCount :
                                 item.href === "/symptoms" ? recentSymptomsCount : 0;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {item.name}
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-pulse">
                        {badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {dueMedicationsCount > 0 && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold animate-pulse">
                <span>💊</span>
                <span>{dueMedicationsCount} med due</span>
              </div>
            )}
            {user && (
              <span className="text-sm text-gray-600 hidden sm:inline">
                {user.name || user.email}
              </span>
            )}
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

