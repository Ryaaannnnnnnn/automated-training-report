"use client";

import { useState } from "react";
import { Lock, Save, AlertCircle, CheckCircle, Camera, User, Trash2 } from "lucide-react";
import Script from "next/script";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
    user: {
        id: string;
        username: string;
        role: string;
        avatarUrl: string | null;
    };
}

export function ProfileForm({ user }: ProfileFormProps) {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = () => {
        // @ts-ignore
        const myWidget = window.cloudinary.createUploadWidget(
            {
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo",
                uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "unsigned_preset",
                cropping: true,
                multiple: false,
                clientAllowedFormats: ["jpg", "png", "jpeg", "webp"],
                maxFileSize: 2000000, // 2MB
                styles: {
                    palette: {
                        window: "#0f2044",
                        windowBorder: "#1e293b",
                        tabIcon: "#3b82f6",
                        menuIcons: "#cbd5e1",
                        textDark: "#000000",
                        textLight: "#ffffff",
                        link: "#3b82f6",
                        action: "#3b82f6",
                        inactiveTabIcon: "#64748b",
                        error: "#f43f5e",
                        inProgress: "#3b82f6",
                        complete: "#10b981",
                        sourceBg: "#1e293b"
                    }
                }
            },
            async (error: any, result: any) => {
                if (!error && result && result.event === "success") {
                    setUploading(true);
                    setError(null);
                    setSuccess(null);
                    try {
                        const res = await fetch("/api/user/update-avatar", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ avatarUrl: result.info.secure_url }),
                        });

                        const data = await res.json();
                        if (res.ok) {
                            setSuccess("Profile picture updated!");
                            router.refresh();
                        } else {
                            setError(data.error || "Failed to save avatar URL");
                        }
                    } catch (err) {
                        setError("Error updating profile picture");
                    } finally {
                        setUploading(false);
                    }
                }
            }
        );
        myWidget.open();
    };

    const handleRemoveAvatar = async () => {
        if (!confirm("Are you sure you want to remove your profile picture?")) return;

        setUploading(true);
        setError(null);
        setSuccess(null);
        try {
            const res = await fetch("/api/user/update-avatar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ avatarUrl: null }),
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess("Profile picture removed");
                router.refresh();
            } else {
                setError(data.error || "Failed to remove profile picture");
            }
        } catch (err) {
            setError("Error removing profile picture");
        } finally {
            setUploading(false);
        }
    };

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
        <div className="space-y-12">
            <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="lazyOnload" />

            {/* Avatar Section */}
            <div className="rounded-3xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden animate-page-fade">
                <div className="border-b border-gray-100 dark:border-slate-700 px-8 py-7 bg-gray-50/30 dark:bg-slate-800/50">
                    <h3 className="font-black text-xl text-gray-900 dark:text-white tracking-tight flex items-center gap-4 leading-none">
                        <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-inner">
                            <User size={20} strokeWidth={2.5} />
                        </div>
                        Personal Identity
                    </h3>
                    <p className="text-[11px] font-black text-gray-400 dark:text-slate-500 mt-2 uppercase tracking-widest pl-1">Customize how you appear to other members</p>
                </div>

                <div className="p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-gray-50 dark:border-slate-700 overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-4xl font-black shadow-2xl transition-transform group-hover:scale-105 duration-500 relative">
                                {user.avatarUrl ? (
                                    <Image
                                        src={user.avatarUrl}
                                        alt={user.username}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    user.username.charAt(0).toUpperCase()
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="absolute -right-1 -bottom-1 p-3 rounded-2xl bg-blue-600 text-white shadow-xl hover:bg-blue-500 hover:scale-110 active:scale-95 transition-all z-10 border-4 border-white dark:border-slate-800"
                            >
                                <Camera size={18} strokeWidth={3} />
                            </button>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div>
                                <h4 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white capitalize tracking-tight leading-none">@{user.username}</h4>
                                <p className="text-[10px] sm:text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mt-2 block">{user.role}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 text-[11px] font-black uppercase tracking-widest text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-950 hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                >
                                    {uploading ? "Updating..." : "Change Photo"}
                                </button>
                                {user.avatarUrl && (
                                    <button
                                        onClick={handleRemoveAvatar}
                                        disabled={uploading}
                                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-red-50/50 dark:bg-red-500/5 border-2 border-red-100/50 dark:border-red-500/20 text-[11px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 hover:bg-red-100/50 dark:hover:bg-red-500/10 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                    >
                                        <Trash2 size={16} strokeWidth={2.5} />
                                        Remove Photo
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
        </div >
    );
}
