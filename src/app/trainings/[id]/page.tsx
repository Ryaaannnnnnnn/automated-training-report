import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { ReportButtons } from "@/components/ReportButtons";
import { Calendar, MapPin, User as UserIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function TrainingDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    const { id } = await params;

    const training = await prisma.training.findUnique({
        where: { id },
        include: {
            createdBy: true,
            attendances: {
                include: {
                    participant: true,
                },
                orderBy: {
                    participant: {
                        name: "asc",
                    },
                },
            },
            evaluations: {
                include: {
                    participant: true,
                },
                orderBy: {
                    participant: {
                        name: "asc",
                    },
                },
            },
        },
    });

    if (!training) notFound();

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar username={user.username} role={user.role} />

            <main className="mx-auto max-w-7xl px-6 py-8 pt-20">
                {/* Back Button & Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Link
                            href="/trainings"
                            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-2 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Trainings
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">{training.title}</h1>
                        <p className="text-gray-600 mt-1 max-w-2xl">{training.description}</p>
                    </div>
                    <ReportButtons trainingId={training.id} />
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Training Info</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</p>
                                        <p className="text-gray-900">{training.date.toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Venue</p>
                                        <p className="text-gray-900">{training.venue}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <UserIcon className="w-5 h-5 text-green-500 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Trainer</p>
                                        <p className="text-gray-900">{training.trainer}</p>
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Created By</p>
                                    <p className="text-gray-700">{training.createdBy?.username || "Unknown"}</p>
                                    <p className="text-[10px] text-gray-400">on {training.createdAt.toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Attendance & Evaluations */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Attendance Table */}
                        <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b">
                                <h3 className="font-semibold text-gray-800">Attendance List ({training.attendances.length})</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50/50 text-gray-500 border-b">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Participant</th>
                                            <th className="px-6 py-3 font-medium">Organization</th>
                                            <th className="px-6 py-3 font-medium text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {training.attendances.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">No attendance records found.</td>
                                            </tr>
                                        ) : (
                                            training.attendances.map((a) => (
                                                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <p className="font-medium text-gray-900">{a.participant.name}</p>
                                                        <p className="text-xs text-gray-500">{a.participant.email}</p>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">{a.participant.organization}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${a.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {a.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Evaluations Section (if any) */}
                        {training.evaluations.length > 0 && (
                            <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-indigo-50 px-6 py-4 border-b">
                                    <h3 className="font-semibold text-indigo-900">Training Evaluations</h3>
                                </div>
                                <div className="divide-y">
                                    {training.evaluations.map((e) => (
                                        <div key={e.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-medium text-gray-900">{e.participant.name}</p>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            className={`w-4 h-4 ${i < e.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 italic">"{e.comments || "No comments provided."}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
