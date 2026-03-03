const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.user.findFirst({ where: { role: "admin" } });
    if (!admin) {
        console.error("Admin user not found. Run seeds first.");
        return;
    }

    const result = await prisma.training.updateMany({
        where: { createdById: null },
        data: {
            createdById: admin.id,
            startTime: "09:00 AM",
        },
    });

    console.log(`Updated ${result.count} trainings.`);
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
