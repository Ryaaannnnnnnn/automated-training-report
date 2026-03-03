const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const id = process.argv[2];
    if (!id) {
        console.error("Please provide a training ID");
        return;
    }

    try {
        const training = await (prisma.training.update as any)({
            where: { id },
            data: {
                startTime: "11:00 AM",
            },
        });
        console.log("Updated training:", JSON.stringify(training, null, 2));
    } catch (e) {
        console.error("Update failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
