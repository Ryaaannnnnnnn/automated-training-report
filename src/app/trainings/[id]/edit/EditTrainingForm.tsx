"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

interface EditTrainingFormProps {
    id: string;
}

export function EditTrainingForm({ id }: EditTrainingFormProps) {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [venue, setVenue] = useState("");
    const [trainer, setTrainer] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState("");
    const [status, setStatus] = useState("PENDING");
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
                    setVenue(data.training.venue ?? "");
                    setTrainer(data.training.trainer ?? "");
                    setDescription(data.training.description ?? "");
                    setStartTime(data.training.startTime ?? "09:00 AM");
                    setStatus(data.training.status ?? "PENDING");
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSaving(true);

        try {
            const res = await fetch(`/api/trainings/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, date, venue, trainer, description, startTime, status }),
            });

            const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
            if (!res.ok || !data?.ok) {
                setError(data?.error ?? "Failed to update training");
                return;
            }

            router.push("/trainings");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm text-center text-gray-500">
                Loading training data...
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-10 shadow-sm transition-all hover:shadow-md">
            <div className="mb-8 border-b border-gray-100/50 pb-6">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight leading-none">Configuration</h3>
                <p className="text-[12px] font-medium text-gray-400 mt-2 tracking-tight">Adjust the training details as needed.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2.5 sm:col-span-2">
                    <label className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] ml-1">Training Title</label>
                    <input
                        className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/20 px-5 py-4 text-base font-medium outline-none transition-all focus:border-blue-500/40 focus:ring-8 focus:ring-blue-500/5 focus:bg-white"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] ml-1">Event Date</label>
                    <input
                        className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/20 px-5 py-4 text-base font-medium outline-none transition-all focus:border-blue-500/40 focus:ring-8 focus:ring-blue-500/5 focus:bg-white"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] ml-1">Venue / Location</label>
                    <input
                        className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/20 px-5 py-4 text-base font-medium outline-none transition-all focus:border-blue-500/40 focus:ring-8 focus:ring-blue-500/5 focus:bg-white"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] ml-1">Assigned Trainer</label>
                    <input
                        className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/20 px-5 py-4 text-base font-medium outline-none transition-all focus:border-blue-500/40 focus:ring-8 focus:ring-blue-500/5 focus:bg-white"
                        value={trainer}
                        onChange={(e) => setTrainer(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] ml-1">Start Time</label>
                    <input
                        className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/20 px-5 py-4 text-base font-medium outline-none transition-all focus:border-blue-500/40 focus:ring-8 focus:ring-blue-500/5 focus:bg-white"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2.5 sm:col-span-2">
                    <label className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] ml-1">Full Description</label>
                    <textarea
                        className="min-h-[160px] w-full rounded-2xl border-2 border-gray-100 bg-gray-50/20 px-5 py-4 text-base font-medium outline-none transition-all focus:border-blue-500/40 focus:ring-8 focus:ring-blue-500/5 focus:bg-white"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] ml-1">Review Status</label>
                    <select
                        className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/20 px-5 py-4 text-base font-medium outline-none transition-all focus:border-blue-500/40 focus:ring-8 focus:ring-blue-500/5 focus:bg-white appearance-none"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

            <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end">
                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-2xl bg-blue-600 px-8 py-4 text-[12px] font-bold text-white hover:bg-blue-700 disabled:opacity-60 shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3 uppercase tracking-[0.2em]"
                >
                    {saving ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Update Training
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
