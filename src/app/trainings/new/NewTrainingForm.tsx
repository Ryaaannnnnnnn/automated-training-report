"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AfterTrainingReportForm } from "./AfterTrainingReportForm";

// Preset quick-pick times
const TIME_PRESETS_START = [
    { label: "8:00 AM", value: "08:00 AM" },
    { label: "9:00 AM", value: "09:00 AM" },
    { label: "10:00 AM", value: "10:00 AM" },
    { label: "1:00 PM", value: "01:00 PM" },
    { label: "2:00 PM", value: "02:00 PM" },
];

const TIME_PRESETS_END = [
    { label: "12:00 PM", value: "12:00 PM" },
    { label: "3:00 PM", value: "03:00 PM" },
    { label: "4:00 PM", value: "04:00 PM" },
    { label: "5:00 PM", value: "05:00 PM" },
    { label: "6:00 PM", value: "06:00 PM" },
];

// Convert "09:00 AM" → "09:00" (for input[type="time"])
function toInputTime(ampm: string): string {
    if (!ampm) return "09:00";
    const match = ampm.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return "09:00";
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = match[3].toUpperCase();
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${minutes}`;
}

// Convert "09:00" (input[type="time"]) → "09:00 AM"
function toAmPm(inputVal: string): string {
    if (!inputVal) return "09:00 AM";
    const [h, m] = inputVal.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

const TRAINING_TYPES = [
    {
        id: "provincial",
        label: "Provincial Report",
        subtitle: "Create After Provincial Report",
        color: "from-blue-600 to-blue-700",
        borderColor: "border-blue-600",
        textColor: "text-blue-600",
        bgColor: "bg-blue-600",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
        ),
        available: false,
    },
    {
        id: "training",
        label: "Training Report",
        subtitle: "Create After Training Report",
        color: "from-green-600 to-green-700",
        borderColor: "border-green-600",
        textColor: "text-green-600",
        bgColor: "bg-green-600",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192A48.424 48.424 0 0012 3.75c-2.266 0-4.48.189-6.274.556A2.25 2.25 0 003.75 6.108V18.75A2.25 2.25 0 006 21h.75m3-3h6.75M9 12v2.25m3.75-2.25V15" />
            </svg>
        ),
        available: true,
    },
    {
        id: "activity",
        label: "Activity Report",
        subtitle: "Create After Activity Report",
        color: "from-cyan-400 to-cyan-500",
        borderColor: "border-cyan-400",
        textColor: "text-cyan-500",
        bgColor: "bg-cyan-400",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
        ),
        available: false,
    },
    {
        id: "accomplishment",
        label: "Accomplishment Report",
        subtitle: "Create Accomplishment Report",
        color: "from-red-500 to-red-600",
        borderColor: "border-red-500",
        textColor: "text-red-500",
        bgColor: "bg-red-500",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
        ),
        available: false,
    },
];

// ── Phase type ───────────────────────────────────────────────────────────────
type Phase = "type-select" | "core-details" | "report-form";

export function NewTrainingForm() {
    const router = useRouter();

    const [phase, setPhase] = useState<Phase>("type-select");
    const [trainingType, setTrainingType] = useState("Training Report");
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState<string>("");
    const [venue, setVenue] = useState("");
    const [trainer, setTrainer] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState("09:00 AM");
    const [endTime, setEndTime] = useState("05:00 PM");
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    // Submit with optional reportData and status
    async function submitTraining(reportData?: object, status?: string) {
        setError(null);
        setSaving(true);

        try {
            const res = await fetch("/api/trainings", {
                method: "POST",
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
                    trainingType,
                    status: status || undefined,
                    reportData: reportData ? JSON.stringify(reportData) : undefined,
                }),
            });

            const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
            if (!res.ok || !data?.ok) {
                setError(data?.error ?? "Failed to create training");
                return;
            }

            router.push("/trainings");
        } finally {
            setSaving(false);
        }
    }

    // Core details form submit → go to report form (for Training Report) or direct submit
    async function onCoreSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (trainingType === "Training Report") {
            setPhase("report-form");
        } else {
            await submitTraining();
        }
    }

    // ── PHASE: After Training Report Form ────────────────────────────────────
    return (
        <div className="space-y-6">
            {/* Progress breadcrumb */}
            <div className="flex items-center gap-2 text-[12px] font-medium text-gray-400 dark:text-slate-500">
                <span className="text-green-600 dark:text-green-400 font-bold">✓ Type Selected</span>
                <span>→</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">After Training Report</span>
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
                onBack={() => setPhase("type-select")}
                onSubmit={(reportData, status) => submitTraining(reportData, status)}
            />

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
    );
}
