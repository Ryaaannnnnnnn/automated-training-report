import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/ensureSeed";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TrainingApprovalButtons } from "@/components/AdminControls";
import { DeleteTrainingButton } from "@/components/DeleteTrainingButton";
import { SectionHeader, EmptyState } from "@/components/DashboardWidgets";
import { DownloadReportButton } from "@/components/DownloadReportButton";
import { Eye } from "lucide-react";

type Status = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

const STATUS_TABS: { label: string; value: Status }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

const STATUS_STYLES: Record<string, string> = {
  APPROVED: "bg-green-500 text-white",
  PENDING: "bg-yellow-500 text-white",
  REJECTED: "bg-red-500 text-white",
};

export default async function TrainingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { status } = await searchParams;
  const activeStatus: Status =
    status && ["PENDING", "APPROVED", "REJECTED"].includes(status.toUpperCase())
      ? (status.toUpperCase() as Status)
      : "ALL";

  const isAdmin = user.role === "admin";

  const trainings = await prisma.training.findMany({
    where: {
      ...(activeStatus !== "ALL" ? { status: activeStatus as any } : {}),
      ...(isAdmin ? {} : {
        OR: [
          { status: "APPROVED" },
          { status: "PENDING" },
          { createdById: user.id }
        ]
      })
    },
    include: {
      createdBy: {
        select: { username: true }
      }
    },
    orderBy: {
      date: "desc"
    }
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-300">
      <Sidebar username={user.username} role={user.role} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 animate-page-fade">
        <div className="h-20 sm:h-24" />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="animate-page-fade">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-3">
              Trainings <span className="text-blue-600 dark:text-blue-400">Management</span>
            </h1>
            <p className="text-gray-500 dark:text-slate-400 text-base sm:text-lg font-medium max-w-xl">
              Review, monitor, and manage all organization training events and technical reports.
            </p>
          </div>
          <Link
            href="/trainings/new"
            className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-4 text-[13px] font-black uppercase tracking-[0.2em] text-white hover:shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-3 transition-all w-full sm:w-auto justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Training
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 animate-page-fade animate-stagger-1">
          {STATUS_TABS.map((tab) => {
            const isActive = activeStatus === tab.value;
            const href =
              tab.value === "ALL" ? "/trainings" : `/trainings?status=${tab.value}`;
            return (
              <Link
                key={tab.value}
                href={href}
                prefetch={false}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-[color,background-color,border-color] duration-150 border ${isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/10"
                  : "bg-white dark:bg-slate-900 text-gray-400 dark:text-slate-500 border-gray-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-700 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50/10 dark:hover:bg-blue-900/10 shadow-sm"
                  }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden mb-12 animate-page-fade animate-stagger-2">
          <div className="border-b dark:border-slate-800 px-6 sm:px-8 py-5 sm:py-7 flex justify-between items-center bg-gray-50/30 dark:bg-slate-800/20">
            <h3 className="font-black text-xl text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 15.75h16.5m-16.5 3.75h16.5" />
                </svg>
              </div>
              Organization Records
            </h3>
            <div className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black px-4 py-2 rounded-2xl uppercase tracking-[0.2em] border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
              {trainings.length} Result{trainings.length !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="overflow-x-auto">
            {trainings.length === 0 ? (
              <EmptyState message={`No ${activeStatus !== "ALL" ? activeStatus.toLowerCase() : ""} trainings found in the database system.`} />
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-[#fcfdfe] dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border-b border-gray-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 sm:px-8 py-6 font-black uppercase tracking-[0.2em] text-[10px]">Training Insight</th>
                    <th className="px-6 py-6 font-black uppercase tracking-[0.2em] text-[10px] hidden lg:table-cell">Category</th>
                    <th className="px-6 py-6 font-black uppercase tracking-[0.2em] text-[10px]">Timeline</th>
                    <th className="px-6 py-6 font-black uppercase tracking-[0.2em] text-[10px] hidden md:table-cell">Location</th>
                    <th className="px-6 py-6 font-black uppercase tracking-[0.2em] text-[10px] hidden sm:table-cell">Submitted By</th>
                    <th className="px-6 py-6 font-black uppercase tracking-[0.2em] text-[10px]">Current Status</th>
                    <th className="px-6 py-6 font-black uppercase tracking-[0.2em] text-[10px] text-right">Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {trainings.map((t, idx) => {
                    const isCreator = t.createdById === user.id;
                    return (
                      <tr
                        key={t.id}
                        className="hover:bg-blue-50/20 dark:hover:bg-blue-500/5 transition-all even:bg-slate-50/40 dark:even:bg-slate-800/20 group animate-fade-in"
                        style={{ animationDelay: `${idx * 40}ms` }}
                      >
                        <td className="px-6 sm:px-8 py-5">
                          <div className="flex flex-col">
                            <div className="font-black text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base tracking-tight leading-tight mb-1">{t.title}</div>
                            <div className="text-[11px] font-bold text-gray-400 dark:text-slate-500 line-clamp-1 max-w-xs uppercase tracking-widest">{t.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-5 hidden lg:table-cell">
                          {(() => {
                            const type = (t as any).trainingType || "Training Report";
                            const typeStyles: Record<string, string> = {
                              "Training Report": "bg-green-100/50 text-green-700 border-green-200",
                              "Provincial Report": "bg-blue-100/50 text-blue-700 border-blue-200",
                              "Activity Report": "bg-cyan-100/50 text-cyan-700 border-cyan-200",
                              "Accomplishment Report": "bg-rose-100/50 text-rose-700 border-rose-200",
                            };
                            const style = typeStyles[type] || "bg-slate-100/50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
                            return (
                              <span className={`inline-flex rounded-xl px-3 py-1.5 text-[9px] font-black border uppercase tracking-widest shadow-sm ${style}`}>
                                {type}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1.5">
                            <div className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                              </svg>
                              {t.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="text-[10px] text-blue-600/70 dark:text-blue-400/70 font-black uppercase tracking-widest pl-5">
                              {(t as any).startTime || "09:00 AM"} – {(t as any).endTime || "05:00 PM"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 hidden md:table-cell">
                          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">
                            <div className="h-2 w-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
                            {t.venue}
                          </div>
                        </td>
                        <td className="px-6 py-5 hidden sm:table-cell">
                          {isCreator ? (
                            <span className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-300 bg-blue-100/50 dark:bg-blue-500/10 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-200 dark:border-blue-800 shadow-sm shadow-blue-50 dark:shadow-none">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                              You
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-[11px]">{t.createdBy?.username || "System Admin"}</span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-sm border ${t.status === 'APPROVED' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20 shadow-emerald-50 dark:shadow-none' :
                              t.status === 'PENDING' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20 shadow-amber-50 dark:shadow-none' :
                                'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20 shadow-rose-50 dark:shadow-none'
                              }`}
                          >
                            {t.status === 'APPROVED' ? 'Approved' : t.status === 'PENDING' ? 'Pending' : 'Rejected'}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-3 scale-90 sm:scale-100 origin-right">
                            <Link
                              href={`/trainings/${t.id}`}
                              className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2.5 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all shadow-sm group/btn"
                              title="View Professional Report"
                            >
                               <Eye className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                            </Link>

                            <DownloadReportButton training={t} />

                            {(isCreator || isAdmin) && (
                              <Link
                                href={`/trainings/${t.id}/edit`}
                                className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2.5 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all shadow-sm group/btn"
                                title="Modify Training Data"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover/btn:scale-110 transition-transform">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                              </Link>
                            )}
                            {isAdmin && t.status !== "APPROVED" && (
                              <TrainingApprovalButtons trainingId={t.id} currentStatus={t.status} />
                            )}
                            {(isCreator || isAdmin) && (
                              <DeleteTrainingButton trainingId={t.id} variant="small" />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
