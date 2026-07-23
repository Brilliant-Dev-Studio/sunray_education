import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { QrIcon } from "@/app/admin/icons";
import AdminPagination from "@/app/admin/AdminPagination";

const PAGE_SIZE = 10;

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-green-50 text-green-700",
  REJECTED: "bg-gray-100 text-gray-500",
};

export default async function AdminQrCodesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where: Prisma.CertificateRequestWhereInput = {
    ...(q
      ? {
          OR: [
            { user: { name: { contains: q, mode: "insensitive" } } },
            { user: { email: { contains: q, mode: "insensitive" } } },
            { test: { name: { contains: q, mode: "insensitive" } } },
            { verificationCode: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, requests] = await Promise.all([
    prisma.certificateRequest.count({ where }),
    prisma.certificateRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { user: true, test: true },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1a2025]">QR Codes</h1>
        <p className="text-gray-500 mt-1">
          Generate, customize, and download the verification QR for any
          certificate request — print it and stick it on the physical
          certificate.
        </p>
      </header>

      <form method="GET" className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name, email, test, or code..."
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
            href="/admin/qr-codes"
            className="text-sm text-gray-500 hover:text-[#1a2025] underline"
          >
            Clear
          </Link>
        )}
      </form>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {requests.length === 0 ? (
          <p className="p-8 text-center text-gray-500 text-sm">
            {q ? "No certificates match your search." : "No certificate requests yet."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="px-5 py-3 font-medium">Student</th>
                  <th className="px-5 py-3 font-medium">Test / Level</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Verify Code</th>
                  <th className="px-5 py-3 font-medium">QR Status</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} className="border-b border-gray-100 last:border-0 align-top">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-[#1a2025] whitespace-nowrap">
                        {req.user.name}
                      </p>
                      <p className="text-xs text-gray-500">{req.user.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-[#1a2025] font-medium truncate max-w-40">
                        {req.test.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {req.levelCode} · {req.levelName}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[req.status]}`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-600">
                      {req.verificationCode ?? "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          req.verificationCode
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {req.verificationCode ? "Generated" : "Not generated"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/qr-codes/${req.id}`}
                        title={req.verificationCode ? "View / download QR" : "Generate QR"}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-[#ef3444] hover:text-[#ef3444] px-3 py-1.5 text-xs font-semibold transition"
                      >
                        <QrIcon className="w-3.5 h-3.5" />
                        {req.verificationCode ? "View QR" : "Generate QR"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AdminPagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={PAGE_SIZE}
          basePath="/admin/qr-codes"
          searchParams={{ q }}
        />
      </div>
    </div>
  );
}
