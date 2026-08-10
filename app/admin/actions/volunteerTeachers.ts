"use server";

import * as z from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { verifyAdminSession } from "@/app/lib/dal";
import { uploadImageBuffer } from "@/app/lib/s3";
import { generateRandomCode } from "@/app/lib/verificationCode";

const MAX_PHOTO_BYTES = 3 * 1024 * 1024; // 3MB

const VolunteerTeacherSchema = z.object({
  teacherName: z.string().trim().min(2, { error: "Teacher name must be at least 2 characters." }),
  courseTaught: z
    .string()
    .trim()
    .min(2, { error: "Course taught must be at least 2 characters." }),
});

export type CreateVolunteerTeacherState =
  | { fieldErrors?: Record<string, string>; error?: string }
  | undefined;

export async function createVolunteerTeacher(
  _state: CreateVolunteerTeacherState,
  formData: FormData
): Promise<CreateVolunteerTeacherState> {
  await verifyAdminSession();

  const validated = VolunteerTeacherSchema.safeParse({
    teacherName: formData.get("teacherName"),
    courseTaught: formData.get("courseTaught"),
  });

  const fieldErrors: Record<string, string> = {};
  if (!validated.success) {
    for (const issue of validated.error.issues) {
      const field = String(issue.path[0]);
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
  }

  const photo = formData.get("photo");
  if (!(photo instanceof File) || photo.size === 0) {
    fieldErrors.photo = "A photo is required.";
  } else if (!photo.type.startsWith("image/")) {
    fieldErrors.photo = "Upload a valid image file.";
  } else if (photo.size > MAX_PHOTO_BYTES) {
    fieldErrors.photo = "Photo is too large (max 3MB).";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }
  if (!validated.success) {
    return { error: "Invalid form data." };
  }

  const { teacherName, courseTaught } = validated.data;
  const photoFile = photo as File;

  let photoKey: string;
  try {
    const buffer = Buffer.from(await photoFile.arrayBuffer());
    photoKey = await uploadImageBuffer(buffer, photoFile.type, "teachers");
  } catch {
    return { error: "Could not upload photo. Try again." };
  }

  const teacher = await prisma.volunteerTeacher.create({
    data: { teacherName, courseTaught, photo: photoKey },
  });

  revalidatePath("/admin/volunteer-teachers");
  redirect(`/admin/volunteer-teachers/${teacher.id}`);
}

export async function deleteVolunteerTeacher(teacherId: string) {
  await verifyAdminSession();
  await prisma.volunteerTeacher.delete({ where: { id: teacherId } });
  revalidatePath("/admin/volunteer-teachers");
  redirect("/admin/volunteer-teachers");
}

export async function generateVolunteerTeacherCode(teacherId: string) {
  await verifyAdminSession();

  const existing = await prisma.volunteerTeacher.findUnique({ where: { id: teacherId } });
  if (!existing || existing.verificationCode) return;

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateRandomCode("SRV");
    try {
      await prisma.volunteerTeacher.update({
        where: { id: teacherId },
        data: { verificationCode: code, issuedAt: new Date() },
      });
      break;
    } catch {
      continue;
    }
  }

  revalidatePath(`/admin/volunteer-teachers/${teacherId}`);
}
