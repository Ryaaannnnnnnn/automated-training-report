"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
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
            <main className="relative flex min-h-screen items-center justify-center bg-gray-200 p-4">
                {/* Background Overlay */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat grayscale-[0.2]"
                    style={{ backgroundImage: "url('/login-bg.jpg')", backgroundColor: "#f3f4f6" }}
                />
                <div className="absolute inset-0 z-0 bg-black/5" />

                <div className="z-10 w-full max-w-[420px] overflow-hidden rounded-[24px] bg-white shadow-2xl p-10 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500">
                        <CheckCircle size={48} />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-3">Registration Successful!</h1>
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
        );
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center bg-gray-200 p-4">
            {/* Background Image Placeholder */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat grayscale-[0.2]"
                style={{ backgroundImage: "url('/login-bg.jpg')", backgroundColor: "#f3f4f6" }}
            />

            {/* Overlay to ensure readability */}
            <div className="absolute inset-0 z-0 bg-black/5" />

            <div className="z-10 w-full max-w-[420px] overflow-hidden rounded-[24px] bg-white shadow-2xl">
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
                    <h1 className="text-xl font-semibold tracking-wide">DICT Training Report System</h1>
                    <p className="mt-2 text-sm text-blue-50/80 font-medium">Create a new account</p>
                </div>

                {/* Form Section */}
                <form onSubmit={onSubmit} className="space-y-5 p-10">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-800">
                            <span className="text-gray-600">@</span>
                            Email Address
                        </label>
                        <input
                            type="email"
                            className="w-full rounded-xl border-2 border-gray-100 bg-white px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-gray-300 focus:border-[#007BE6]/30 focus:ring-4 focus:ring-[#007BE6]/5"
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
                            <User size={16} className="text-gray-600" />
                            Username
                        </label>
                        <input
                            className="w-full rounded-xl border-2 border-gray-100 bg-white px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-gray-300 focus:border-[#007BE6]/30 focus:ring-4 focus:ring-[#007BE6]/5"
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
                            <Lock size={16} className="text-gray-600" />
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="w-full rounded-xl border-2 border-gray-100 bg-white px-4 py-3 pr-12 text-sm font-medium outline-none transition-all placeholder:text-gray-300 focus:border-[#007BE6]/30 focus:ring-4 focus:ring-[#007BE6]/5"
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
                                className="absolute inset-y-0 right-3 my-auto flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-800">
                            <Lock size={16} className="text-gray-600" />
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                className="w-full rounded-xl border-2 border-gray-100 bg-white px-4 py-3 pr-12 text-sm font-medium outline-none transition-all placeholder:text-gray-300 focus:border-[#007BE6]/30 focus:ring-4 focus:ring-[#007BE6]/5"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                placeholder="Repeate your password"
                                required
                                minLength={6}
                            />
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
                        className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#007BE6] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#007BE6]/20 transition-all hover:bg-[#006ACC] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                    >
                        {loading ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                            <>
                                <UserPlus size={18} className="transition-transform group-hover:scale-110" />
                                Create Account
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
                            <span className="text-[10px] font-semibold text-blue-400 capitalize">Automated Training Management & Reporting System</span>
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
    );
}
