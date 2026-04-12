const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    // Get all trainings ordered by createdAt
    const trainings = await prisma.$queryRawUnsafe(
        `SELECT id, title FROM Training ORDER BY createdAt ASC`
    );
    console.log("All trainings in order:");
    trainings.forEach((t, i) => console.log(`  ${i + 1}. [${t.id}] ${t.title}`));

    // Find demo training by title (case-insensitive)
    const demoTraining = trainings.find(t =>
        t.title.toLowerCase().includes("demo")
    );

    if (!demoTraining) {
        console.log("\nNo 'demo' training found. Listing all titles above.");
        console.log("Updating ALL existing trainings to 'Training Report' type...");
        await prisma.$executeRawUnsafe(
            `UPDATE Training SET trainingType = 'Training Report' WHERE trainingType IS NULL OR trainingType = ''`
        );
        console.log("Done!");
    } else {
        console.log(`\nFound demo training: "${demoTraining.title}" (id: ${demoTraining.id})`);
        await prisma.$executeRawUnsafe(
            `UPDATE Training SET trainingType = 'Training Report' WHERE id = ?`,
            demoTraining.id
        );
        console.log("Set trainingType = 'Training Report' on demo training.");
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
