const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function main() {
    const id = process.argv[2];
    if (!id) {
        fs.writeFileSync("error_log.txt", "No ID provided\n");
        return;
    }

    try {
        const training = await (prisma.training.update as any)({
            where: { id },
            data: {
                startTime: "11:00 AM",
            },
        });
        fs.writeFileSync("error_log.txt", "Success: " + JSON.stringify(training, null, 2) + "\n");
    } catch (e) {
        fs.writeFileSync("error_log.txt", "Error: " + e.message + "\n" + e.stack + "\n");
    } finally {
        await prisma.$disconnect();
    }
}

main();
