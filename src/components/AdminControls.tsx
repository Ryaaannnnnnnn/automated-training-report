"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UserApprovalButtons({ userId, currentStatus }: { userId: string; currentStatus?: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleAction(status: "APPROVED" | "REJECTED") {
        setLoading(true);
        try {
            await fetch("/api/admin/users/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, status }),
            });
            router.refresh();
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex gap-2">
            {currentStatus !== "APPROVED" && (
                <button
                    onClick={() => handleAction("APPROVED")}
                    disabled={loading}
                    className="rounded-lg bg-green-600 dark:bg-emerald-500/10 p-1.5 text-white dark:text-emerald-400 border border-transparent dark:border-emerald-500/20 hover:bg-green-700 dark:hover:bg-emerald-500/20 disabled:opacity-50 transition-colors shadow-sm"
                    title="Approve User"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </button>
            )}
            {currentStatus !== "REJECTED" && (
                <button
                    onClick={() => handleAction("REJECTED")}
                    disabled={loading}
                    className="rounded-lg bg-red-600 dark:bg-rose-500/10 p-1.5 text-white dark:text-rose-400 border border-transparent dark:border-rose-500/20 hover:bg-red-700 dark:hover:bg-rose-500/20 disabled:opacity-50 transition-colors shadow-sm"
                    title="Reject User"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}

export function TrainingApprovalButtons({ trainingId, currentStatus }: { trainingId: string; currentStatus?: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleAction(status: "APPROVED" | "REJECTED") {
        setLoading(true);
        try {
            await fetch("/api/admin/trainings/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ trainingId, status }),
            });
            router.refresh();
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex gap-2">
            {currentStatus !== "APPROVED" && (
                <button
                    onClick={() => handleAction("APPROVED")}
                    disabled={loading}
                    className="rounded-lg bg-green-600 dark:bg-emerald-500/10 p-1.5 text-white dark:text-emerald-400 border border-transparent dark:border-emerald-500/20 hover:bg-green-700 dark:hover:bg-emerald-500/20 disabled:opacity-50 transition-colors shadow-sm"
                    title="Approve Training"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </button>
            )}
            {currentStatus !== "REJECTED" && (
                <button
                    onClick={() => handleAction("REJECTED")}
                    disabled={loading}
                    className="rounded-lg bg-red-600 dark:bg-rose-500/10 p-1.5 text-white dark:text-rose-400 border border-transparent dark:border-rose-500/20 hover:bg-red-700 dark:hover:bg-rose-500/20 disabled:opacity-50 transition-colors shadow-sm"
                    title="Reject Training"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
