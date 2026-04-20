"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Save, User, Briefcase, Shield, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

interface EditUserModalProps {
    user: {
        id: string;
        username: string;
        designation: string | null;
        role: string;
    };
    onClose: () => void;
}

export function EditUserModal({ user, onClose }: EditUserModalProps) {
    const router = useRouter();
    const [username, setUsername] = useState(user.username);
    const [designation, setDesignation] = useState(user.designation ?? "");
    const [role, setRole] = useState(user.role);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!username.trim()) {
            setError("Username cannot be empty.");
            return;
        }

        if (password && password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password && password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${user.id}/update`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username.trim(),
                    designation: designation.trim(),
                    role,
                    password: password || undefined,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Failed to update user.");
            } else {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                    router.refresh();
                }, 900);
            }
        } catch {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md backdrop-saturate-50 animate-fade-in"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Modal panel */}
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-blue-900/20 border border-gray-100 dark:border-slate-700 overflow-hidden animate-scale-in">

                {/* Header */}
                <div className="flex items-center justify-between px-6 sm:px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl">
                            <User size={20} className="text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em]">Editing</p>
                            <h2 className="text-lg font-black text-white leading-none capitalize">{user.username}</h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all"
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-5">

                    {/* Error / Success banners */}
                    {error && (
                        <div className="flex items-center gap-3 rounded-2xl border border-red-100 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-4 text-[12px] font-bold text-red-600 dark:text-red-400">
                            <AlertCircle size={16} className="shrink-0" />
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 p-4 text-[12px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle size={16} className="shrink-0" />
                            Saved successfully! Refreshing…
                        </div>
                    )}

                    {/* Username */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400 flex items-center gap-2">
                            <User size={12} /> Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-2xl border-2 border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white px-5 py-3.5 text-sm font-semibold outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-300 dark:placeholder:text-slate-600"
                            placeholder="e.g. jhon_loyd"
                            required
                        />
                    </div>

                    {/* Designation */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400 flex items-center gap-2">
                            <Briefcase size={12} /> Designation
                        </label>
                        <input
                            type="text"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            className="w-full rounded-2xl border-2 border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white px-5 py-3.5 text-sm font-semibold outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-300 dark:placeholder:text-slate-600"
                            placeholder="e.g. DICT Internship, Provincial Officer"
                        />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400 flex items-center gap-2">
                            <Shield size={12} /> System Role
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full rounded-2xl border-2 border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white px-5 py-3.5 text-sm font-semibold outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                        >
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 dark:border-slate-700 pt-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 dark:text-slate-500 flex items-center gap-2">
                            <Lock size={10} /> Change Password <span className="font-normal normal-case tracking-normal text-gray-300 dark:text-slate-600">(leave blank to keep current)</span>
                        </p>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-2xl border-2 border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white px-5 py-3.5 pr-12 text-sm font-semibold outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition-all tracking-[0.12em] placeholder:text-gray-300 dark:placeholder:text-slate-600 placeholder:tracking-normal"
                                placeholder="Leave blank to keep current"
                                minLength={password ? 6 : undefined}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-2xl border-2 border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white px-5 py-3.5 pr-12 text-sm font-semibold outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition-all tracking-[0.12em] placeholder:text-gray-300 dark:placeholder:text-slate-600 placeholder:tracking-normal"
                                placeholder="Repeat the new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                            >
                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-slate-700 text-[12px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || success}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-[12px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 transition-all"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save size={14} strokeWidth={3} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.92) translateY(12px); }
                    to   { opacity: 1; transform: scale(1)    translateY(0); }
                }
                .animate-scale-in { animation: scale-in 0.22s cubic-bezier(0.34,1.56,0.64,1) both; }
            `}</style>
        </div>
    );
}
