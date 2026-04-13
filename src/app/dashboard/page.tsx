export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { SectionHeader } from "@/components/DashboardWidgets";
import { Suspense } from "react";
import { 
  StatCardSkeleton, 
  TrainingsTableSkeleton, 
  AdminPanelSkeleton, 
  QuickActionSkeleton 
} from "@/components/DashboardSkeletons";
import { 
  DashboardStats, 
  RecentTrainingsList, 
  AdminPanels 
} from "./DashboardSections";
import { QuickActionBtn } from "@/components/DashboardWidgets";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 transition-colors duration-300">
      <Sidebar username={user.username} role={user.role} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 animate-page-fade">
        {/* Spacer for fixed header */}
        <div className="h-20 sm:h-24" />

        {/* Welcome Section */}
        <div className="mb-8 sm:mb-12 flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="animate-page-fade">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
              {greeting}, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">{user.username}</span>!
            </h1>
            <p className="text-gray-500 dark:text-slate-400 mt-3 text-lg font-medium max-w-2xl">
              Welcome back to the <span className="text-blue-600 dark:text-blue-400 font-bold">Automated Training Report</span> system.
              Here is your overview for today.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 pr-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 animate-fade-in group hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-2xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 shadow-inner">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
            </div>
            <div>
              <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-none">System Status</span>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-1 uppercase tracking-wider">Online</p>
            </div>
          </div>
        </div>

        {/* Stats Row - Streamed */}
        <Suspense fallback={
          <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12 sm:mb-16">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        }>
          <DashboardStats userRole={user.role} />
        </Suspense>

        {/* Main Content Grid: Recent Trainings & Quick Actions */}
        <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-3 mb-10 sm:mb-12">
          {/* Recent Trainings - Streamed */}
          <Suspense fallback={<TrainingsTableSkeleton />}>
            <RecentTrainingsList userId={user.id} userRole={user.role} />
          </Suspense>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6 sm:space-y-8">
            <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-700">
              <SectionHeader
                title="Quick Actions"
                subtitle="Execute common tasks instantly"
              />
              <div className="space-y-4">
                <QuickActionBtn
                  href="/trainings/new"
                  label="Add Training"
                  description="Create a new event record and notify participants."
                  color="blue"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  }
                />

                {user.role === "admin" && (
                  <QuickActionBtn
                    href="/dashboard/users"
                    label="Manage Users"
                    description="Review registrations and approve new staff access."
                    color="indigo"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Admin Sections (if admin) - Streamed */}
        {user.role === "admin" && (
          <div className="space-y-8 sm:space-y-10 border-t border-gray-100 dark:border-slate-700 pt-10 sm:pt-12">
            <SectionHeader
              title="Administrative Controls"
              subtitle="Manage system access and review pending submissions"
            />
            <Suspense fallback={
              <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
                <AdminPanelSkeleton />
                <AdminPanelSkeleton />
              </div>
            }>
              <AdminPanels />
            </Suspense>
          </div>
        )}
      </main>
    </div>
  );
}

