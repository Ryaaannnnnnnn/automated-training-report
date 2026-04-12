import { prisma } from "@/lib/prisma";

export async function ensureSeedData() {
  // Only ensure we have an admin user. 
  // We no longer re-create sample trainings automatically.
  let admin = await prisma.user.findFirst({ where: { role: "admin" } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        username: "admin",
        password: "admin123",
        role: "admin",
        status: "APPROVED",
      },
    });
  }
}

