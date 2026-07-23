"use server";

import { prisma } from "@/app/lib/prisma";

export type VerifyCertificateResult =
  | { valid: false }
  | {
      valid: true;
      kind: "certificate";
      studentName: string;
      testName: string;
      levelCode: string;
      levelName: string;
      percentage: number;
      issuedAt: string; // ISO date
    }
  | {
      valid: true;
      kind: "enrollment";
      studentName: string;
      rollNumber: string;
      nationalId: string;
      courseTitle: string;
      batch: string;
      issuedAt: string; // ISO date
    };

// Extracts a verification code from either a raw code ("SR-XXXXXXXX" /
// "SRE-XXXXXXXX") or a full verify URL scanned from a QR
// (".../verify-certificate?code=SR-XXXXXXXX").
function extractCode(input: string): string | null {
  const trimmed = input.trim();
  try {
    const url = new URL(trimmed);
    const fromQuery = url.searchParams.get("code");
    if (fromQuery) return fromQuery.toUpperCase();
  } catch {
    // not a URL — fall through to treating it as a raw code
  }
  const match = trimmed.toUpperCase().match(/SR[A-Z]{0,2}-[A-Z0-9]{6,10}/);
  return match ? match[0] : null;
}

export async function verifyCertificateCode(rawInput: string): Promise<VerifyCertificateResult> {
  const code = extractCode(rawInput);
  if (!code) return { valid: false };

  const certificate = await prisma.certificateRequest.findUnique({
    where: { verificationCode: code },
    include: { user: true, test: true },
  });

  if (certificate && certificate.issuedAt) {
    return {
      valid: true,
      kind: "certificate",
      studentName: certificate.user.name,
      testName: certificate.test.name,
      levelCode: certificate.levelCode,
      levelName: certificate.levelName,
      percentage: certificate.percentage,
      issuedAt: certificate.issuedAt.toISOString(),
    };
  }

  const enrollment = await prisma.enrollment.findUnique({ where: { verificationCode: code } });

  if (enrollment && enrollment.issuedAt) {
    return {
      valid: true,
      kind: "enrollment",
      studentName: enrollment.studentName,
      rollNumber: enrollment.rollNumber,
      nationalId: enrollment.nationalId,
      courseTitle: enrollment.courseTitle,
      batch: enrollment.batch,
      issuedAt: enrollment.issuedAt.toISOString(),
    };
  }

  return { valid: false };
}
