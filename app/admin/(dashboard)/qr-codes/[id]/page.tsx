import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/app/lib/prisma";
import { generateVerificationCode } from "@/app/admin/actions/certificates";
import { ArrowLeftIcon } from "@/app/level-test/icons";
import QrGenerator from "./QrGenerator";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-green-50 text-green-700",
  REJECTED: "bg-gray-100 text-gray-500",
};

export default async function AdminQrGeneratePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const req = await prisma.certificateRequest.findUnique({
    where: { id },
    include: { user: true, test: true },
  });

  if (!req) notFound();

  const generateCodeWithId = generateVerificationCode.bind(null, req.id);

  const hdrs = await headers();
  const host = hdrs.get("host");
  const protocol = hdrs.get("x-forwarded-proto") ?? "https";
  const siteUrl = host ? `${protocol}://${host}` : "https://sunraymyanmar.com";
  const verifyUrl = req.verificationCode
    ? `${siteUrl}/verify-certificate?code=${req.verificationCode}`
    : null;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link
        href="/admin/qr-codes"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a2025]"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to QR Codes
      </Link>

      <header className="flex items-start justify-between mt-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1a2025]">{req.user.name}</h1>
          <p className="text-gray-500 mt-1">
            {req.test.name} · {req.levelCode} · {req.levelName}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLES[req.status]}`}
        >
          {req.status}
        </span>
      </header>

      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        {verifyUrl && req.verificationCode ? (
          <QrGenerator
            verifyUrl={verifyUrl}
            code={req.verificationCode}
            studentName={req.user.name}
          />
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 max-w-sm mx-auto">
              Generate a unique verification code and QR to print on{" "}
              {req.user.name}&apos;s certificate.
            </p>
            <form action={generateCodeWithId} className="mt-6">
              <button
                type="submit"
                className="rounded-lg bg-[#ef3444] hover:bg-[#ff3b45] text-white font-semibold px-8 py-3.5 text-sm transition"
              >
                Generate QR
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
