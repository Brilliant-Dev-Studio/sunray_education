"use server";

import * as z from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { verifyAdminSession } from "@/app/lib/dal";
import { generateRandomCode } from "@/app/lib/verificationCode";

const EnrollmentSchema = z.object({
  studentName: z
    .string()
    .trim()
    .min(2, { error: "Student name must be at least 2 characters." }),
  rollNumber: z
    .string()
    .trim()
    .min(2, { error: "Roll number must be at least 2 characters." }),
  nationalId: z
    .string()
    .trim()
    .min(5, { error: "National ID number must be at least 5 characters." }),
  courseTitle: z
    .string()
    .trim()
    .min(2, { error: "Course title must be at least 2 characters." }),
  batch: z.string().trim().min(1, { error: "Batch is required." }),
});

export type CreateEnrollmentState =
  | { fieldErrors?: Record<string, string>; error?: string }
  | undefined;

export async function createEnrollment(
  _state: CreateEnrollmentState,
  formData: FormData
): Promise<CreateEnrollmentState> {
  await verifyAdminSession();

  const validated = EnrollmentSchema.safeParse({
    studentName: formData.get("studentName"),
    rollNumber: formData.get("rollNumber"),
    nationalId: formData.get("nationalId"),
    courseTitle: formData.get("courseTitle"),
    batch: formData.get("batch"),
  });

  if (!validated.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of validated.error.issues) {
      const field = String(issue.path[0]);
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { fieldErrors };
  }

  const enrollment = await prisma.enrollment.create({ data: validated.data });

  revalidatePath("/admin/enrollments");
  redirect(`/admin/enrollments/${enrollment.id}`);
}

export async function deleteEnrollment(enrollmentId: string) {
  await verifyAdminSession();
  await prisma.enrollment.delete({ where: { id: enrollmentId } });
  revalidatePath("/admin/enrollments");
  redirect("/admin/enrollments");
}

export async function generateEnrollmentCode(enrollmentId: string) {
  await verifyAdminSession();

  const existing = await prisma.enrollment.findUnique({ where: { id: enrollmentId } });
  if (!existing || existing.verificationCode) return;

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateRandomCode("SRE");
    try {
      await prisma.enrollment.update({
        where: { id: enrollmentId },
        data: { verificationCode: code, issuedAt: new Date() },
      });
      break;
    } catch {
      continue;
    }
  }

  revalidatePath(`/admin/enrollments/${enrollmentId}`);
}
