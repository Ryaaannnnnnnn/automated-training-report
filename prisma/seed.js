/*
  Minimal seed so the dashboard isn't empty.
  Run: npx prisma db push && npx prisma db seed
*/

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const adminUsername = "admin";
  let admin = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (!admin) {
    admin = await prisma.user.create({
      data: {
        username: adminUsername,
        password: "admin123",
        role: "admin",
        status: "APPROVED",
      },
    });
  }

  const staffUsername = "staff";
  const existingStaff = await prisma.user.findUnique({
    where: { username: staffUsername },
  });

  if (!existingStaff) {
    await prisma.user.create({
      data: {
        username: staffUsername,
        password: "staff123",
        role: "staff",
        status: "APPROVED",
      },
    });
  }

  const trainingCount = await prisma.training.count();
  if (trainingCount === 0) {
    await prisma.training.create({
      data: {
        title: "Sample Training: Automated Training System Kickoff",
        date: new Date(),
        venue: "DICT Training Room",
        trainer: "Admin Trainer",
        description: "Seeded sample training for local development.",
        status: "APPROVED",
        startTime: "09:00 AM",
        createdById: admin.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

