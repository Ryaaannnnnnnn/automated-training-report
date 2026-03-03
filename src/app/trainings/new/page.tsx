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
    <div className="min-h-screen bg-gray-50">
      <Sidebar username={user.username} role={user.role} />

      <main className="mx-auto max-w-3xl px-6 py-10 pt-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/trainings"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Trainings
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">New Training</h1>
            <p className="text-gray-600">Create a new training record.</p>
          </div>
        </div>

        <NewTrainingForm />
      </main>
    </div>
  );
}
