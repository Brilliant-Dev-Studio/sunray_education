import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/app/lib/prisma";
import { getImageUrl } from "@/app/lib/s3";
import { generateVolunteerTeacherCode } from "@/app/admin/actions/volunteerTeachers";
import { ArrowLeftIcon } from "@/app/level-test/icons";
import QrGenerator from "@/app/admin/qr/QrGenerator";

export default async function AdminVolunteerTeacherQrPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const teacher = await prisma.volunteerTeacher.findUnique({ where: { id } });
  if (!teacher) notFound();

  const photoUrl = await getImageUrl(teacher.photo);
  const generateCodeWithId = generateVolunteerTeacherCode.bind(null, teacher.id);

  const hdrs = await headers();
  const host = hdrs.get("host");
  const protocol = hdrs.get("x-forwarded-proto") ?? "https";
  const siteUrl = host ? `${protocol}://${host}` : "https://sunraymyanmar.com";
  const verifyUrl = teacher.verificationCode
    ? `${siteUrl}/verify-certificate?code=${teacher.verificationCode}`
    : null;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link
        href="/admin/volunteer-teachers"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a2025]"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Volunteer Teachers
      </Link>

      <header className="flex items-center gap-4 mt-3 mb-8">
        <span className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt={teacher.teacherName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </span>
        <div>
          <h1 className="text-3xl font-bold text-[#1a2025]">{teacher.teacherName}</h1>
          <p className="text-gray-500 mt-1">{teacher.courseTaught}</p>
        </div>
      </header>

      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        {verifyUrl && teacher.verificationCode ? (
          <QrGenerator
            verifyUrl={verifyUrl}
            code={teacher.verificationCode}
            title={teacher.teacherName}
            subtitle={teacher.courseTaught}
            fileNamePrefix="volunteer-teacher"
          />
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 max-w-sm mx-auto">
              Generate a unique verification code and QR to print on{" "}
              {teacher.teacherName}&apos;s volunteer certificate.
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
