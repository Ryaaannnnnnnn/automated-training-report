"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";

const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        label: "Trainings",
        href: "/trainings",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
            </svg>
        ),
    },
    {
        label: "Add Training",
        href: "/trainings/new",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
        ),
    },
    {
        label: "Our Team",
        href: "/team",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
        ),
    },
];

const adminItems = [
    {
        label: "User Management",
        href: "/dashboard/users",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
        ),
    },
];

const systemItems = [
    {
        label: "Profile",
        href: "/profile",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        label: "About Us",
        href: "/about",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
        ),
    },
];

interface SidebarProps {
    username?: string;
    role?: string;
    avatarUrl?: string | null;
}

export function Sidebar({ username, role, avatarUrl }: SidebarProps) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Close sidebar when route changes
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    // Close on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    return (
        <>
            {/* ── TOP NAVBAR BAR ── */}
            <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-16 px-4 bg-[#0f2044] dark:bg-[#0c1a36] shadow-lg border-b border-white/5 text-slate-100">
                {/* Left: Hamburger + Logo */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setOpen(true)}
                        aria-label="Open menu"
                        className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                    >
                        {/* Hamburger icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="white" className="w-6 h-6 sm:w-5 sm:h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.24 50.552 50.552 0 00-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                            </svg>
                        </div>
                        <span className="text-white font-black text-[14px] sm:text-[13px] tracking-tight hidden sm:block leading-[1.1]">
                            Automated Training<br />
                            <span className="font-bold text-blue-300/80 text-[10px] uppercase tracking-wider">Management & Reporting</span>
                        </span>
                    </div>
                </div>

                {/* Right: User Greeting */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    {username && (
                        <div className="hidden sm:flex items-center gap-2 text-sm text-white border-l border-white/10 pl-4">
                            {avatarUrl ? (
                                <div className="relative w-8 h-8 rounded-full overflow-hidden shadow border border-white/20">
                                    <Image
                                        src={avatarUrl}
                                        alt={username || "User"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm uppercase shadow">
                                    {username?.charAt(0)}
                                </div>
                            )}
                            <div className="text-right leading-tight">
                                <p className="text-[10px] font-bold text-blue-300/60 uppercase tracking-widest">Hi,</p>
                                <p className="font-semibold capitalize text-sm">{username}</p>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* ── OVERLAY ── */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* ── SIDEBAR DRAWER ── */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#0f2044] dark:bg-[#0c1a36] text-white flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out border-r border-white/5 ${open ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="white" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.24 50.552 50.552 0 00-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                            </svg>
                        </div>
                        <span className="text-sm font-bold leading-tight tracking-tight">ATMRS</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <button
                            onClick={() => setOpen(false)}
                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                            aria-label="Close menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* User Profile Area */}
                {username && (
                    <div className="px-5 py-4 border-b border-white/10 bg-white/5">
                        <div className="flex items-center gap-3">
                            {avatarUrl ? (
                                <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-lg border border-white/10">
                                    <Image
                                        src={avatarUrl}
                                        alt={username || "User"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-base uppercase shadow-lg">
                                    {username?.charAt(0)}
                                </div>
                            )}
                            <div>
                                <p className="font-bold capitalize text-sm tracking-tight">{username}</p>
                                <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold mt-1 uppercase tracking-wider ${role === "admin"
                                    ? "bg-orange-500/20 text-orange-300"
                                    : "bg-blue-500/20 text-blue-300"
                                    }`}>
                                    {role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    {/* Main nav */}
                    <div className="mb-6">
                        <p className="px-3 mb-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400/60">Main</p>
                        <ul className="space-y-1">
                            {navItems.map((item) => {
                                const isActive =
                                    item.href === "/dashboard"
                                        ? pathname === "/dashboard"
                                        : item.href === "/trainings"
                                            ? pathname === "/trainings"
                                            : item.href === "/trainings/new"
                                                ? pathname === "/trainings/new" || pathname.startsWith("/trainings/new")
                                                : pathname.startsWith(item.href);
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${isActive
                                                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)] font-bold"
                                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                                }`}
                                        >
                                            <span className={isActive ? "text-white" : "text-slate-400 group-hover:text-white transition-colors"}>
                                                {item.icon}
                                            </span>
                                            {item.label}
                                            {isActive && (
                                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Admin nav */}
                    {role === "admin" && (
                        <div className="mb-6">
                            <p className="px-3 mb-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400/60">Admin</p>
                            <ul className="space-y-1">
                                {adminItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${isActive
                                                    ? "bg-indigo-600 text-white shadow-md"
                                                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                                                    }`}
                                            >
                                                <span className={isActive ? "text-white" : "text-slate-400 group-hover:text-white transition-colors"}>
                                                    {item.icon}
                                                </span>
                                                {item.label}
                                                {isActive && (
                                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    {/* System nav */}

                    <div>
                        <p className="px-3 mb-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400/60">System</p>
                        <ul className="space-y-1">
                            {systemItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${isActive
                                                ? "bg-indigo-600 text-white shadow-md font-bold"
                                                : "text-slate-300/80 hover:bg-white/10 hover:text-white"
                                                }`}
                                        >
                                            <span className={isActive ? "text-white" : "text-slate-400 group-hover:text-white transition-colors"}>
                                                {item.icon}
                                            </span>
                                            {item.label}
                                            {isActive && (
                                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </nav>

                {/* Logout at bottom */}
                <div className="px-4 py-4 border-t border-white/10 bg-black/20">
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-red-400 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        <LogoutButton />
                    </div>
                </div>
            </aside>
        </>
    );
}
