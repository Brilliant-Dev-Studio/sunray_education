"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { verifyAdminSession } from "@/app/lib/dal";
import { generateRandomCode } from "@/app/lib/verificationCode";

export async function approveCertificateRequest(requestId: string) {
  await verifyAdminSession();
  await prisma.certificateRequest.update({
    where: { id: requestId },
    data: { status: "APPROVED" },
  });
  revalidatePath("/admin/certificates");
  revalidatePath(`/admin/certificates/${requestId}`);
}

export async function rejectCertificateRequest(requestId: string) {
  await verifyAdminSession();
  await prisma.certificateRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED" },
  });
  revalidatePath("/admin/certificates");
  revalidatePath(`/admin/certificates/${requestId}`);
}

export async function generateVerificationCode(requestId: string) {
  await verifyAdminSession();

  const existing = await prisma.certificateRequest.findUnique({ where: { id: requestId } });
  if (!existing || existing.verificationCode) return;

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateRandomCode("SR");
    try {
      await prisma.certificateRequest.update({
        where: { id: requestId },
        data: { verificationCode: code, issuedAt: new Date() },
      });
      break;
    } catch {
      // unique collision (astronomically unlikely) — retry with a new code
      continue;
    }
  }

  revalidatePath(`/admin/certificates/${requestId}`);
}
