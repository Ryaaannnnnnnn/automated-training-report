"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AfterTrainingReportForm } from "../../new/AfterTrainingReportForm";

interface EditTrainingFormProps {
    id: string;
}

export function EditTrainingForm({ id }: EditTrainingFormProps) {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [venue, setVenue] = useState("");
    const [trainer, setTrainer] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [status, setStatus] = useState("PENDING");
    const [trainingType, setTrainingType] = useState("Training Report");
    const [reportData, setReportData] = useState<any>(null);
    
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/trainings/${id}`)
            .then((r) => r.json())
            .then((data) => {
                if (data?.training) {
                    setTitle(data.training.title ?? "");
                    setDate(data.training.date?.slice(0, 10) ?? "");
                    setEndDate(data.training.endDate?.slice(0, 10) ?? "");
                    setVenue(data.training.venue ?? "");
                    setTrainer(data.training.trainer ?? "");
                    setDescription(data.training.description ?? "");
                    setStartTime(data.training.startTime ?? "09:00 AM");
                    setEndTime(data.training.endTime ?? "05:00 PM");
                    setStatus(data.training.status ?? "PENDING");
                    setTrainingType(data.training.trainingType ?? "Training Report");
                    
                    if (data.training.reportData) {
                        try {
                            setReportData(JSON.parse(data.training.reportData));
                        } catch (e) {
                            console.error("Failed to parse reportData", e);
                        }
                    }
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    async function handleUpdate(updatedReportData: any, newStatus?: string) {
        setError(null);
        setSaving(true);

        try {
            // Determine final status
            // 1. If explicit newStatus provided (like "DRAFT"), use it.
            // 2. If no newStatus provided (normal Submit), and it was DRAFT, promote it.
            let finalStatus = newStatus || status;
            if (!newStatus && status === "DRAFT") {
                // Fetch user to check role, or just assume the server handles it?
                // The server route already has logic for role-based status on POST.
                // For PATCH, we might need to be explicit or let the server handle defaults.
                // Let's check if we can get user info here or just set to PENDING for safety.
                finalStatus = "PENDING"; 
            }

            const res = await fetch(`/api/trainings/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    title, 
                    date, 
                    endDate: endDate || null,
                    venue, 
                    trainer, 
                    description, 
                    startTime, 
                    endTime, 
                    status: finalStatus,
                    trainingType,
                    reportData: JSON.stringify(updatedReportData)
                }),
            });

            const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
            if (!res.ok || !data?.ok) {
                setError(data?.error ?? "Failed to update training. Please check your inputs.");
                return;
            }

            router.push("/trainings");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="rounded-lg border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm text-center text-gray-500 dark:text-slate-400">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600" />
                    <p className="font-bold text-sm tracking-tight">Initializing full report editor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-page-fade">
            <div className="mb-6 flex items-center gap-2 text-[12px] font-medium text-gray-400 dark:text-slate-500">
                <span className="text-blue-600 dark:text-blue-400 font-bold">Edit Mode</span>
                <span>→</span>
                <span className="text-gray-600 dark:text-slate-300 font-bold">{trainingType}</span>
            </div>

            <AfterTrainingReportForm
                coreTitle={title}
                setCoreTitle={setTitle}
                coreDate={date}
                setCoreDate={setDate}
                coreEndDate={endDate}
                setCoreEndDate={setEndDate}
                coreVenue={venue}
                setCoreVenue={setVenue}
                coreStartTime={startTime}
                setCoreStartTime={setStartTime}
                coreEndTime={endTime}
                setCoreEndTime={setEndTime}
                coreTrainer={trainer}
                setCoreTrainer={setTrainer}
                coreDescription={description}
                setCoreDescription={setDescription}
                saving={saving}
                onBack={() => router.push("/trainings")}
                onSubmit={(data, newStatus) => handleUpdate(data, newStatus)}
                initialReportData={reportData}
            />

            {error && (
                <div className="mt-6 rounded-2xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-4 text-sm font-bold text-red-600 dark:text-red-400 animate-shake">
                    {error}
                </div>
            )}
        </div>
    );
}
