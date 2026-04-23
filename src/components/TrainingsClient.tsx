"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { TrainingApprovalButtons } from "@/components/AdminControls";
import { DeleteTrainingButton } from "@/components/DeleteTrainingButton";
import { EmptyState } from "@/components/DashboardWidgets";
import { DownloadReportButton } from "@/components/DownloadReportButton";

type Status = "ALL" | "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";

const STATUS_TABS: { label: string; value: Status }[] = [
  { label: "All", value: "ALL" },
  { label: "Draft", value: "DRAFT" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

interface TrainingsClientProps {
  trainings: any[];
  currentUser: {
    id: string;
    username: string;
    role: string;
  };
  isAdmin: boolean;
}

export function TrainingsClient({ trainings, currentUser, isAdmin }: TrainingsClientProps) {
  const [activeStatus, setActiveStatus] = useState<Status>("ALL");

  const filteredTrainings = useMemo(() => {
    if (activeStatus === "ALL") return trainings;
    return trainings.filter((t) => t.status === activeStatus);
  }, [trainings, activeStatus]);

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 animate-page-fade animate-stagger-1">
        {STATUS_TABS.map((tab) => {
          const isActive = activeStatus === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveStatus(tab.value)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-200 border ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/10"
                  : "bg-white dark:bg-slate-900 text-gray-400 dark:text-slate-500 border-gray-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-700 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50/10 dark:hover:bg-blue-900/10 shadow-sm"
              }`}
            >
              {tab.label}
            </button>
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
            {filteredTrainings.length} Result{filteredTrainings.length !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="overflow-x-auto">
          {filteredTrainings.length === 0 ? (
            <EmptyState message={`No ${activeStatus !== "ALL" ? activeStatus.toLowerCase() : ""} trainings found in the database system.`} />
          ) : (
            <>
              {/* Desktop Table View */}
              <table className="w-full text-left text-sm hidden md:table">
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
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                  {filteredTrainings.map((t) => {
                    const isCreator = t.createdById === currentUser.id;
                    const trainingDate = new Date(t.date);
                    
                    return (
                      <tr
                        key={t.id}
                        className="hover:bg-blue-50/20 dark:hover:bg-blue-500/5 transition-all even:bg-slate-50/40 dark:even:bg-slate-800/20 group antialiased"
                      >
                        <td className="px-6 sm:px-8 py-5">
                          <div className="flex flex-col">
                            <div className="font-black text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base tracking-tight leading-tight mb-1">{t.title}</div>
                            <div className="text-[11px] font-bold text-gray-400 dark:text-slate-500 line-clamp-1 max-w-xs uppercase tracking-widest">{t.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-5 hidden lg:table-cell">
                          {(() => {
                            const type = t.trainingType || "Training Report";
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
                              {trainingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="text-[10px] text-blue-600/70 dark:text-blue-400/70 font-black uppercase tracking-widest pl-5">
                              {t.startTime || "09:00 AM"} – {t.endTime || "05:00 PM"}
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
                                t.status === 'DRAFT' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700' :
                                  'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20 shadow-rose-50 dark:shadow-none'
                              }`}
                          >
                            {t.status === 'APPROVED' ? 'Approved' : t.status === 'PENDING' ? 'Pending' : t.status === 'DRAFT' ? 'Draft' : 'Rejected'}
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

                            {t.status !== "DRAFT" && <DownloadReportButton training={t} />}

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
                            {isAdmin && t.status === "PENDING" && (
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

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-100 dark:divide-slate-800">
                {filteredTrainings.map((t) => {
                  const isCreator = t.createdById === currentUser.id;
                  const trainingDate = new Date(t.date);
                  
                  return (
                    <div key={t.id} className="p-6 bg-white dark:bg-slate-900 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h4 className="font-black text-gray-900 dark:text-white leading-tight">{t.title}</h4>
                          <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest line-clamp-2 italic">"{t.description}"</p>
                        </div>
                        <span
                          className={`shrink-0 inline-flex rounded-xl px-2.5 py-1 text-[9px] font-black uppercase tracking-widest shadow-sm border ${t.status === 'APPROVED' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' :
                            t.status === 'PENDING' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20' :
                              t.status === 'DRAFT' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700' :
                                'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20'
                            }`}
                        >
                          {t.status === 'APPROVED' ? 'Approved' : t.status === 'PENDING' ? 'Pending' : t.status === 'DRAFT' ? 'Draft' : 'Rejected'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Timeline</p>
                          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            {trainingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-[9px] font-black text-blue-500/70">{t.startTime || "09:00 AM"} – {t.endTime || "05:00 PM"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 line-clamp-1">{t.venue}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-800/50">
                        <div className="flex items-center gap-2">
                          {isCreator ? (
                            <span className="inline-flex items-center gap-1.5 text-blue-700/80 dark:text-blue-300/80 text-[9px] font-black uppercase tracking-widest">
                              <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                              You
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[9px]">{t.createdBy?.username || "Admin"}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/trainings/${t.id}`}
                            className="bg-gray-50 dark:bg-slate-800 p-2 rounded-lg text-slate-400"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {t.status !== "DRAFT" && <DownloadReportButton training={t} />}
                          {(isCreator || isAdmin) && (
                            <Link
                              href={`/trainings/${t.id}/edit`}
                              className="bg-gray-50 dark:bg-slate-800 p-2 rounded-lg text-slate-400"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                              </svg>
                            </Link>
                          )}
                          {isAdmin && t.status === "PENDING" && (
                            <TrainingApprovalButtons trainingId={t.id} currentStatus={t.status} />
                          )}
                          {(isCreator || isAdmin) && (
                            <DeleteTrainingButton trainingId={t.id} variant="small" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
