import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create sample clients with Claude Haiku 4.5 enabled
  const client1 = await prisma.client.upsert({
    where: { email: "client1@example.com" },
    update: { aiModel: "claude-haiku-4.5" },
    create: {
      name: "Sample Client 1",
      email: "client1@example.com",
      aiModel: "claude-haiku-4.5",
    },
  });

  const client2 = await prisma.client.upsert({
    where: { email: "client2@example.com" },
    update: { aiModel: "claude-haiku-4.5" },
    create: {
      name: "Sample Client 2",
      email: "client2@example.com",
      aiModel: "claude-haiku-4.5",
    },
  });

  console.log("Seeded clients:", { client1, client2 });
  console.log("All clients now have Claude Haiku 4.5 enabled");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
