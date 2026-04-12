import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

import { cache } from "react";

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const userId = cookieStore.get("session")?.value;
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, role: true },
  });

  return user;
});

