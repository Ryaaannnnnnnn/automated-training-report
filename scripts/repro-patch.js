const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function main() {
    try {
        const training = await prisma.training.findFirst();
        if (!training) {
            fs.writeFileSync("repro_log.txt", "No trainings found in DB");
            return;
        }

        const id = training.id;

        // Simulating the PATCH data
        const updateData = {
            title: training.title,
            date: training.date,
            venue: training.venue,
            trainer: training.trainer,
            description: training.description,
            startTime: "12:00 PM",
            status: training.status
        };

        const updated = await (prisma.training.update as any)({
            where: { id },
            data: updateData
        });
        fs.writeFileSync("repro_log.txt", "SUCCESS: " + JSON.stringify(updated, null, 2));
    } catch (e) {
        fs.writeFileSync("repro_log.txt", "FAILED: " + e.message + "\n" + e.stack);
    } finally {
        await prisma.$disconnect();
    }
}

main();
