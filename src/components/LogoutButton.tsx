"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={() => {
        if (window.confirm("Are you sure you want to log out?")) {
          logout();
        }
      }}
      disabled={loading}
      className={className ?? "text-sm font-medium text-white hover:text-white/80"}
    >
      {loading ? "..." : "Logout"}
    </button>

  );
}

