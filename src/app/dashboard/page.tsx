import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/ensureSeed";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserApprovalButtons, TrainingApprovalButtons } from "@/components/AdminControls";
import { DeleteTrainingButton } from "@/components/DeleteTrainingButton";
import { DeleteUserButton } from "@/components/DeleteUserButton";
import { ResetPasswordButton } from "@/components/ResetPasswordButton";
import { Sidebar } from "@/components/Sidebar";
import { StatCard, QuickActionBtn, SectionHeader, EmptyState } from "@/components/DashboardWidgets";
import Link from "next/link";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [trainingsCount, pendingTrainingsCount, totalStaffCount] = await Promise.all([
    prisma.training.count({ where: { status: "APPROVED" } }),
    prisma.training.count({
      where: {
        status: "PENDING"
      }
    }),
    prisma.user.count({ where: { role: "staff" } })
  ]);

  // Fetch recent trainings with visibility rules
  const recentTrainings = await prisma.training.findMany({
    take: 5,
    where: user.role === "admin" ? {} : {
      OR: [
        { status: "APPROVED" },
        { status: "PENDING" },
        { createdById: user.id }
      ]
    },
    orderBy: { date: "desc" },
    include: { createdBy: true },
  });

  // Admin-only data
  const pendingUsers =
    user.role === "admin"
      ? await prisma.user.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
      })
      : [];

  const pendingTrainings =
    user.role === "admin"
      ? await prisma.training.findMany({
        where: { status: "PENDING" },
        include: { createdBy: true },
        orderBy: { createdAt: "desc" },
      })
      : [];

  const approvedUsers =
    user.role === "admin"
      ? await prisma.user.findMany({
        where: { role: "staff", status: "APPROVED" },
        orderBy: { username: "asc" },
      })
      : [];

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

        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12 sm:mb-16">
          <StatCard
            label="Approved Trainings"
            value={trainingsCount}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
              </svg>
            }
            colorClass="emerald"
          />
          <StatCard
            label={user.role === "admin" ? "Pending Approvals" : "Awaiting Review"}
            value={pendingTrainingsCount}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            }
            colorClass="orange"
          />
          <StatCard
            label="Total Staff"
            value={totalStaffCount}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            }
            colorClass="blue"
          />
        </div>

        {/* Mian Content Grid: Recent Trainings & Quick Actions */}
        <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-3 mb-10 sm:mb-12">
          {/* Recent Trainings Table */}
          <div className="lg:col-span-2 overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="border-b border-gray-100 dark:border-slate-700 px-6 sm:px-8 py-4 sm:py-6 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/80">
              <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white tracking-tight">Recent Trainings</h3>
              <div className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.2em] border border-blue-100 dark:border-blue-500/20">
                {pendingTrainingsCount} Pending
              </div>
            </div>
            <div className="p-0 overflow-x-auto">
              {recentTrainings.length === 0 ? (
                <EmptyState message="No trainings found in the records." />
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-indigo-50/50 dark:bg-slate-700/50 text-indigo-900/50 dark:text-slate-400 border-b border-indigo-100/50 dark:border-slate-700">
                    <tr>
                      <th className="px-6 sm:px-8 py-5 font-bold uppercase tracking-[0.2em] text-[10px]">Training Title</th>
                      <th className="px-6 py-5 font-bold uppercase tracking-[0.2em] text-[10px]">Date & Time</th>
                      <th className="px-6 py-5 font-bold uppercase tracking-[0.2em] text-[10px] text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                    {recentTrainings.map((t) => (
                      <tr key={t.id} className="hover:bg-blue-50/10 dark:hover:bg-blue-500/5 transition-colors even:bg-gray-50/10 dark:even:bg-slate-700/20 group">
                        <td className="px-6 sm:px-8 py-4 sm:py-5">
                          <div className="font-bold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base tracking-tight leading-tight">{t.title}</div>
                          <div className="text-[11px] text-gray-400 dark:text-slate-500 mt-1 line-clamp-1 max-w-xs font-medium uppercase tracking-wider">{t.description}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900 dark:text-slate-100 tracking-tight">{t.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          <div className="text-[10px] text-blue-600/60 dark:text-blue-400/60 font-bold uppercase tracking-[0.2em] mt-1.5">{(t as any).startTime || "09:00 AM"}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`inline-flex rounded-xl px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm border ${t.status === 'APPROVED' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-100 dark:border-green-500/20' :
                              t.status === 'PENDING' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20' :
                                'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20'
                              }`}
                          >
                            {t.status === 'APPROVED' ? 'Approved' : t.status === 'PENDING' ? 'Pending' : 'Rejected'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="border-t border-gray-100 dark:border-slate-700 px-8 py-4 text-center bg-white dark:bg-slate-800/50">
              <Link href="/trainings" className="text-[12px] font-bold uppercase tracking-[0.15em] text-blue-600/80 dark:text-blue-400/80 hover:text-blue-600 dark:hover:text-blue-300 transition-all hover:gap-3 flex items-center justify-center gap-2">
                Explore All Trainings
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>

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

        {/* Admin Sections (if admin) */}
        {user.role === "admin" && (
          <div className="space-y-8 sm:space-y-10 border-t border-gray-100 dark:border-slate-700 pt-10 sm:pt-12">
            <SectionHeader
              title="Administrative Controls"
              subtitle="Manage system access and review pending submissions"
            />

            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
              {/* Pending Staff Section */}
              <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition-all hover:shadow-md">
                <div className="border-b border-gray-100 dark:border-slate-700 px-6 py-4 bg-red-50/20 dark:bg-red-500/5">
                  <h2 className="font-bold text-red-900/60 dark:text-red-400/60 flex items-center gap-2 uppercase tracking-[0.2em] text-[10px]">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    Pending Staff Approvals
                  </h2>
                </div>
                <div className="p-0">
                  {pendingUsers.length === 0 ? (
                    <EmptyState message="No pending registrations at the moment." />
                  ) : (
                    <ul className="divide-y divide-gray-50 dark:divide-slate-700/50">
                      {pendingUsers.map((u) => (
                        <li key={u.id} className="flex items-center justify-between p-4 sm:p-6 bg-white dark:bg-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-slate-100 capitalize text-base tracking-tight">{u.username}</p>
                            <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">{u.email || "No email provided"}</p>
                          </div>
                          <UserApprovalButtons userId={u.id} currentStatus={u.status} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Pending Trainings Section */}
              <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition-all hover:shadow-md">
                <div className="border-b border-gray-100 dark:border-slate-700 px-6 py-4 bg-orange-50/20 dark:bg-orange-500/5">
                  <h2 className="font-bold text-orange-900/60 dark:text-orange-400/60 flex items-center gap-2 uppercase tracking-[0.2em] text-[10px]">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                    Training Submissions
                  </h2>
                </div>
                <div className="p-0">
                  {pendingTrainings.length === 0 ? (
                    <EmptyState message="No pending training records found." />
                  ) : (
                    <ul className="divide-y divide-gray-50 dark:divide-slate-700/50">
                      {pendingTrainings.map((t) => (
                        <li key={t.id} className="flex flex-col gap-3 p-4 sm:p-6 bg-white dark:bg-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="max-w-[70%]">
                              <p className="font-bold text-gray-900 dark:text-slate-100 leading-tight tracking-tight">{t.title}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded uppercase tracking-wider border border-blue-100 dark:border-blue-500/20">{t.createdBy?.username ?? "System"}</span>
                                <span className="text-[9px] text-gray-400 dark:text-slate-500 font-bold tracking-widest uppercase">• {t.date.toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Link
                                href={`/trainings/${t.id}/edit`}
                                className="rounded-xl bg-white dark:bg-slate-700 border border-gray-100 dark:border-slate-600 p-2 text-gray-400 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-100 dark:hover:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all shadow-sm"
                                title="Edit Training"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                </svg>
                              </Link>
                              <TrainingApprovalButtons trainingId={t.id} currentStatus={t.status} />
                              <DeleteTrainingButton trainingId={t.id} variant="small" />
                            </div>
                          </div>
                          <p className="text-[11px] text-gray-400 dark:text-slate-500 line-clamp-2 leading-relaxed italic border-t border-gray-50 dark:border-slate-800 pt-3">"{t.description}"</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Active Staff Management */}
              <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm md:col-span-2 transition-all hover:shadow-md">
                <div className="border-b border-gray-100 dark:border-slate-700 px-6 sm:px-8 py-4 sm:py-5 bg-indigo-50/10 dark:bg-indigo-500/5">
                  <h2 className="font-bold text-lg sm:text-xl text-indigo-900 dark:text-indigo-400 tracking-tight flex items-center gap-2 leading-none">
                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                    Manage Active Staff
                  </h2>
                </div>
                <div className="p-0">
                  {approvedUsers.length === 0 ? (
                    <EmptyState message="No active staff members currently registered." />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-indigo-50/50 dark:bg-slate-700/50 text-indigo-900/50 dark:text-slate-400 border-b border-indigo-100/50 dark:border-slate-700">
                          <tr>
                            <th className="px-6 sm:px-8 py-5 font-bold uppercase tracking-[0.2em] text-[10px]">Staff Member</th>
                            <th className="px-6 sm:px-8 py-5 font-bold uppercase tracking-[0.2em] text-[10px] hidden sm:table-cell">Joined Date</th>
                            <th className="px-6 sm:px-8 py-5 font-bold uppercase tracking-[0.2em] text-[10px]">Security Control</th>
                            <th className="px-6 sm:px-8 py-5 font-bold uppercase tracking-[0.2em] text-[10px] text-right">Administrative</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                          {approvedUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-blue-50/10 dark:hover:bg-blue-500/5 transition-colors even:bg-gray-50/10 dark:even:bg-slate-700/20">
                              <td className="px-6 sm:px-8 py-4 sm:py-5 font-bold text-gray-900 dark:text-slate-100 tracking-tight">
                                {u.username}
                                <div className="sm:hidden text-[10px] font-bold text-gray-400 dark:text-slate-500 mt-1 uppercase tracking-wider">Joined {u.createdAt.toLocaleDateString()}</div>
                              </td>
                              <td className="px-6 sm:px-8 py-4 sm:py-5 text-gray-400 dark:text-slate-500 font-medium hidden sm:table-cell text-xs">{u.createdAt.toLocaleDateString('en-US', { dateStyle: 'medium' })}</td>
                              <td className="px-6 sm:px-8 py-4 sm:py-5">
                                <ResetPasswordButton userId={u.id} username={u.username} />
                              </td>
                              <td className="px-6 sm:px-8 py-4 sm:py-5 text-right">
                                <DeleteUserButton userId={u.id} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
