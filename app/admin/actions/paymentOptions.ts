"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { verifyAdminSession } from "@/app/lib/dal";

const CreatePaymentOptionSchema = z.object({
  code: z.enum(["UAB_PAY", "KBZ_PAY", "WAVE_MONEY"]),
  label: z.string().min(1, { error: "Label is required." }),
  logoUrl: z.string().min(1, { error: "Logo path is required." }),
  qrUrl: z.string().min(1, { error: "QR code path is required." }),
});

export type PaymentOptionState = { error: string } | undefined;

export async function createPaymentOption(
  _state: PaymentOptionState,
  formData: FormData
): Promise<PaymentOptionState> {
  await verifyAdminSession();

  const validated = CreatePaymentOptionSchema.safeParse({
    code: formData.get("code"),
    label: formData.get("label"),
    logoUrl: formData.get("logoUrl"),
    qrUrl: formData.get("qrUrl"),
  });

  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Invalid payment option." };
  }

  const existing = await prisma.paymentOption.findUnique({
    where: { code: validated.data.code },
  });
  if (existing) {
    return { error: "That payment method already exists. Edit or delete it instead." };
  }

  const count = await prisma.paymentOption.count();

  await prisma.paymentOption.create({
    data: { ...validated.data, order: count },
  });

  revalidatePath("/admin/payment-methods");
}

export async function togglePaymentOptionActive(id: string, isActive: boolean) {
  await verifyAdminSession();
  await prisma.paymentOption.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/payment-methods");
}

export async function deletePaymentOption(id: string) {
  await verifyAdminSession();
  await prisma.paymentOption.delete({ where: { id } });
  revalidatePath("/admin/payment-methods");
}
