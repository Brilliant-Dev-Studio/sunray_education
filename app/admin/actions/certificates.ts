"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { verifyAdminSession } from "@/app/lib/dal";

// Unambiguous alphabet: no 0/O/1/I.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomCode(length: number) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let out = "";
  for (const b of bytes) out += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return out;
}

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
    const code = `SR-${randomCode(8)}`;
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
