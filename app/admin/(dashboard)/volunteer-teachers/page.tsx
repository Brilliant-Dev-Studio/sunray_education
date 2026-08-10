import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { getImageUrl } from "@/app/lib/s3";
import { PlusIcon, QrIcon, TrashIcon } from "@/app/admin/icons";
import { deleteVolunteerTeacher } from "@/app/admin/actions/volunteerTeachers";
import AdminPagination from "@/app/admin/AdminPagination";

const PAGE_SIZE = 12;

export default async function AdminVolunteerTeachersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where: Prisma.VolunteerTeacherWhereInput = q
    ? {
        OR: [
          { teacherName: { contains: q, mode: "insensitive" } },
          { courseTaught: { contains: q, mode: "insensitive" } },
          { verificationCode: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const [total, teachers] = await Promise.all([
    prisma.volunteerTeacher.count({ where }),
    prisma.volunteerTeacher.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const photoUrls = await Promise.all(teachers.map((t) => getImageUrl(t.photo)));

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a2025]">Volunteer Teachers</h1>
          <p className="text-gray-500 mt-1 max-w-[50%]">
            Generate a QR for each volunteer teacher&apos;s certificate — students can
            scan it to see who taught the course.
          </p>
        </div>
        <Link
          href="/admin/volunteer-teachers/new"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-[#ef3444] hover:bg-[#ff3b45] text-white font-semibold px-4 py-2.5 text-sm transition"
        >
          <PlusIcon className="w-4 h-4" />
          New Teacher
        </Link>
      </header>

      <form method="GET" className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name, course, or code..."
          className="flex-1 min-w-48 rounded-lg border border-gray-200 px-3.5 py-2 text-sm outline-none focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444] transition"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#ef3444] hover:bg-[#ff3b45] text-white font-semibold px-4 py-2 text-sm transition"
        >
          Search
        </button>
        {q && (
          <Link
            href="/admin/volunteer-teachers"
            className="text-sm text-gray-500 hover:text-[#1a2025] underline"
          >
            Clear
          </Link>
        )}
      </form>

      {teachers.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 text-sm">
          {q ? "No teachers match your search." : "No volunteer teachers yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((t, i) => {
            const deleteWithId = deleteVolunteerTeacher.bind(null, t.id);
            return (
              <div key={t.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <span className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoUrls[i]}
                      alt={t.teacherName}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#1a2025] truncate">{t.teacherName}</p>
                    <p className="text-xs text-gray-500 truncate">{t.courseTaught}</p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium mt-1 ${
                        t.verificationCode
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {t.verificationCode ? "QR generated" : "No QR yet"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Link
                    href={`/admin/volunteer-teachers/${t.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-[#ef3444] hover:text-[#ef3444] px-3 py-1.5 text-xs font-semibold transition"
                  >
                    <QrIcon className="w-3.5 h-3.5" />
                    {t.verificationCode ? "View QR" : "Generate QR"}
                  </Link>
                  <form action={deleteWithId}>
                    <button
                      type="submit"
                      title="Delete"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-red-200 text-[#ef3444] hover:bg-red-50 transition"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden mt-4">
        <AdminPagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={PAGE_SIZE}
          basePath="/admin/volunteer-teachers"
          searchParams={{ q }}
        />
      </div>
    </div>
  );
}
