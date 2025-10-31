"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, getCurrentUser } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";

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
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

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
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-gray-600">
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

