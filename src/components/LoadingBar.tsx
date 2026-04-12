"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function LoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  // Trigger loading state on any pathname or search param change
  useEffect(() => {
    setLoading(false); // Reset when transition completes
  }, [pathname, searchParams]);

  // Global listener for link clicks for INSTANT feedback
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor && anchor.href && !anchor.target && anchor.origin === window.location.origin) {
        setLoading(true);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 animate-loading-slide shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
      <style jsx>{`
        @keyframes loading-slide {
          0% { width: 0; opacity: 1; }
          50% { width: 70%; opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }
        .animate-loading-slide {
          animation: loading-slide 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
