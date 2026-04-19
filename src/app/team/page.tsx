import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { User, Shield, Search, Mail, Calendar } from "lucide-react";
import Image from "next/image";

export default async function TeamPage() {
    const currentUser = await getCurrentUser();
    if (!currentUser) redirect("/login");

    const teamMembers = await prisma.user.findMany({
        where: {
            status: "APPROVED",
        },
        orderBy: [
            { role: "asc" },
            { username: "asc" },
        ],
    });

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 transition-colors duration-300">
            <Sidebar username={currentUser.username} role={currentUser.role} avatarUrl={currentUser.avatarUrl} />

            <main className="mx-auto max-w-7xl px-4 py-8 animate-page-fade">
                <div className="h-16 md:h-20" />
                
                <div className="mb-12">
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-3">
                        Our <span className="text-blue-600 dark:text-blue-400">Team</span>
                    </h1>
                    <p className="text-gray-500 dark:text-slate-400 text-base sm:text-lg font-medium">Meet the professional staff members of the DICT Aklan Training System.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                    {teamMembers.map((member, idx) => (
                        <div 
                            key={member.id}
                            className="group relative rounded-[2.5rem] border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500 animate-stagger-1"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="flex flex-col items-center">
                                {/* Avatar Container */}
                                <div className="relative mb-6">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-500 border-4 border-white dark:border-slate-700 relative">
                                        {member.avatarUrl ? (
                                            <Image 
                                                src={member.avatarUrl}
                                                alt={member.username}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            member.username.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-2xl shadow-lg border-4 border-white dark:border-slate-800">
                                        <Shield size={16} strokeWidth={3} />
                                    </div>
                                </div>

                                {/* Text Info */}
                                <div className="text-center space-y-2">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white capitalize tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {member.username}
                                    </h3>
                                    <div className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-500/20">
                                        {member.role}
                                    </div>
                                </div>

                                {/* Details Footer */}
                                <div className="mt-8 pt-6 border-t border-gray-50 dark:border-slate-700 w-full space-y-3">
                                    <div className="flex items-center gap-3 text-gray-500 dark:text-slate-400">
                                        <Mail size={14} className="shrink-0" />
                                        <span className="text-[11px] font-bold truncate lowercase">{member.email || "No email available"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-400 dark:text-slate-500">
                                        <Calendar size={14} className="shrink-0" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            Member since {new Date(member.createdAt).getFullYear()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
                        </div>
                    ))}
                </div>

                {teamMembers.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 mb-6">
                            <User size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Team Members Found</h3>
                        <p className="text-gray-500 dark:text-slate-400 tracking-tight">The directory is currently empty.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
