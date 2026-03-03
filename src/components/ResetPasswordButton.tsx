"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ResetPasswordButton({ userId, username }: { userId: string; username: string }) {
    const [isResetting, setIsResetting] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [showInput, setShowInput] = useState(false);
    const router = useRouter();

    const handleReset = async () => {
        if (!newPassword) return;

        setIsResetting(true);
        try {
            const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: newPassword }),
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.error || "Failed to reset password");
            } else {
                alert(`Password for ${username} has been reset.`);
                setShowInput(false);
                setNewPassword("");
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setIsResetting(false);
        }
    };

    if (!showInput) {
        return (
            <button
                onClick={() => setShowInput(true)}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
                Reset Password
            </button>
        );
    }

    return (
        <div className="flex items-center gap-2 mt-2">
            <input
                type="text"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border text-xs px-2 py-1 rounded w-32"
            />
            <button
                onClick={handleReset}
                disabled={isResetting || !newPassword}
                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {isResetting ? "Saving..." : "Save"}
            </button>
            <button
                onClick={() => setShowInput(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
            >
                Cancel
            </button>
        </div>
    );
}
