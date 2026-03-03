const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const trainings = await prisma.training.findMany({
        where: { createdById: null },
        select: { id: true, title: true, createdById: true },
    });
    console.log(JSON.stringify(trainings, null, 2));
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
