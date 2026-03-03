"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteTrainingButtonProps {
    trainingId: string;
    variant?: "small" | "normal";
}

export function DeleteTrainingButton({ trainingId, variant = "normal" }: DeleteTrainingButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        const confirmed = window.confirm(
            "Are you sure you want to delete this training? This action cannot be undone."
        );

        if (!confirmed) return;

        setLoading(true);
        try {
            const res = await fetch("/api/admin/trainings/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ trainingId }),
            });

            if (res.ok) {
                router.refresh();
            } else {
                const error = await res.text();
                alert(`Failed to delete training: ${error}`);
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("An error occurred while deleting the training.");
        } finally {
            setLoading(false);
        }
    }

    if (variant === "small") {
        return (
            <button
                onClick={handleDelete}
                disabled={loading}
                className="rounded bg-red-600 p-1.5 text-white hover:bg-red-700 disabled:opacity-50 transition-colors shadow-sm"
                title="Delete Training"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            </button>
        );
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors shadow-sm"
        >
            {loading ? "Deleting..." : "Delete Training"}
        </button>
    );
}
