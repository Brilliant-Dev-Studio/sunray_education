"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { createUserSession, deleteUserSession, getUserSession } from "@/app/lib/userSession";

const SignupSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters." }).trim(),
  email: z.email({ error: "Enter a valid email address." }).trim(),
  password: z.string().min(6, { error: "Password must be at least 6 characters." }),
  redirectTo: z.string().optional(),
});

const LoginSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }),
  password: z.string().min(1, { error: "Password is required." }),
  redirectTo: z.string().optional(),
});

export type AuthState = { error?: string } | undefined;

function safeRedirectPath(path: string | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/level-test";
  return path;
}

export async function signup(_state: AuthState, formData: FormData): Promise<AuthState> {
  const validated = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: formData.get("redirectTo") ?? undefined,
  });

  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Enter valid signup details." };
  }

  const { name, email, password, redirectTo } = validated.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash } });

  await createUserSession({ userId: user.id, email: user.email, name: user.name });
  redirect(safeRedirectPath(redirectTo));
}

export async function login(_state: AuthState, formData: FormData): Promise<AuthState> {
  const validated = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: formData.get("redirectTo") ?? undefined,
  });

  if (!validated.success) {
    return { error: "Enter a valid email and password." };
  }

  const { email, password, redirectTo } = validated.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Invalid email or password." };
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return { error: "Invalid email or password." };
  }

  await createUserSession({ userId: user.id, email: user.email, name: user.name });
  redirect(safeRedirectPath(redirectTo));
}

export async function logout() {
  await deleteUserSession();
  redirect("/level-test");
}

export async function getCurrentUser() {
  const session = await getUserSession();
  if (!session?.userId) return null;
  return { id: session.userId, email: session.email, name: session.name };
}
