import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TeamGrid } from "@/components/TeamGrid";

export default async function TeamPage() {
    const currentUser = await getCurrentUser();
    if (!currentUser) redirect("/login");

    const teamData = await prisma.user.findMany({
        where: {
            status: "APPROVED",
        },
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            designation: true,
            avatarUrl: true,
            createdAt: true,
            lastActive: true,
        },
        orderBy: [
            { role: "asc" },
            { username: "asc" },
        ],
    });

    const now = new Date();
    const teamMembers = teamData.map(member => ({
        ...member,
        isOnline: (now.getTime() - new Date(member.lastActive).getTime()) / (1000 * 60) < 5
    }));

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 transition-colors duration-300">
            <Sidebar username={currentUser.username} role={currentUser.role} avatarUrl={currentUser.avatarUrl} />

            <main className="mx-auto max-w-7xl px-4 py-8 animate-page-fade">
                <div className="h-16 md:h-20" />
                
                <div className="mb-12">
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-3">
                        Our <span className="text-blue-600 dark:text-blue-400">Staff</span>
                    </h1>
                    <p className="text-gray-500 dark:text-slate-400 text-base sm:text-lg font-medium">Meet the professional staff members of the DICT Aklan Training System.</p>
                </div>

                <TeamGrid members={teamMembers as any} />
            </main>
        </div>
    );
}
