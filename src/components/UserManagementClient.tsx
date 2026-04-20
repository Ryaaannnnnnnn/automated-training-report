"use client";

import { useState, useMemo } from "react";
import { UserApprovalButtons } from "./AdminControls";
import { DeleteUserButton } from "./DeleteUserButton";
import { ResetPasswordButton } from "./ResetPasswordButton";
import { EditUserModal } from "./EditUserModal";
import { EmptyState, Skeleton } from "./DashboardWidgets";
import { Search, Filter, Shield, User as UserIcon, Calendar, Pencil, Briefcase } from "lucide-react";
import Image from "next/image";

interface User {
    id: string;
    username: string;
    email: string | null;
    role: string;
    status: string;
    designation: string | null;
    avatarUrl: string | null;
    createdAt: Date;
}

interface UserManagementClientProps {
    users: User[];
    currentUser: { id: string };
}

export function UserManagementClient({ users, currentUser }: UserManagementClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch =
                user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
                (user.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

            const matchesStatus = statusFilter === "ALL" || user.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [users, searchQuery, statusFilter]);

    return (
        <div className="space-y-6">
            {/* Edit Modal */}
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                />
            )}

            {/* Search and Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm animate-page-fade">
                <div className="relative w-full md:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by username, email or designation..."
                        className="block w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-slate-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Filter size={18} className="text-gray-400 dark:text-slate-500 hidden sm:block" />
                    <select
                        className="bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-600/20 transition-all uppercase tracking-wider w-full md:w-auto"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Table or Empty State */}
            <div className="rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden mb-12 animate-page-fade animate-stagger-1">
                <div className="border-b border-gray-100 dark:border-slate-700 px-6 sm:px-8 py-4 sm:py-6 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/80">
                    <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                        <Shield size={20} className="text-blue-600 dark:text-blue-400" />
                        Active &amp; Pending Staff
                    </h3>
                    <div className="bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-200 dark:border-indigo-500/20">
                        {filteredUsers.length} Result{filteredUsers.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {filteredUsers.length === 0 ? (
                    <EmptyState message={searchQuery ? `No users matching "${searchQuery}"` : "No users found."} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#f8fafc] dark:bg-slate-700/50 text-indigo-900/60 dark:text-slate-400 border-b border-gray-100 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 sm:px-8 py-5 font-bold uppercase tracking-[0.2em] text-[10px]">Staff Profile</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-[0.2em] text-[10px] hidden sm:table-cell">Designation</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-[0.2em] text-[10px]">System Role</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-[0.2em] text-[10px]">Account Status</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-[0.2em] text-[10px] hidden md:table-cell">Joined Date</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-[0.2em] text-[10px]">Security</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-[0.2em] text-[10px] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                                {filteredUsers.map((user, idx) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-blue-50/20 dark:hover:bg-blue-500/5 transition-all even:bg-slate-50/30 dark:even:bg-slate-700/20 group animate-fade-in"
                                        style={{ animationDelay: `${idx * 40}ms` }}
                                    >
                                        {/* Staff Profile */}
                                        <td className="px-6 sm:px-8 py-4 sm:py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative group-hover:scale-110 transition-transform duration-300">
                                                    {user.avatarUrl ? (
                                                        <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-md shadow-blue-200 dark:shadow-blue-900/30 border-2 border-white dark:border-slate-700 relative">
                                                            <Image
                                                                src={user.avatarUrl}
                                                                alt={user.username}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-lg text-white uppercase shadow-md shadow-blue-200 dark:shadow-blue-900/30">
                                                            {user.username.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-gray-900 dark:text-slate-100 capitalize group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base tracking-tight">{user.username}</p>
                                                        {user.id === currentUser?.id && (
                                                            <span className="text-[9px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-lg uppercase tracking-widest shadow-sm">You</span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">{user.email || "No email provided"}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Designation */}
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            {user.designation ? (
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-slate-300 font-semibold">
                                                    <Briefcase size={13} className="text-gray-400 dark:text-slate-500 shrink-0" />
                                                    <span className="truncate max-w-[140px]">{user.designation}</span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-black text-gray-300 dark:text-slate-600 uppercase tracking-widest italic">—</span>
                                            )}
                                        </td>

                                        {/* System Role */}
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${user.role === "admin"
                                                ? "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20"
                                                : "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                                                }`}>
                                                <UserIcon size={12} strokeWidth={3} />
                                                {user.role}
                                            </div>
                                        </td>

                                        {/* Account Status */}
                                        <td className="px-6 py-4">
                                            {user.role === "admin" ? (
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20">
                                                    ACTIVE
                                                </span>
                                            ) : (
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${user.status === "APPROVED" ? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20" :
                                                    user.status === "PENDING" ? "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20" :
                                                        "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20"
                                                    }`}>
                                                    {user.status}
                                                </span>
                                            )}
                                        </td>

                                        {/* Joined Date */}
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                                                <Calendar size={14} className="opacity-50" />
                                                <span className="font-bold text-[11px] uppercase tracking-widest whitespace-nowrap">
                                                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Security */}
                                        <td className="px-6 py-4">
                                            {user.role !== "admin" ? (
                                                <ResetPasswordButton userId={user.id} username={user.username} />
                                            ) : (
                                                <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest italic">Self-managed</span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 scale-90 sm:scale-100">
                                                {user.status === "PENDING" && (
                                                    <UserApprovalButtons userId={user.id} currentStatus={user.status} />
                                                )}
                                                {/* Edit button — always visible */}
                                                <button
                                                    onClick={() => setEditingUser(user)}
                                                    className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:scale-110 active:scale-95 transition-all shadow-sm"
                                                    title="Edit user"
                                                >
                                                    <Pencil size={14} strokeWidth={2.5} />
                                                </button>
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
                )}
            </div>
        </div>
    );
}
