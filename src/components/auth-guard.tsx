"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { isAuthenticated } from "~/lib/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated() && pathname !== "/signin" && pathname !== "/") {
      router.push("/signin");
    }
  }, [router, pathname]);

  if (!isAuthenticated() && pathname !== "/signin" && pathname !== "/") {
    return null;
  }

  return <>{children}</>;
}

