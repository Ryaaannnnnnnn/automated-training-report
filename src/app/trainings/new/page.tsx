import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { NewTrainingForm } from "./NewTrainingForm";
import { ArrowLeft } from "lucide-react";

export default async function NewTrainingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300">
      <Sidebar username={user.username} role={user.role} />

      <main className="mx-auto max-w-3xl px-6 py-10 pt-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/trainings"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-100 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/40 transition-all group shadow-sm active:scale-95 mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              Back to Trainings
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">New Training</h1>
            <p className="text-gray-600 dark:text-slate-400">Create a new training record.</p>
          </div>
        </div>

        <NewTrainingForm />
      </main>
    </div>
  );
}
