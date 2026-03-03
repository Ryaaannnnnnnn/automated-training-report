const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const trainings = await prisma.training.findMany({
        take: 5,
        select: { id: true, title: true }
    });
    console.log(JSON.stringify(trainings, null, 2));
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
