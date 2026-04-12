import { Sidebar } from "@/components/Sidebar";
import { Skeleton } from "@/components/DashboardWidgets";

export default function TrainingsLoading() {
    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Sidebar username="..." role="staff" />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
                <div className="h-20 sm:h-24" />

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
                    <div className="space-y-3">
                        <Skeleton className="h-10 w-64 rounded-xl" />
                        <Skeleton className="h-6 w-96 rounded-lg opacity-60" />
                    </div>
                    <Skeleton className="h-12 w-40 rounded-2xl" />
                </div>

                {/* Filter Tabs Skeleton */}
                <div className="flex gap-2 mb-8">
                    <Skeleton className="h-9 w-16 rounded-xl" />
                    <Skeleton className="h-9 w-24 rounded-xl opacity-80" />
                    <Skeleton className="h-9 w-24 rounded-xl opacity-60" />
                    <Skeleton className="h-9 w-24 rounded-xl opacity-40" />
                </div>

                <div className="rounded-3xl bg-white shadow-sm border border-gray-100 overflow-hidden mb-12">
                    <div className="border-b px-8 py-6 flex justify-between items-center bg-gray-50/30">
                        <Skeleton className="h-7 w-48 rounded-lg" />
                        <Skeleton className="h-8 w-24 rounded-full" />
                    </div>
                    <div className="p-8 space-y-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between gap-6 border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                                <div className="space-y-3 flex-1">
                                    <Skeleton className="h-6 w-1/3 rounded-lg" />
                                    <Skeleton className="h-4 w-2/3 rounded-md opacity-50" />
                                </div>
                                <div className="space-y-3 w-32 hidden md:block">
                                    <Skeleton className="h-5 w-full rounded-md opacity-70" />
                                    <Skeleton className="h-3 w-2/3 rounded-sm opacity-40" />
                                </div>
                                <Skeleton className="h-8 w-24 rounded-xl" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-10 w-10 rounded-xl opacity-30" />
                                    <Skeleton className="h-10 w-10 rounded-xl opacity-30" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
