// app/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Don't check auth on login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Skip auth check if on login page
    if (isLoginPage) {
      setIsAuthenticated(true);
      return;
    }
    
    checkAuth();
  }, [isLoginPage]);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/check-auth");
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push("/admin/login");
      }
    } catch (error) {
      setIsAuthenticated(false);
      router.push("/admin/login");
    }
  };

  // Show loading spinner only when checking auth on non-login pages
  if (!isLoginPage && isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8f1d1d] mx-auto"></div>
          <p className="mt-4 text-neutral-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}