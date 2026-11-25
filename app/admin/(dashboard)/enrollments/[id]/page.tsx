import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/app/lib/prisma";
import {
  generateEnrollmentCode,
  updateEnrollmentRemark,
} from "@/app/admin/actions/enrollments";
import { ArrowLeftIcon } from "@/app/level-test/icons";
import QrGenerator from "@/app/admin/qr/QrGenerator";

export default async function AdminEnrollmentQrPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const enrollment = await prisma.enrollment.findUnique({ where: { id } });
  if (!enrollment) notFound();

  const generateCodeWithId = generateEnrollmentCode.bind(null, enrollment.id);
  const updateRemarkWithId = updateEnrollmentRemark.bind(null, enrollment.id);

  const hdrs = await headers();
  const host = hdrs.get("host");
  const protocol = hdrs.get("x-forwarded-proto") ?? "https";
  const siteUrl = host ? `${protocol}://${host}` : "https://sunraymyanmar.com";
  const verifyUrl = enrollment.verificationCode
    ? `${siteUrl}/verify-certificate?code=${enrollment.verificationCode}`
    : null;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link
        href="/admin/enrollments"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a2025]"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Students
      </Link>

      <header className="mt-3 mb-8">
        <h1 className="text-3xl font-bold text-[#1a2025]">{enrollment.studentName}</h1>
        <p className="text-gray-500 mt-1">
          {enrollment.courseTitle} · {enrollment.batch}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm text-gray-500">
          <span>
            Roll No. <span className="font-medium text-[#1a2025]">{enrollment.rollNumber}</span>
          </span>
          <span>
            National ID{" "}
            <span className="font-medium text-[#1a2025]">{enrollment.nationalId}</span>
          </span>
        </div>
      </header>

      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        {verifyUrl && enrollment.verificationCode ? (
          <QrGenerator
            verifyUrl={verifyUrl}
            code={enrollment.verificationCode}
            title={enrollment.studentName}
            subtitle={`${enrollment.courseTitle} · ${enrollment.batch}`}
            fileNamePrefix="student-id"
          />
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 max-w-sm mx-auto">
              Generate a unique verification code and QR to print on{" "}
              {enrollment.studentName}&apos;s student ID card.
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

        <form
          action={updateRemarkWithId}
          className="mt-10 pt-8 border-t border-gray-100 space-y-3 max-w-xl"
        >
          <label htmlFor="remark" className="block text-sm font-medium text-gray-700">
            Remark{" "}
            <span className="text-gray-400 font-normal">(optional · shown on verify page)</span>
          </label>
          <textarea
            id="remark"
            name="remark"
            rows={3}
            maxLength={500}
            defaultValue={enrollment.remark ?? ""}
            placeholder="e.g. Scholarship student"
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444] transition"
          />
          <button
            type="submit"
            className="rounded-lg border border-gray-200 text-gray-700 hover:border-[#ef3444] hover:text-[#ef3444] font-semibold px-5 py-2 text-sm transition"
          >
            Save Remark
          </button>
        </form>
      </div>
    </div>
  );
}
