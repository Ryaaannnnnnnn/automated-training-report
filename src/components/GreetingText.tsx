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
    // Runs in the user's browser — reads their LOCAL time
    setGreeting(getGreeting());
  }, []);

  if (!greeting) return <span>Good day</span>;

  return <span>{greeting}</span>;
}
