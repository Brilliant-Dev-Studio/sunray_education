import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const options = [
  { code: "UAB_PAY", label: "UAB Pay", logoUrl: "/payments/uabpay.jpg", qrUrl: "/PaymentsQR/uabSunray.jpg", order: 0 },
  { code: "KBZ_PAY", label: "KBZ Pay", logoUrl: "/payments/kbzpay.png", qrUrl: "/PaymentsQR/kpazySunray.jpg", order: 1 },
  { code: "WAVE_MONEY", label: "Wave Money", logoUrl: "/payments/wavepay.jpg", qrUrl: "/PaymentsQR/wavepaySunray.jpg", order: 2 },
];

for (const opt of options) {
  await prisma.paymentOption.upsert({
    where: { code: opt.code },
    update: opt,
    create: opt,
  });
}
console.log("seeded", options.length, "payment options");
await prisma.$disconnect();
