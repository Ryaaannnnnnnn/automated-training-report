import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { ProfileForm } from "./ProfileForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ProfilePage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar username={user.username} role={user.role} />

            <main className="mx-auto max-w-3xl px-6 py-8 animate-page-fade">
                <div className="h-16 md:h-20" />
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-4"
                    >
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Account Profile</h1>
                    <p className="text-gray-600">Update your security settings and account information.</p>
                </div>

                <ProfileForm />
            </main>
        </div>
    );
}
