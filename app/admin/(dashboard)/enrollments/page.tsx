import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { PlusIcon, QrIcon, TrashIcon } from "@/app/admin/icons";
import { deleteEnrollment } from "@/app/admin/actions/enrollments";
import AdminPagination from "@/app/admin/AdminPagination";

const PAGE_SIZE = 10;

function maskId(id: string) {
  if (id.length <= 4) return id;
  return `${"*".repeat(id.length - 4)}${id.slice(-4)}`;
}

export default async function AdminEnrollmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where: Prisma.EnrollmentWhereInput = q
    ? {
        OR: [
          { studentName: { contains: q, mode: "insensitive" } },
          { rollNumber: { contains: q, mode: "insensitive" } },
          { courseTitle: { contains: q, mode: "insensitive" } },
          { batch: { contains: q, mode: "insensitive" } },
          { verificationCode: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const [total, enrollments] = await Promise.all([
    prisma.enrollment.count({ where }),
    prisma.enrollment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a2025]">Student Authenticity</h1>
          <p className="text-gray-500 mt-1 max-w-[50%]">
            Authenticity records — generate a QR students can scan to confirm
            they&apos;re legitimately attending a Sunray course.
          </p>
        </div>
        <Link
          href="/admin/enrollments/new"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-[#ef3444] hover:bg-[#ff3b45] text-white font-semibold px-4 py-2.5 text-sm transition"
        >
          <PlusIcon className="w-4 h-4" />
          New Record
        </Link>
      </header>

      <form method="GET" className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name, roll number, course, or batch..."
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
            href="/admin/enrollments"
            className="text-sm text-gray-500 hover:text-[#1a2025] underline"
          >
            Clear
          </Link>
        )}
      </form>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {enrollments.length === 0 ? (
          <p className="p-8 text-center text-gray-500 text-sm">
            {q ? "No records match your search." : "No records yet."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="px-5 py-3 font-medium">Student</th>
                  <th className="px-5 py-3 font-medium">Roll No.</th>
                  <th className="px-5 py-3 font-medium">National ID</th>
                  <th className="px-5 py-3 font-medium">Course</th>
                  <th className="px-5 py-3 font-medium">Batch</th>
                  <th className="px-5 py-3 font-medium">QR Status</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((e) => {
                  const deleteWithId = deleteEnrollment.bind(null, e.id);
                  return (
                    <tr key={e.id} className="border-b border-gray-100 last:border-0 align-top">
                      <td className="px-5 py-3 font-semibold text-[#1a2025] whitespace-nowrap">
                        {e.studentName}
                      </td>
                      <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                        {e.rollNumber}
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">
                        {maskId(e.nationalId)}
                      </td>
                      <td className="px-5 py-3 text-gray-600 truncate max-w-48">
                        {e.courseTitle}
                      </td>
                      <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{e.batch}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            e.verificationCode
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {e.verificationCode ? "Generated" : "Not generated"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <Link
                            href={`/admin/enrollments/${e.id}`}
                            title={e.verificationCode ? "View / download QR" : "Generate QR"}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:border-[#ef3444] hover:text-[#ef3444] transition"
                          >
                            <QrIcon className="w-4 h-4" />
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <AdminPagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={PAGE_SIZE}
          basePath="/admin/enrollments"
          searchParams={{ q }}
        />
      </div>
    </div>
  );
}
