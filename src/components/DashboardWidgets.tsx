import Link from "next/link";

interface StatCardProps {
    label: string;
    value: number | string;
    icon?: React.ReactNode;
    colorClass?: "blue" | "emerald" | "orange" | "purple" | "indigo";
    trend?: string;
}

export function StatCard({ label, value, icon, colorClass = "blue", trend }: StatCardProps) {
    const colors = {
        blue: {
            text: "text-blue-600",
            bg: "bg-blue-600",
            shadow: "shadow-blue-600/20",
            iconBg: "from-blue-50 to-blue-100",
            iconShadow: "shadow-blue-200/50"
        },
        emerald: {
            text: "text-emerald-600",
            bg: "bg-emerald-600",
            shadow: "shadow-emerald-600/20",
            iconBg: "from-emerald-50 to-emerald-100",
            iconShadow: "shadow-emerald-200/50"
        },
        orange: {
            text: "text-orange-600",
            bg: "bg-orange-600",
            shadow: "shadow-orange-600/20",
            iconBg: "from-orange-50 to-orange-100",
            iconShadow: "shadow-orange-200/50"
        },
        purple: {
            text: "text-purple-600",
            bg: "bg-purple-600",
            shadow: "shadow-purple-600/20",
            iconBg: "from-purple-50 to-purple-100",
            iconShadow: "shadow-purple-200/50"
        },
        indigo: {
            text: "text-indigo-600",
            bg: "bg-indigo-600",
            shadow: "shadow-indigo-600/20",
            iconBg: "from-indigo-50 to-indigo-100",
            iconShadow: "shadow-indigo-200/50"
        }
    };

    const c = colors[colorClass] || colors.blue;

    return (
        <div className={`group relative overflow-hidden rounded-[2.5rem] bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl p-8 shadow-sm border border-white dark:border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:${c.shadow}`}>
            {/* Glossy Reflection Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

            {/* Premium background gradient glow */}
            <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-[0.03] blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-[0.08] ${c.bg}`} />

            <div className="relative flex items-center justify-between gap-6">
                <div className="animate-page-fade">
                    <p className="text-[11px] font-black tracking-[0.3em] text-slate-400 dark:text-slate-500 uppercase mb-3 ml-1">{label}</p>
                    <div className="flex items-baseline gap-3">
                        <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter drop-shadow-sm leading-none">{value}</p>
                        {trend && (
                            <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-sm ${trend.startsWith('+') ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20' : 'text-slate-500 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700'
                                }`}>
                                {trend}
                            </span>
                        )}
                    </div>
                </div>

                {/* Advanced Icon Container */}
                <div className="relative">
                    <div className={`absolute inset-0 blur-2xl opacity-20 transition-all duration-500 group-hover:opacity-40 rounded-full ${c.bg}`} />
                    <div className={`relative rounded-[2rem] p-5 shadow-xl bg-gradient-to-br ${c.iconBg} dark:from-slate-800 dark:to-slate-900 border border-white dark:border-white/5 transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110 group-hover:${c.iconShadow}`}>
                        <div className={`h-9 w-9 transition-all duration-500 group-hover:scale-110 ${c.text} dark:text-blue-400 filter drop-shadow-md`}>
                            {icon}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Accent Line */}
            <div className={`absolute bottom-0 left-0 h-[4.5px] w-0 transition-all duration-700 group-hover:w-full ${c.bg} opacity-60`} />
        </div>
    );
}

export function QuickActionBtn({
    href,
    label,
    description,
    color = "blue",
    icon,
}: {
    href: string;
    label: string;
    description?: string;
    color?: "blue" | "green" | "indigo" | "orange";
    icon: React.ReactNode;
}) {
    const colorClasses = {
        blue: "from-blue-600 to-indigo-700 shadow-blue-200 hover:shadow-blue-500/40",
        green: "from-emerald-600 to-teal-700 shadow-emerald-200 hover:shadow-emerald-500/40",
        indigo: "from-indigo-600 to-violet-700 shadow-indigo-200 hover:shadow-indigo-500/40",
        orange: "from-orange-500 to-red-600 shadow-orange-200 hover:shadow-orange-500/40",
    };

    return (
        <Link
            href={href}
            className={`group relative flex w-full flex-col gap-1 rounded-[2.5rem] bg-gradient-to-br p-8 text-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:brightness-110 active:scale-95 ${colorClasses[color]}`}
        >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-inner transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110 group-hover:bg-white/30">
                <div className="h-8 w-8 text-white filter drop-shadow-md">{icon}</div>
            </div>

            <p className="font-black text-3xl tracking-tighter leading-none">{label}</p>
            {description && <p className="text-sm text-white/70 leading-relaxed font-bold mt-2 max-w-[90%] uppercase tracking-widest text-[10px]">{description}</p>}

            {/* Decorative arrow that appears on hover */}
            <div className="absolute bottom-8 right-8 opacity-0 transition-all duration-500 group-hover:translate-x-2 group-hover:opacity-100 scale-125">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
            </div>
        </Link>
    );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="mb-8 animate-page-fade">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">{title}</h3>
            {subtitle && (
                <div className="flex items-center gap-3 mt-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-blue-600/20 to-transparent dark:from-blue-400/20" />
                    <p className="text-[10px] font-black text-blue-600/40 dark:text-blue-400/40 uppercase tracking-[0.3em]">{subtitle}</p>
                </div>
            )}
        </div>
    );
}

export function EmptyState({ message, icon }: { message: string; icon?: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
            <div className="mb-6 rounded-3xl bg-slate-50 dark:bg-white/5 p-8 text-slate-300 dark:text-slate-600 shadow-inner">
                {icon || (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 opacity-50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                )}
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{message}</h4>
            <p className="mt-2 text-sm font-medium text-slate-400 dark:text-slate-500 max-w-[300px] leading-relaxed">
                We couldn't find any records matching your criteria. Try adding a new entry or clearing your filters.
            </p>
        </div>
    );
}

export function Skeleton({ className }: { className?: string }) {
    return <div className={`skeleton-shimmer rounded-xl ${className}`} />;
}
