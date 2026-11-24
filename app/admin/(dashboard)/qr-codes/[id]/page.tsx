import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/app/lib/prisma";
import {
  generateVerificationCode,
  updateCertificateRemark,
} from "@/app/admin/actions/certificates";
import { ArrowLeftIcon } from "@/app/level-test/icons";
import QrGenerator from "@/app/admin/qr/QrGenerator";

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
  const updateRemarkWithId = updateCertificateRemark.bind(null, req.id);

  const remarkField = (
    <div className="text-left">
      <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-1.5">
        Remark <span className="text-gray-400 font-normal">(optional · shown on verify page)</span>
      </label>
      <textarea
        id="remark"
        name="remark"
        rows={3}
        maxLength={500}
        defaultValue={req.remark ?? ""}
        placeholder="e.g. Passed with distinction"
        className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444] transition"
      />
    </div>
  );

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
          <h1 className="text-3xl font-bold text-[#1a2025]">{req.fullName ?? req.user.name}</h1>
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
          <>
            <QrGenerator
              verifyUrl={verifyUrl}
              code={req.verificationCode}
              title={req.user.name}
              subtitle={`${req.levelCode} · ${req.levelName}`}
              fileNamePrefix="certificate"
            />
            <form
              action={updateRemarkWithId}
              className="mt-10 pt-8 border-t border-gray-100 space-y-3 max-w-xl"
            >
              {remarkField}
              <button
                type="submit"
                className="rounded-lg border border-gray-200 text-gray-700 hover:border-[#ef3444] hover:text-[#ef3444] font-semibold px-5 py-2 text-sm transition"
              >
                Save Remark
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 max-w-sm mx-auto">
              Generate a unique verification code and QR to print on{" "}
              {req.user.name}&apos;s certificate.
            </p>
            <form action={generateCodeWithId} className="mt-6 max-w-md mx-auto space-y-6">
              {remarkField}
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
