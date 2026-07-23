"use server";

import { prisma } from "@/app/lib/prisma";

export type VerifyCertificateResult =
  | { valid: false }
  | {
      valid: true;
      studentName: string;
      testName: string;
      levelCode: string;
      levelName: string;
      percentage: number;
      issuedAt: string; // ISO date
    };

// Extracts a verification code from either a raw code ("SR-XXXXXXXX") or a
// full verify URL scanned from a QR (".../verify-certificate?code=SR-XXXXXXXX").
function extractCode(input: string): string | null {
  const trimmed = input.trim();
  try {
    const url = new URL(trimmed);
    const fromQuery = url.searchParams.get("code");
    if (fromQuery) return fromQuery.toUpperCase();
  } catch {
    // not a URL — fall through to treating it as a raw code
  }
  const match = trimmed.toUpperCase().match(/SR-[A-Z0-9]{6,10}/);
  return match ? match[0] : null;
}

export async function verifyCertificateCode(rawInput: string): Promise<VerifyCertificateResult> {
  const code = extractCode(rawInput);
  if (!code) return { valid: false };

  const request = await prisma.certificateRequest.findUnique({
    where: { verificationCode: code },
    include: { user: true, test: true },
  });

  if (!request || !request.issuedAt) {
    return { valid: false };
  }

  return {
    valid: true,
    studentName: request.user.name,
    testName: request.test.name,
    levelCode: request.levelCode,
    levelName: request.levelName,
    percentage: request.percentage,
    issuedAt: request.issuedAt.toISOString(),
  };
}
