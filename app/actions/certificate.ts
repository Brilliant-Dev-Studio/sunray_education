"use server";

import * as z from "zod";
import { prisma } from "@/app/lib/prisma";
import { getUserSession } from "@/app/lib/userSession";

const MAX_INVOICE_BYTES = 3 * 1024 * 1024; // 3MB, roughly (base64 is ~4/3 of raw size)

const SubmitCertificateSchema = z.object({
  testId: z.string().min(1),
  levelCode: z.string().min(1),
  levelName: z.string().min(1),
  score: z.number().int().min(0),
  total: z.number().int().min(1),
  percentage: z.number().int().min(0).max(100),
  contactEmail: z.email({ error: "Enter a valid email address." }),
  paymentMethod: z.enum(["UAB_PAY", "KBZ_PAY", "WAVE_MONEY"]),
  invoiceImage: z
    .string()
    .startsWith("data:image/", { error: "Upload a valid image file." })
    .max(MAX_INVOICE_BYTES, { error: "Invoice image is too large (max ~2MB)." }),
});

export type SubmitCertificateInput = z.infer<typeof SubmitCertificateSchema>;

export type SubmitCertificateState =
  | { error: string }
  | { success: true; requestId: string }
  | undefined;

export async function submitCertificateRequest(
  input: SubmitCertificateInput
): Promise<SubmitCertificateState> {
  const session = await getUserSession();
  if (!session?.userId) {
    return { error: "Please log in to request a certificate." };
  }

  const validated = SubmitCertificateSchema.safeParse(input);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Invalid certificate request." };
  }

  const data = validated.data;

  const test = await prisma.test.findUnique({ where: { id: data.testId } });
  if (!test) {
    return { error: "Test not found." };
  }

  const request = await prisma.certificateRequest.create({
    data: {
      userId: session.userId,
      testId: data.testId,
      levelCode: data.levelCode,
      levelName: data.levelName,
      score: data.score,
      total: data.total,
      percentage: data.percentage,
      contactEmail: data.contactEmail,
      paymentMethod: data.paymentMethod,
      invoiceImage: data.invoiceImage,
    },
  });

  return { success: true, requestId: request.id };
}
