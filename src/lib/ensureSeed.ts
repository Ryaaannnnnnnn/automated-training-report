import { prisma } from "@/lib/prisma";

export async function ensureSeedData() {
  // Check if a super admin already exists
  let superAdmin = await prisma.user.findFirst({ where: { isSuperAdmin: true } });

  if (!superAdmin) {
    // Try to find an existing admin and promote them
    const existingAdmin = await prisma.user.findFirst({ where: { role: "admin" } });

    if (existingAdmin) {
      // Promote existing admin to super admin
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: { isSuperAdmin: true },
      });
    } else {
      // Create the super admin from scratch
      await prisma.user.create({
        data: {
          username: "admin",
          password: "admin123",
          role: "admin",
          isSuperAdmin: true,
          status: "APPROVED",
        },
      });
    }
  }
}

