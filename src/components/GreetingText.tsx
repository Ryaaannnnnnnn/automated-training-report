"use client";

import { useEffect, useState } from "react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function GreetingText() {
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    // Runs on the client, so it uses the user's local clock
    setGreeting(getGreeting());
  }, []);

  // Render nothing until hydrated to avoid SSR mismatch
  if (!greeting) return null;

  return <>{greeting}</>;
}
