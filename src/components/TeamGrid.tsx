"use client";

import { useState, useMemo } from "react";
import { User, Shield, Search, Mail, Calendar } from "lucide-react";
import Image from "next/image";

interface TeamMember {
    id: string;
    username: string;
    email: string | null;
    role: string;
    avatarUrl: string | null;
    createdAt: Date;
    lastActive: Date;
}

interface TeamGridProps {
    members: TeamMember[];
}

export function TeamGrid({ members }: TeamGridProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredMembers = useMemo(() => {
        return members.filter(member => 
            member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.role.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [members, searchQuery]);

    const isOnline = (lastActive: Date) => {
        const now = new Date();
        const lastActiveDate = new Date(lastActive);
        const diffInMinutes = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60);
        return diffInMinutes < 5;
    };

    return (
        <div className="space-y-12">
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto md:mx-0 group animate-page-fade">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <Search size={22} strokeWidth={2.5} />
                </div>
                <input
                    type="text"
                    placeholder="Search by name or role..."
                    className="block w-full pl-16 pr-6 py-5 bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-[2rem] text-lg text-gray-900 dark:text-slate-100 focus:ring-8 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-slate-600 shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {filteredMembers.map((member, idx) => {
                    const online = isOnline(member.lastActive);
                    return (
                        <div 
                            key={member.id}
                            className="group relative rounded-[2.5rem] border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500 animate-fade-in"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="flex flex-col items-center">
                                {/* Avatar Container */}
                                <div className="relative mb-6">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-500 border-4 border-white dark:border-slate-800 relative">
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
                                    
                                    {/* Online/Offline Status Indicator */}
                                    <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-2xl shadow-lg border-4 border-white dark:border-slate-800 transition-all duration-500 ${online ? "bg-emerald-500 scale-110" : "bg-slate-400"}`}>
                                        <div className={`w-3 h-3 rounded-full ${online ? "bg-white animate-pulse" : "bg-white/50"}`} />
                                    </div>

                                    {/* Role Badge Overlay */}
                                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white p-2 rounded-2xl shadow-lg border-4 border-white dark:border-slate-800 z-10 group-hover:scale-110 transition-transform">
                                        <Shield size={14} strokeWidth={3} />
                                    </div>
                                </div>

                                {/* Text Info */}
                                <div className="text-center space-y-2">
                                    <div className="flex items-center justify-center gap-2">
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white capitalize tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {member.username}
                                        </h3>
                                    </div>
                                    <div className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-500/20">
                                        {member.role}
                                    </div>
                                </div>

                                {/* Status Label */}
                                <div className={`text-[9px] font-black uppercase tracking-[0.2em] mt-3 ${online ? "text-emerald-500 animate-pulse" : "text-slate-400"}`}>
                                    {online ? "Online Now" : "Currently Offline"}
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
                                            Member since {new Date(member.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
                        </div>
                    );
                })}
            </div>

            {filteredMembers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center animate-page-fade">
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 mb-6 border-2 border-dashed border-gray-200 dark:border-slate-700">
                        <User size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No results found</h3>
                    <p className="text-gray-500 dark:text-slate-400 tracking-tight">Try adjusting your search terms.</p>
                </div>
            )}
        </div>
    );
}
