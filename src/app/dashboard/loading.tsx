import { StatCardSkeleton, TrainingsTableSkeleton, AdminPanelSkeleton } from "@/components/DashboardSkeletons";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 transition-colors duration-300">
      {/* Sidebar placeholder — same width as the real sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 w-64 border-r border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse" />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        {/* Spacer for fixed header */}
        <div className="h-20 sm:h-24" />

        {/* Welcome Section Skeleton */}
        <div className="mb-8 sm:mb-12 flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="h-12 w-80 bg-gray-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
            <div className="h-5 w-96 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          </div>
          <div className="h-16 w-44 bg-gray-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
        </div>

        {/* Stats Row Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12 sm:mb-16">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-3 mb-10 sm:mb-12">
          <TrainingsTableSkeleton />

          {/* Quick Actions Skeleton */}
          <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-700 space-y-4">
            <div className="h-6 w-36 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            <div className="h-4 w-52 bg-gray-100 dark:bg-slate-800 rounded-lg animate-pulse mb-6" />
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-20 w-full rounded-2xl bg-gray-100 dark:bg-slate-700/50 animate-pulse"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
