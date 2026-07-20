import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@sunray.edu";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "SunRay@Admin123";
  const name = process.env.SEED_ADMIN_NAME ?? "Sun Ray Admin";

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, name },
  });

  console.log(`Admin user ready: ${admin.email}`);
  console.log(`Login password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
