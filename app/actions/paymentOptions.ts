"use server";

import { prisma } from "@/app/lib/prisma";

export type PublicPaymentOption = {
  code: "UAB_PAY" | "KBZ_PAY" | "WAVE_MONEY";
  label: string;
  logoUrl: string;
  qrUrl: string;
};

export async function getActivePaymentOptions(): Promise<PublicPaymentOption[]> {
  const options = await prisma.paymentOption.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return options.map((o) => ({
    code: o.code,
    label: o.label,
    logoUrl: o.logoUrl,
    qrUrl: o.qrUrl,
  }));
}
