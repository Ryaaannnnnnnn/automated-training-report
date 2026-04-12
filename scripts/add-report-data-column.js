const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function main() {
  try {
    await p.$executeRawUnsafe("ALTER TABLE Training ADD COLUMN reportData TEXT");
    console.log("Column reportData added successfully.");
  } catch (e) {
    if (e.message && e.message.includes("duplicate column")) {
      console.log("Column already exists, skipping.");
    } else {
      console.error("Error:", e.message);
    }
  } finally {
    await p.$disconnect();
  }
}

main();
