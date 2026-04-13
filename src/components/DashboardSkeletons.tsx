"use client";

import { Skeleton } from "./DashboardWidgets";

export function StatCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl p-8 shadow-sm border border-white dark:border-white/10">
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1">
          <Skeleton className="h-3 w-24 mb-3" />
          <Skeleton className="h-12 w-16" />
        </div>
        <Skeleton className="h-16 w-16 rounded-[2rem]" />
      </div>
      <div className="absolute bottom-0 left-0 h-[4.5px] w-full bg-slate-100 dark:bg-slate-800" />
    </div>
  );
}

export function TrainingsTableSkeleton() {
  return (
    <div className="lg:col-span-2 overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="border-b border-gray-100 dark:border-slate-700 px-6 sm:px-8 py-4 sm:py-6 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/80">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-indigo-50/50 dark:bg-slate-700/50 border-b border-indigo-100/50 dark:border-slate-700">
            <tr>
              <th className="px-6 sm:px-8 py-5"><Skeleton className="h-3 w-20" /></th>
              <th className="px-6 py-5"><Skeleton className="h-3 w-20" /></th>
              <th className="px-6 py-5 text-right"><Skeleton className="h-3 w-16 ml-auto" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                <td className="px-6 sm:px-8 py-4 sm:py-5">
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-3 w-60" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-2 w-12" />
                </td>
                <td className="px-6 py-4 text-right">
                  <Skeleton className="h-6 w-16 rounded-xl ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminPanelSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div className="border-b border-gray-100 dark:border-slate-700 px-6 py-4 bg-gray-50/20 dark:bg-slate-700/20">
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="p-4 sm:p-6 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16 rounded-xl" />
              <Skeleton className="h-8 w-16 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuickActionSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-700">
      <Skeleton className="h-6 w-32 mb-4" />
      <Skeleton className="h-3 w-48 mb-8" />
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50 p-8 border border-slate-100 dark:border-slate-800">
            <Skeleton className="h-16 w-16 rounded-2xl mb-6" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-48" />
          </div>
        ))}
      </div>
    </div>
  );
}
