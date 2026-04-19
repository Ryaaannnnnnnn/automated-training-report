export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { ProfileForm } from "./ProfileForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ProfilePage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 transition-colors duration-300">
            <Sidebar username={user.username} role={user.role} avatarUrl={user.avatarUrl} />

            <main className="mx-auto max-w-3xl px-6 py-8 animate-page-fade">
                <div className="h-16 md:h-20" />
                <div className="mb-10">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-100 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-all group shadow-sm active:scale-95 mb-8"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-3">
                        Account <span className="text-blue-600 dark:text-blue-400">Profile</span>
                    </h1>
                    <p className="text-gray-500 dark:text-slate-400 text-base sm:text-lg font-medium">Update your security settings and manage your account information.</p>
                </div>

                <ProfileForm user={user} />
            </main>
        </div>
    );
}
