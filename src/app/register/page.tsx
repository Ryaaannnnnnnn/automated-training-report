"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Lock, Eye, EyeOff, UserPlus, CheckCircle, GraduationCap } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

            if (!res.ok || !data?.ok) {
                setError(data?.error ?? "Registration failed");
                return;
            }

            setSuccess(true);
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            // Force light mode — always light regardless of theme setting
            <div className="light" style={{ colorScheme: "light" }}>
                <main className="relative flex min-h-screen items-center justify-center bg-gray-200 p-4">
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat grayscale-[0.2]"
                        style={{ backgroundImage: "url('/login-bg.jpg')", backgroundColor: "#f3f4f6" }}
                    />
                    <div className="absolute inset-0 z-0 bg-black/5" />

                    <div className="relative w-full max-w-[420px] overflow-hidden rounded-none sm:rounded-[24px] bg-white shadow-2xl border-none sm:border sm:border-white shadow-blue-900/10 transition-all duration-500" style={{ zIndex: 2 }}>
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500">
                            <CheckCircle size={48} />
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">Registration Successful!</h1>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                            Your account has been created and is pending approval. Please wait for an administrator to activate your account.
                        </p>
                        <Link
                            href="/login"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#007BE6] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#007BE6]/20 transition-all hover:bg-[#006ACC]"
                        >
                            Back to Login
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        // Force light mode — always light regardless of theme setting
        <div className="light" style={{ colorScheme: "light" }}>
            <main className="relative flex min-h-screen items-center justify-center p-0 sm:p-4">
            {/* Background Image */}
            <Image
                src="/login-bg.jpg"
                alt="DICT Building Background"
                fill
                priority
                className="object-cover object-center sm:grayscale-[0.2]"
                style={{ zIndex: 0 }}
            />
            {/* Background Overlay - Desktop */}
            <div className="absolute inset-0 z-0 hidden sm:block bg-black/5" />
            
            {/* Advanced Glass Backdrop Overlay - Mobile Only */}
            <div className="absolute inset-0 bg-white/30 backdrop-blur-[8px] sm:hidden" style={{ zIndex: 1 }} />

            <div className="relative w-full max-w-[420px] overflow-hidden rounded-none sm:rounded-[24px] bg-white shadow-2xl border-none sm:border sm:border-white shadow-blue-900/10 transition-all duration-500" style={{ zIndex: 2 }}>
                    {/* Header Section */}
                    <div className="bg-[#007BE6] py-10 px-8 text-center text-white">
                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 sm:bg-white p-1 sm:p-2 shadow-inner">
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
                        {/* Desktop Brand */}
                        <h1 className="hidden sm:block text-xl font-semibold tracking-wide">After Training Report System</h1>
                        <p className="hidden sm:block mt-2 text-sm text-blue-50/80 font-medium">Create a new account</p>
                        
                        {/* Mobile Brand */}
                        <div className="sm:hidden">
                            <h1 className="text-2xl font-black tracking-tighter leading-none mb-1">After Training Report System</h1>
                            <p className="mt-2 text-sm text-blue-50/80 font-medium">Create a new account</p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={onSubmit} className="space-y-6 p-8 sm:p-10 bg-white">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-800">
                                <span className="text-gray-600 font-black">@</span>
                                Email Address
                            </label>
                            <input
                                type="email"
                                className="w-full rounded-2xl sm:rounded-xl border-2 border-gray-50 sm:border-gray-100 bg-gray-50/50 sm:bg-white px-4 py-3.5 sm:py-3 text-sm font-bold sm:font-medium text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:border-[#007BE6]/30 focus:bg-white focus:ring-4 focus:ring-[#007BE6]/5 shadow-sm sm:shadow-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-800">
                                <User size={14} className="text-gray-600 font-bold" />
                                Username
                            </label>
                            <input
                                className="w-full rounded-2xl sm:rounded-xl border-2 border-gray-50 sm:border-gray-100 bg-gray-50/50 sm:bg-white px-4 py-3.5 sm:py-3 text-sm font-bold sm:font-medium text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:border-[#007BE6]/30 focus:bg-white focus:ring-4 focus:ring-[#007BE6]/5 shadow-sm sm:shadow-none"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                placeholder="Choose a username"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-800">
                                <Lock size={14} className="text-gray-600 font-bold" />
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full rounded-2xl sm:rounded-xl border-2 border-gray-50 sm:border-gray-100 bg-gray-50/50 sm:bg-white px-4 py-3.5 sm:py-3 pr-12 text-sm font-bold sm:font-medium text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:border-[#007BE6]/30 focus:bg-white focus:ring-4 focus:ring-[#007BE6]/5 shadow-sm sm:shadow-none"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    placeholder="Min. 6 characters"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute inset-y-0 right-2 my-auto flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition-colors hover:text-[#007BE6] hover:bg-[#007BE6]/5"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-800">
                                <Lock size={14} className="text-gray-600 font-bold" />
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full rounded-2xl sm:rounded-xl border-2 border-gray-50 sm:border-gray-100 bg-gray-50/50 sm:bg-white px-4 py-3.5 sm:py-3 pr-12 text-sm font-bold sm:font-medium text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:border-[#007BE6]/30 focus:bg-white focus:ring-4 focus:ring-[#007BE6]/5 shadow-sm sm:shadow-none"
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                    placeholder="Repeat your password"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute inset-y-0 right-2 my-auto flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition-colors hover:text-[#007BE6] hover:bg-[#007BE6]/5"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error ? (
                            <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-center text-sm font-semibold text-red-600">
                                {error}
                            </div>
                        ) : null}

                        {/* Register Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#007BE6] py-3.5 sm:py-4 text-sm font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-blue-500/30 transition-all hover:bg-[#006ACC] hover:translate-y-[-2px] active:translate-y-[1px] disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {loading ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                <>
                                    Create Account
                                    <UserPlus size={18} strokeWidth={3} className="transition-transform group-hover:scale-110" />
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
                                <span className="text-[10px] font-semibold text-blue-400 capitalize">Region VI AKLAN</span>
                            </div>
                        </div>

                        <p className="text-center text-[13px] font-medium text-gray-400 pt-2">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-[#007BE6] hover:underline">
                                Sign in here
                            </Link>
                        </p>
                    </form>
                </div>
            </main>
        </div>
    );
}
