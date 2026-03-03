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
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden mb-12 animate-page-fade">
            <div className="border-b px-8 py-6 bg-gray-50/10">
                <h3 className="font-bold text-xl text-gray-900 tracking-tight flex items-center gap-3 leading-none">
                    <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                        <Lock size={18} strokeWidth={2.5} />
                    </div>
                    Account Security
                </h3>
                <p className="text-[12px] font-medium text-gray-400 mt-1.5 tracking-tight">Update your login credentials and password</p>
            </div>

            <form onSubmit={handleChangePassword} className="p-8 space-y-8">
                {error && (
                    <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-[13px] font-bold text-red-600 animate-shake">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-4 text-[13px] font-bold text-green-600">
                        <CheckCircle size={16} />
                        {success}
                    </div>
                )}

                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] ml-1">Current Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500" size={20} />
                        <input
                            type="password"
                            className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/20 pl-12 pr-4 py-4 text-base font-medium outline-none transition-all focus:border-blue-500/40 focus:ring-8 focus:ring-blue-500/5 focus:bg-white"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] ml-1">New Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500" size={20} />
                            <input
                                type="password"
                                className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/20 pl-12 pr-4 py-4 text-base font-medium outline-none transition-all focus:border-blue-500/40 focus:ring-8 focus:ring-blue-500/5 focus:bg-white"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] ml-1">Confirm New Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500" size={20} />
                            <input
                                type="password"
                                className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/20 pl-12 pr-4 py-4 text-base font-medium outline-none transition-all focus:border-blue-500/40 focus:ring-8 focus:ring-blue-500/5 focus:bg-white"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 text-[12px] font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98] hover:scale-[1.02] disabled:opacity-70 uppercase tracking-[0.2em]"
                    >
                        {loading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                            <>
                                <Save size={20} strokeWidth={2.5} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form >
        </div >
    );
}
