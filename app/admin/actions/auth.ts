"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { createSession, deleteSession } from "@/app/lib/session";

const LoginSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }),
  password: z.string().min(1, { error: "Password is required." }),
});

export type LoginState = {
  error?: string;
} | undefined;

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const validated = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { error: "Enter a valid email and password." };
  }

  const { email, password } = validated.data;

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) {
    return { error: "Invalid email or password." };
  }

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordMatches) {
    return { error: "Invalid email or password." };
  }

  await createSession({ adminId: admin.id, email: admin.email, name: admin.name });
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}
