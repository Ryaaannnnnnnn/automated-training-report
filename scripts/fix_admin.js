const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("Fixing admin account status...");

    const admin = await prisma.user.findUnique({
        where: { username: "admin" },
    });

    if (!admin) {
        console.log("Admin user not found! Creating one...");
        await prisma.user.create({
            data: {
                username: "admin",
                password: "admin123",
                role: "admin",
                status: "APPROVED",
            },
        });
        console.log("Admin user created with APPROVED status.");
    } else {
        console.log(`Found admin user. Current status: ${admin.status}`);
        if (admin.status !== "APPROVED") {
            await prisma.user.update({
                where: { username: "admin" },
                data: { status: "APPROVED" },
            });
            console.log("Admin user status updated to APPROVED.");
        } else {
            console.log("Admin user is already APPROVED.");
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
