import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { ReportButtons } from "@/components/ReportButtons";
import { FileText, ArrowLeft, Info, Edit } from "lucide-react";
import Link from "next/link";
import { AfterTrainingReportView, ReportData } from "@/components/AfterTrainingReportView";
import { DownloadReportButton } from "@/components/DownloadReportButton";

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

    const reportData: ReportData | null = training.reportData ? JSON.parse(training.reportData) : null;

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Sidebar username={user.username} role={user.role} />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 pt-24 animate-page-fade">
                {/* Navigation and Actions */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <Link
                            href="/trainings"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/30 transition-all group shadow-sm active:scale-95"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Management
                        </Link>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">{training.title}</h1>
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex rounded-xl px-3 py-1 text-[9px] font-black uppercase tracking-widest border ${
                                training.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                training.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                'bg-rose-50 text-rose-600 border-rose-100'
                            }`}>
                                {training.status}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {(training as any).trainingType || "Training Report"}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {reportData && (
                            <DownloadReportButton 
                                training={training} 
                                showText={true}
                                className="inline-flex h-10 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50/30 px-5 text-emerald-600 shadow-sm transition-all hover:bg-emerald-50 hover:border-emerald-200 active:scale-95"
                            />
                        )}
                        <Link
                            href={`/trainings/${training.id}/edit`}
                            className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-xs font-black uppercase tracking-widest text-gray-700 shadow-sm transition-all hover:bg-slate-50 hover:text-blue-600 active:scale-95"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Record
                        </Link>
                        {!reportData && <ReportButtons trainingId={training.id} />}
                    </div>
                </div>

                <div className="space-y-12">
                    {/* 1. Main Report View (If exists) */}
                    {reportData ? (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 px-1">
                                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Technical Report</h2>
                            </div>
                            <AfterTrainingReportView 
                                data={reportData}
                                coreTitle={training.title}
                                coreDate={training.date.toISOString().split('T')[0]}
                                coreStartTime={(training as any).startTime || "09:00 AM"}
                                coreEndTime={(training as any).endTime || "05:00 PM"}
                                coreVenue={training.venue}
                            />
                        </div>
                    ) : (
                        <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center max-w-2xl mx-auto py-16">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <Info className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No Automated Report Found</h3>
                            <p className="text-gray-500 text-sm mb-8 leading-relaxed">This training record doesn't have an automated report attached yet. Staff can create one by editing this training and filling out the After Training Report form.</p>
                        </div>
                    )}

                    {/* 2. System Footer / Audit Trail */}
                    <div className="mt-12 mb-8 flex flex-col items-center">
                        <div className="w-12 h-1 bg-gray-100 rounded-full mb-8" />
                        
                        <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-xs font-black text-gray-400 uppercase">
                                    {(training.createdBy?.username?.[0] || 'U')}
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Submitted By</p>
                                    <p className="text-sm font-bold text-gray-900">{training.createdBy?.username || "Unknown System User"}</p>
                                </div>
                            </div>

                            <div className="h-px w-full sm:h-8 sm:w-px bg-gray-200" />

                            <div className="text-center sm:text-left flex-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Submission Date</p>
                                <p className="text-sm font-bold text-gray-900">
                                    {training.createdAt.toLocaleDateString('en-PH', { 
                                        month: 'long', day: 'numeric', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                            </div>

                            <div className="hidden lg:block lg:pl-6 border-l border-gray-200">
                                <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest leading-tight">
                                        Automated Training<br />Report System
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-8 opacity-50">
                            End of Record — {training.id}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}


