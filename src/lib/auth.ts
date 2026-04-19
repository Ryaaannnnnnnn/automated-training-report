import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

import { cache } from "react";

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const userId = cookieStore.get("session")?.value;
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, role: true, avatarUrl: true, lastActive: true },
  });

  if (user) {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000);

    // Refresh lastActive if it's older than 1 minute
    if (user.lastActive < oneMinuteAgo) {
      prisma.user.update({
        where: { id: user.id },
        data: { lastActive: now },
      }).catch(error => console.error("Failed to update lastActive:", error));
    }
  }

  return user;
});

