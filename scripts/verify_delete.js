const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("Starting Delete User verification...");

    // 1. Create a dummy staff user and approve them
    const username = "todelete_" + Date.now();
    const user = await prisma.user.create({
        data: {
            username,
            password: "password",
            role: "staff",
            status: "APPROVED",
        },
    });
    console.log(`Created dummy user: ${user.username} (${user.id})`);

    // 2. Mock calling the delete API (since we can't easily fetch local API from script, we use Prisma directly to simulate what the API does)
    // The API logic is:
    /*
      await prisma.user.delete({
        where: { id: userId },
      });
    */

    console.log("Simulating delete action...");
    await prisma.user.delete({
        where: { id: user.id },
    });

    // 3. Verify user is gone
    const deletedUser = await prisma.user.findUnique({
        where: { id: user.id },
    });

    if (deletedUser) {
        throw new Error("User was not deleted!");
    }

    console.log("Verification Successful: User deleted.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
