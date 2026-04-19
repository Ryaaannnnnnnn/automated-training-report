import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TrainingsClient } from "@/components/TrainingsClient";

export default async function TrainingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const isAdmin = user.role === "admin";

  // Fetch all relevant trainings at once to allow instant client-side filtering
  const trainings = await prisma.training.findMany({
    where: {
      ...(isAdmin ? {} : { createdById: user.id })
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
      <Sidebar username={user.username} role={user.role} avatarUrl={user.avatarUrl} />

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

        <TrainingsClient 
          trainings={trainings} 
          currentUser={{ id: user.id, username: user.username, role: user.role }} 
          isAdmin={isAdmin} 
        />
      </main>
    </div>
  );
}

