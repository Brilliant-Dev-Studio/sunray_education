import type { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { verifyAdminSession } from "@/app/lib/dal";

// Quote a value for CSV. Also neutralises spreadsheet formula injection
// (values starting with = + - @ are prefixed with a single quote).
function csvCell(value: string | number | null | undefined): string {
  let s = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  await verifyAdminSession();

  const q = request.nextUrl.searchParams.get("q") ?? "";
  const where: Prisma.UserWhereInput = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { certificateRequests: true } },
      // Latest request carries the most recent real name / phone the user gave.
      certificateRequests: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { fullName: true, phone: true, contactEmail: true },
      },
    },
  });

  const header = [
    "Name",
    "Email",
    "Full Name (latest request)",
    "Phone (latest request)",
    "Contact Email (latest request)",
    "Certificate Requests",
    "Joined",
  ];

  const rows = users.map((u) => {
    const latest = u.certificateRequests[0];
    return [
      u.name,
      u.email,
      latest?.fullName,
      latest?.phone,
      latest?.contactEmail,
      u._count.certificateRequests,
      u.createdAt.toISOString(),
    ]
      .map(csvCell)
      .join(",");
  });

  // BOM so Excel opens UTF-8 (Myanmar text) correctly.
  const csv = "﻿" + [header.map(csvCell).join(","), ...rows].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sunray-users-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
