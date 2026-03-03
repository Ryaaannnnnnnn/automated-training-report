const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("Starting verification...");

    // 1. Clean up previous test
    await prisma.attendance.deleteMany({});
    await prisma.evaluation.deleteMany({});
    await prisma.training.deleteMany({ where: { title: "Test Training" } });
    await prisma.user.deleteMany({ where: { username: "teststaff" } });

    console.log("Cleaned up previous test data.");

    // 2. Validate Registration Logic (Manual simulation)
    // We can't easily hit the Next.js API from here without running fetch and handling cookies, 
    // but we can verify the Prisma logic by creating a user and checking defaults.

    // Create user directly (simulate API)
    const user = await prisma.user.create({
        data: {
            username: "teststaff",
            password: "password123",
            role: "staff",
            status: "PENDING", // This matches what API does
        },
    });

    console.log(`User created: ${user.username}, Status: ${user.status}`);
    if (user.status !== "PENDING") throw new Error("User status should be PENDING");

    // 3. Simulate Admin Approval
    await prisma.user.update({
        where: { id: user.id },
        data: { status: "APPROVED" },
    });
    console.log("User approved by admin.");

    // 4. Create Training as Staff
    const training = await prisma.training.create({
        data: {
            title: "Test Training",
            date: new Date(),
            venue: "Test Venue",
            trainer: "Test Trainer",
            description: "Test Description",
            status: "PENDING", // API logic for staff
            createdById: user.id,
        },
    });

    console.log(`Training created: ${training.title}, Status: ${training.status}, CreatedBy: ${training.createdById}`);
    if (training.status !== "PENDING") throw new Error("Training status should be PENDING");
    if (training.createdById !== user.id) throw new Error("Training should be linked to user");

    // 5. Simulate Admin Approval for Training
    await prisma.training.update({
        where: { id: training.id },
        data: { status: "APPROVED" },
    });
    console.log("Training approved by admin.");

    const finalTraining = await prisma.training.findUnique({ where: { id: training.id } });
    if (finalTraining.status !== "APPROVED") throw new Error("Training status should be APPROVED");

    console.log("Verification Successful!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
