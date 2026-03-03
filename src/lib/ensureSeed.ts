import { prisma } from "@/lib/prisma";

export async function ensureSeedData() {
  const trainingCount = await prisma.training.count();
  if (trainingCount > 0) return;

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

  await (prisma.training.create as any)({
    data: {
      title: "Sample Training: Automated Training System Kickoff",
      date: new Date(),
      venue: "DICT Training Room",
      trainer: "Admin Trainer",
      description: "Auto-seeded sample training for local development.",
      startTime: "09:00 AM",
      createdById: admin.id,
    },
  });
}

