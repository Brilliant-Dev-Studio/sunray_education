"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { verifyAdminSession } from "@/app/lib/dal";

export async function approveCertificateRequest(requestId: string) {
  await verifyAdminSession();
  await prisma.certificateRequest.update({
    where: { id: requestId },
    data: { status: "APPROVED" },
  });
  revalidatePath("/admin/certificates");
}

export async function rejectCertificateRequest(requestId: string) {
  await verifyAdminSession();
  await prisma.certificateRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED" },
  });
  revalidatePath("/admin/certificates");
}
