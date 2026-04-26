// app/admin/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, User, LogIn, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/check-auth");
        if (response.ok) {
          window.location.href = "/admin";
        }
      } catch (error) {
        // Not logged in, stay on login page
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // Send username
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "/admin";
      } else {
        setError(data.error || "نام کاربری یا رمز عبور نادرست است");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("خطا در ارتباط با سرور. لطفاً مجدد تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbf5ec] to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-[#8f1d1d]/10 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-[#8f1d1d]" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-[#8f1d1d]">
            پنل مدیریت
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            وارد شوید تا به پنل مدیریت دسترسی پیدا کنید
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-right">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-1 text-right">
                نام کاربری
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border border-neutral-300 placeholder-neutral-500 text-neutral-900 focus:outline-none focus:ring-[#8f1d1d] focus:border-[#8f1d1d] focus:z-10 sm:text-sm text-right"
                  placeholder="نام کاربری"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1 text-right">
                رمز عبور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border border-neutral-300 placeholder-neutral-500 text-neutral-900 focus:outline-none focus:ring-[#8f1d1d] focus:border-[#8f1d1d] focus:z-10 sm:text-sm text-right"
                  placeholder="رمز عبور"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#8f1d1d] hover:bg-[#6b1616] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8f1d1d] transition disabled:opacity-50"
            >
              {loading ? (
                "در حال ورود..."
              ) : (
                <>
                  <LogIn className="h-5 w-5 ml-2" />
                  ورود به پنل مدیریت
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-neutral-500">
          <Link href="/" className="hover:text-[#8f1d1d] transition">
            بازگشت به سایت
          </Link>
        </div>
      </div>
    </div>
  );
}