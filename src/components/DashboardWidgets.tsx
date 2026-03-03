import Link from "next/link";

interface StatCardProps {
    label: string;
    value: number | string;
    icon?: React.ReactNode;
    colorClass?: string;
    trend?: string;
}

export function StatCard({ label, value, icon, colorClass = "text-blue-600", trend }: StatCardProps) {
    const bgClass = colorClass.replace('text-', 'bg-');
    const shadowClass = colorClass.replace('text-', 'shadow-');

    return (
        <div className={`group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:${shadowClass}/20`}>
            {/* Glossy Reflection Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Soft decorative background gradient */}
            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-5 transition-transform duration-500 group-hover:scale-150 ${bgClass}`} />

            <div className="relative flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-indigo-900/40 uppercase">{label}</p>
                    <div className="mt-2 flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
                        {trend && (
                            <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${trend.startsWith('+') ? 'text-green-600 bg-green-50 border border-green-100' : 'text-gray-600 bg-gray-50 border border-gray-100'
                                }`}>
                                {trend}
                            </span>
                        )}
                    </div>
                </div>
                <div className={`rounded-xl p-3 shadow-inner bg-opacity-10 transition-all duration-300 group-hover:bg-opacity-20 group-hover:rotate-3 ${bgClass}`}>
                    <div className={`h-7 w-7 transition-all duration-300 group-hover:scale-110 group-hover:filter group-hover:drop-shadow-sm ${colorClass}`}>{icon}</div>
                </div>
            </div>
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
        blue: "from-blue-600 to-blue-700 shadow-blue-200 hover:shadow-blue-300",
        green: "from-emerald-600 to-emerald-700 shadow-emerald-200 hover:shadow-emerald-300",
        indigo: "from-indigo-600 to-indigo-700 shadow-indigo-200 hover:shadow-indigo-300",
        orange: "from-orange-500 to-orange-600 shadow-orange-200 hover:shadow-orange-300",
    };

    return (
        <Link
            href={href}
            className={`group relative flex w-full flex-col gap-1 rounded-2xl bg-gradient-to-br p-5 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:brightness-110 ${colorClasses[color]}`}
        >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                <div className="h-6 w-6 text-white">{icon}</div>
            </div>
            <p className="font-bold text-xl tracking-tight">{label}</p>
            {description && <p className="text-sm text-white/90 leading-relaxed font-medium mt-0.5">{description}</p>}

            {/* Decorative arrow that appears on hover */}
            <div className="absolute top-5 right-5 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
            </div>
        </Link>
    );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h3>
            {subtitle && <p className="text-[10px] font-bold text-blue-600/60 mt-1.5 uppercase tracking-[0.2em]">{subtitle}</p>}
        </div>
    );
}

export function EmptyState({ message, icon }: { message: string; icon?: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="mb-4 rounded-full bg-gray-50 p-6 text-gray-300">
                {icon || (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                )}
            </div>
            <p className="text-lg font-semibold text-gray-900">{message}</p>
            <p className="mt-1 text-sm font-medium text-gray-400 max-w-[250px]">Try adjusting your search or add a new record to get started.</p>
        </div>
    );
}
