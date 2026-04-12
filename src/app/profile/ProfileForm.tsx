"use client";

import { useState } from "react";
import { Lock, Save, AlertCircle, CheckCircle } from "lucide-react";

export function ProfileForm() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/user/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Failed to change password");
            } else {
                setSuccess("Password changed successfully!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (err) {
            setError("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-3xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden mb-12 animate-page-fade">
            <div className="border-b border-gray-100 dark:border-slate-700 px-8 py-7 bg-gray-50/30 dark:bg-slate-800/50">
                <h3 className="font-black text-xl text-gray-900 dark:text-white tracking-tight flex items-center gap-4 leading-none">
                    <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-inner">
                        <Lock size={20} strokeWidth={2.5} />
                    </div>
                    Account Security
                </h3>
                <p className="text-[11px] font-black text-gray-400 dark:text-slate-500 mt-2 uppercase tracking-widest pl-1">Update your login credentials and security parameters</p>
            </div>

            <form onSubmit={handleChangePassword} className="p-8 space-y-10">
                {error && (
                    <div className="flex items-center gap-3 rounded-2xl border border-red-100 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-5 text-[12px] font-black uppercase tracking-wider text-red-600 dark:text-red-400 animate-shake shadow-sm">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 p-5 text-[12px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 shadow-sm animate-bounce-short">
                        <CheckCircle size={18} />
                        {success}
                    </div>
                )}

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-900 dark:text-slate-300 uppercase tracking-[0.25em] ml-1">Current Password Verification</label>
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 transition-all group-focus-within:text-blue-500 group-focus-within:scale-110">
                            <Lock size={22} strokeWidth={2.5} />
                        </div>
                        <input
                            type="password"
                            className="w-full rounded-2xl border-2 border-gray-100 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-950/50 text-gray-900 dark:text-white pl-14 pr-4 py-5 text-base font-bold outline-none transition-all focus:border-blue-500/40 focus:ring-8 focus:ring-blue-500/5 focus:bg-white dark:focus:bg-slate-900 placeholder:text-gray-300 dark:placeholder:text-slate-600 tracking-[0.2em]"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-900 dark:text-slate-300 uppercase tracking-[0.25em] ml-1">New Secure Password</label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 transition-all group-focus-within:text-blue-500 group-focus-within:scale-110">
                                <Lock size={22} strokeWidth={2.5} />
                            </div>
                            <input
                                type="password"
                                className="w-full rounded-2xl border-2 border-gray-100 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-950/50 text-gray-900 dark:text-white pl-14 pr-4 py-5 text-base font-bold outline-none transition-all focus:border-blue-500/40 focus:ring-8 focus:ring-blue-500/5 focus:bg-white dark:focus:bg-slate-900 placeholder:text-gray-300 dark:placeholder:text-slate-600 tracking-[0.2em]"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-900 dark:text-slate-300 uppercase tracking-[0.25em] ml-1">Confirm Security Access</label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 transition-all group-focus-within:text-blue-500 group-focus-within:scale-110">
                                <Lock size={22} strokeWidth={2.5} />
                            </div>
                            <input
                                type="password"
                                className="w-full rounded-2xl border-2 border-gray-100 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-950/50 text-gray-900 dark:text-white pl-14 pr-4 py-5 text-base font-bold outline-none transition-all focus:border-blue-500/40 focus:ring-8 focus:ring-blue-500/5 focus:bg-white dark:focus:bg-slate-900 placeholder:text-gray-300 dark:placeholder:text-slate-600 tracking-[0.2em]"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-gray-100 dark:border-slate-700 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-10 py-5 text-[13px] font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 uppercase tracking-[0.2em]"
                    >
                        {loading ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                            <>
                                <Save size={20} strokeWidth={3} />
                                Commit Changes
                            </>
                        )}
                    </button>
                </div>
            </form >
        </div >
    );
}
