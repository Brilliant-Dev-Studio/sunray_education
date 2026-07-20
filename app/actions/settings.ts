"use server";

import { prisma } from "@/app/lib/prisma";

export async function getCertificatePrice(): Promise<number> {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });
  return settings.certificatePrice;
}
