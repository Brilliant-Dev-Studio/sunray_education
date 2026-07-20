"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { verifyAdminSession } from "@/app/lib/dal";

export async function getSiteSettings() {
  return prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });
}

export async function updateCertificatePrice(formData: FormData) {
  await verifyAdminSession();
  const price = Number(formData.get("certificatePrice") ?? 0);
  if (!Number.isFinite(price) || price < 0) return;

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: { certificatePrice: price },
    create: { id: "main", certificatePrice: price },
  });
  revalidatePath("/admin/settings");
}
