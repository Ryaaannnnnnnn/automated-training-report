import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { UserManagementClient } from "@/components/UserManagementClient";

export default async function UsersManagementPage() {
    const currentUser = await getCurrentUser();

    // Security check: only admins can access this page
    if (!currentUser || currentUser.role !== "admin") {
        redirect("/dashboard");
    }

    const allUsers = await prisma.user.findMany({
        orderBy: [
            { status: "asc" }, // Pending first
            { role: "asc" },   // Admin before staff
            { username: "asc" }
        ],
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            status: true,
            designation: true,
            avatarUrl: true,
            createdAt: true,
        }
    });

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 transition-colors duration-300">
            <Sidebar username={currentUser.username} role={currentUser.role} avatarUrl={currentUser.avatarUrl} />

            <main className="mx-auto max-w-7xl px-4 py-8 animate-page-fade">
                <div className="h-16 md:h-20" />
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6 group"
                    >
                        <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 group-hover:border-blue-100 dark:group-hover:border-blue-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-all">
                            <ArrowLeft size={16} />
                        </div>
                        Back to Dashboard
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                                User <span className="text-blue-600 dark:text-blue-400">Management</span>
                            </h1>
                            <p className="text-gray-500 dark:text-slate-400 mt-1 sm:mt-2 text-base sm:text-lg font-medium max-w-xl">Review registrations, approve new staff access, and manage security settings for all accounts.</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 px-6 py-4 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-end">
                            <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-none mb-2">Platform Users</span>
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-blue-600 shadow-sm shadow-blue-200 animate-pulse" />
                                <p className="text-3xl font-black text-gray-900 dark:text-white leading-none">{allUsers.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <UserManagementClient users={allUsers as any} currentUser={{ id: currentUser.id }} />
            </main>
        </div>
    );
}
