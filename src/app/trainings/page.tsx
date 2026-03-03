import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/ensureSeed";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TrainingApprovalButtons } from "@/components/AdminControls";
import { DeleteTrainingButton } from "@/components/DeleteTrainingButton";
import { SectionHeader, EmptyState } from "@/components/DashboardWidgets";

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
  await ensureSeedData();

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { status } = await searchParams;
  const activeStatus: Status =
    status && ["PENDING", "APPROVED", "REJECTED"].includes(status.toUpperCase())
      ? (status.toUpperCase() as Status)
      : "ALL";

  // Use Raw SQL to fetch trainings to bypass Prisma Client schema limitations
  const rawTrainings = await (prisma as any).$queryRawUnsafe(`
    SELECT t.*, u.username as creatorUsername
    FROM Training t
    LEFT JOIN User u ON t.createdById = u.id
    ${activeStatus !== "ALL" ? `WHERE t.status = '${activeStatus}'` : ""}
    ORDER BY t.date DESC
  `) as any[];

  // Format raw results to match the expected structure
  const trainings = rawTrainings.map(t => ({
    ...t,
    date: new Date(t.date),
    createdBy: t.creatorUsername ? { username: t.creatorUsername } : null
  }));

  const isAdmin = user.role === "admin";

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar username={user.username} role={user.role} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 animate-page-fade">
        <div className="h-20 sm:h-24" />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-[1.1]">
              Trainings <span className="text-blue-600">Management</span>
            </h1>
            <p className="text-gray-500 mt-1 sm:mt-2 text-base sm:text-lg font-medium tracking-tight">Manage and review your training events & reports.</p>
          </div>
          <Link
            href="/trainings/new"
            className="rounded-2xl bg-blue-600 px-6 py-3 text-[12px] font-bold uppercase tracking-[0.2em] text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] w-fit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Training
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {STATUS_TABS.map((tab) => {
            const isActive = activeStatus === tab.value;
            const href =
              tab.value === "ALL" ? "/trainings" : `/trainings?status=${tab.value}`;
            return (
              <Link
                key={tab.value}
                href={href}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
                  }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="border-b px-6 sm:px-8 py-4 sm:py-6 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-lg sm:text-xl text-gray-900 tracking-tight">Recent Events</h3>
            <div className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.2em] border border-blue-100">
              {trainings.length} Total
            </div>
          </div>
          <div className="overflow-x-auto">
            {trainings.length === 0 ? (
              <EmptyState message={`No ${activeStatus !== "ALL" ? activeStatus.toLowerCase() : ""} trainings found.`} />
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-indigo-50/50 text-indigo-900/50 border-b border-indigo-100/50">
                  <tr>
                    <th className="px-6 sm:px-8 py-5 font-bold uppercase tracking-[0.2em] text-[10px]">Training Title</th>
                    <th className="px-6 py-5 font-bold uppercase tracking-[0.2em] text-[10px] hidden lg:table-cell">Type</th>
                    <th className="px-6 py-5 font-bold uppercase tracking-[0.2em] text-[10px]">Date & Time</th>
                    <th className="px-6 py-5 font-bold uppercase tracking-[0.2em] text-[10px] hidden md:table-cell">Venue</th>
                    <th className="px-6 py-5 font-bold uppercase tracking-[0.2em] text-[10px] hidden sm:table-cell">Created By</th>
                    <th className="px-6 py-5 font-bold uppercase tracking-[0.2em] text-[10px]">Status</th>
                    <th className="px-6 py-5 font-bold uppercase tracking-[0.2em] text-[10px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {trainings.map((t) => {
                    const isCreator = t.createdById === user.id;
                    return (
                      <tr key={t.id} className="hover:bg-blue-50/10 transition-colors even:bg-gray-50/10 group">
                        <td className="px-6 sm:px-8 py-4 sm:py-5">
                          <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-base tracking-tight leading-tight">{t.title}</div>
                          <div className="text-[11px] text-gray-400 mt-1 line-clamp-1 max-w-xs font-medium uppercase tracking-wider">{t.description}</div>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span className="inline-flex rounded-lg bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-600 border border-sky-100 uppercase tracking-[0.2em]">
                            TRAINING
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900 tracking-tight">{t.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          <div className="text-[10px] text-blue-600/60 font-bold uppercase tracking-[0.2em] mt-1.5">{(t as any).startTime || "09:00 AM"}</div>
                        </td>
                        <td className="px-6 py-4 text-[13px] text-gray-500 font-medium hidden md:table-cell tracking-tight">
                          <div className="flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-blue-300" />
                            {t.venue}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[13px] font-bold text-gray-900 hidden sm:table-cell tracking-tight">
                          {isCreator ? (
                            <span className="inline-flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                              </svg>
                              You
                            </span>
                          ) : (
                            <span className="text-gray-400 font-bold">{t.createdBy?.username || "Unknown"}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-xl px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm border ${t.status === 'APPROVED' ? 'bg-green-50 text-green-600 border-green-100' :
                              t.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                'bg-red-50 text-red-600 border-red-100'
                              }`}
                          >
                            {t.status === 'APPROVED' ? 'Approved' : t.status === 'PENDING' ? 'Pending' : 'Rejected'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {/* Visibility Logic: 
                              - Edit: Creator (Anytime) or Admin (Once Approved)
                              - Approve/Reject: Admin only (if not yet Approved)
                              - Delete: Admin (Always) or Creator (Only if Pending)
                          */}
                            {(isCreator || (isAdmin && t.status === "APPROVED")) && (
                              <Link
                                href={`/trainings/${t.id}/edit`}
                                className="rounded-xl bg-white border border-gray-100 p-2 text-gray-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all shadow-sm"
                                title="Edit Training"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                </svg>
                              </Link>
                            )}
                            {isAdmin && t.status !== "APPROVED" && (
                              <TrainingApprovalButtons trainingId={t.id} currentStatus={t.status} />
                            )}
                            {(isAdmin || (isCreator && t.status === "PENDING")) && (
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
