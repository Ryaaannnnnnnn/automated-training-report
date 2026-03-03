import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { UserApprovalButtons } from "@/components/AdminControls";
import { DeleteUserButton } from "@/components/DeleteUserButton";
import { ResetPasswordButton } from "@/components/ResetPasswordButton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
        ]
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar username={currentUser.username} role={currentUser.role} />

            <main className="mx-auto max-w-7xl px-4 py-8 animate-page-fade">
                <div className="h-16 md:h-20" />
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-blue-600 transition-colors mb-6 group"
                    >
                        <div className="p-1.5 rounded-lg bg-white border border-gray-100 group-hover:border-blue-100 group-hover:bg-blue-50 transition-all">
                            <ArrowLeft size={16} />
                        </div>
                        Back to Dashboard
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                                User <span className="text-blue-600">Management</span>
                            </h1>
                            <p className="text-gray-500 mt-1 sm:mt-2 text-base sm:text-lg font-medium">Review registrations and manage staff accounts.</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 w-fit">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Total Users</span>
                            <p className="text-xl font-bold text-blue-600 leading-none mt-0.5">{allUsers.length}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden mb-12">
                    <div className="border-b px-6 sm:px-8 py-4 sm:py-6 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-lg sm:text-xl text-gray-900 tracking-tight">Active & Pending Staff</h3>
                        <div className="bg-indigo-100 text-indigo-700 text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                            Management View
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-indigo-50/50 text-indigo-900/60 border-b border-indigo-100/50">
                                <tr>
                                    <th className="px-6 sm:px-8 py-4 font-bold uppercase tracking-widest text-[13px]">User Info</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[13px]">Role</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[13px]">Status</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[13px] hidden md:table-cell">Joined</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[13px]">Security Control</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[13px] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {allUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-blue-50/10 transition-colors even:bg-gray-50/10 group">
                                        <td className="px-6 sm:px-8 py-4 sm:py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-semibold text-base text-white uppercase shadow-sm">
                                                    {user.username.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 capitalize group-hover:text-blue-600 transition-colors text-lg">{user.username}</p>
                                                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-tight">{user.email || "No email provided"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-bold uppercase tracking-widest shadow-sm border ${user.role === "admin"
                                                ? "bg-purple-100 text-purple-700 border-purple-200"
                                                : "bg-blue-100 text-blue-700 border-blue-200"
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-bold uppercase tracking-widest shadow-sm border ${user.status === "APPROVED" ? "bg-green-100 text-green-700 border-green-200" :
                                                user.status === "PENDING" ? "bg-orange-100 text-orange-700 border-orange-200" :
                                                    "bg-red-100 text-red-700 border-red-200"
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-indigo-600/70 font-bold text-sm uppercase tracking-widest hidden md:table-cell whitespace-nowrap">
                                            {user.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role !== "admin" && (
                                                <ResetPasswordButton userId={user.id} username={user.username} />
                                            )}
                                            {user.role === "admin" && (
                                                <span className="text-xs text-gray-400 italic">Self-managed</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                {user.status === "PENDING" && (
                                                    <UserApprovalButtons userId={user.id} currentStatus={user.status} />
                                                )}
                                                {user.id !== currentUser.id && (
                                                    <DeleteUserButton userId={user.id} />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
