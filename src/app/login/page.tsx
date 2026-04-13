"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { User, Lock, Eye, EyeOff, LogIn, GraduationCap } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Prefetch dashboard + warm up the login serverless function on mount
  useEffect(() => {
    router.prefetch("/dashboard");
    // Fire a HEAD-like warm-up to wake the Vercel function before the user clicks Log In
    fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }).catch(() => {});
  }, [router]);


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Login failed");
        setLoading(false);
        return;
      }

      // Hard navigation is often faster for full-page transitions like login,
      // as it bypasses SPA reconciliation and ensures a fresh server-side render.
      window.location.assign("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  const isLoggingIn = loading || isPending;

  return (
    // Force light mode wrapper — this page is always light regardless of theme
    <div className="light" style={{ colorScheme: "light" }}>
      <main className="relative flex min-h-screen items-center justify-center p-4"
        style={{
          backgroundImage: "url('/login%20bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#d1d5db",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 z-0 bg-white/30 backdrop-blur-[2px]" />

        <div className="z-10 w-full max-w-[420px] overflow-hidden rounded-[24px] bg-white shadow-2xl border border-white">
          {/* Header Section */}
          <div className="bg-[#007BE6] py-10 px-8 text-center text-white">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white p-2 shadow-inner">
              <img
                src="/logo.png"
                alt="System Logo"
                className="h-full w-full object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.innerHTML = '<div class="text-[#007BE6] font-bold text-2xl">DICT</div>';
                  }
                }}
              />
            </div>
            <h1 className="text-xl font-bold tracking-wide">DICT Training Report System</h1>
            <p className="mt-2 text-sm text-blue-50/80 font-medium">Please login to continue</p>
          </div>

          {/* Form Section */}
          <form onSubmit={onSubmit} className="space-y-6 p-10 bg-white">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-800">
                <User size={16} className="text-gray-600" />
                Username
              </label>
              <input
                className="w-full rounded-xl border-2 border-gray-100 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:border-[#007BE6]/30 focus:ring-4 focus:ring-[#007BE6]/5"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="Enter your username"
                onFocus={() => router.prefetch("/dashboard")}
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-800">
                <Lock size={16} className="text-gray-600" />
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full rounded-xl border-2 border-gray-100 bg-white px-4 py-3 pr-12 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:border-[#007BE6]/30 focus:ring-4 focus:ring-[#007BE6]/5"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  onFocus={() => router.prefetch("/dashboard")}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 my-auto flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              {/* Removed Forgot Password Link */}
            </div>

            {error ? (
              <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-center text-sm font-semibold text-red-600">
                {error}
              </div>
            ) : null}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              onMouseEnter={() => router.prefetch("/dashboard")}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#007BE6] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#007BE6]/20 transition-all hover:bg-[#006ACC] hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-70 disabled:pointer-events-none"
            >
              {isLoggingIn ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <LogIn size={18} className="transition-transform group-hover:translate-x-1" />
                  Log in
                </>
              )}
            </button>

            {/* Institutional Footer Box */}
            <div className="mt-4 overflow-hidden rounded-xl border border-blue-50 bg-[#F0F7FF] p-4 text-center">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center justify-center gap-1.5 text-[#0060B8]">
                  <GraduationCap size={16} fill="currentColor" className="opacity-80" />
                  <span className="text-[11px] font-bold uppercase tracking-tight">Department of Information and Communications Technology</span>
                </div>
                <span className="text-[10px] font-semibold text-blue-400 capitalize">Automated Training Management &amp; Reporting System</span>
              </div>
            </div>

            <p className="text-center text-[13px] font-medium text-gray-400 pt-2">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-[#007BE6] hover:underline">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
