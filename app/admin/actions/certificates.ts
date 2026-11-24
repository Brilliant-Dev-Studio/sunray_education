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

const MAX_REMARK_LENGTH = 500;

function readRemark(formData?: FormData): string | null {
  const raw = formData?.get("remark");
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().slice(0, MAX_REMARK_LENGTH);
  return trimmed || null;
}

export async function updateCertificateRemark(requestId: string, formData: FormData) {
  await verifyAdminSession();
  await prisma.certificateRequest.update({
    where: { id: requestId },
    data: { remark: readRemark(formData) },
  });
  revalidatePath(`/admin/qr-codes/${requestId}`);
  revalidatePath(`/admin/certificates/${requestId}`);
}

export async function generateVerificationCode(requestId: string, formData?: FormData) {
  await verifyAdminSession();

  const existing = await prisma.certificateRequest.findUnique({ where: { id: requestId } });
  if (!existing || existing.verificationCode) return;

  const remark = readRemark(formData);

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateRandomCode("SR");
    try {
      await prisma.certificateRequest.update({
        where: { id: requestId },
        data: { verificationCode: code, issuedAt: new Date(), remark },
      });
      break;
    } catch {
      // unique collision (astronomically unlikely) — retry with a new code
      continue;
    }
  }

  revalidatePath(`/admin/certificates/${requestId}`);
  revalidatePath(`/admin/qr-codes/${requestId}`);
}
