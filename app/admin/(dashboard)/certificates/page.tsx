import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { approveCertificateRequest, rejectCertificateRequest } from "@/app/admin/actions/certificates";
import { getInvoiceImageUrl } from "@/app/lib/s3";
import { CheckCircleIcon, XCircleIcon } from "@/app/level-test/icons";
import { EyeIcon } from "@/app/admin/icons";
import AdminPagination from "@/app/admin/AdminPagination";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-green-50 text-green-700",
  REJECTED: "bg-gray-100 text-gray-500",
};

const STATUS_OPTIONS = ["ALL", "PENDING", "APPROVED", "REJECTED"] as const;

const PAGE_SIZE = 10;

export default async function AdminCertificatesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const { q = "", status = "ALL", page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where: Prisma.CertificateRequestWhereInput = {
    ...(status !== "ALL" ? { status: status as "PENDING" | "APPROVED" | "REJECTED" } : {}),
    ...(q
      ? {
          OR: [
            { contactEmail: { contains: q, mode: "insensitive" } },
            { levelCode: { contains: q, mode: "insensitive" } },
            { user: { name: { contains: q, mode: "insensitive" } } },
            { user: { email: { contains: q, mode: "insensitive" } } },
            { test: { name: { contains: q, mode: "insensitive" } } },
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

  const invoiceUrls = await Promise.all(
    requests.map((req) => getInvoiceImageUrl(req.invoiceImage))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1a2025]">Certificate Requests</h1>
        <p className="text-gray-500 mt-1">
          Review payment invoices and approve or reject certificate requests
        </p>
      </header>

      <form method="GET" className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name, email, or test..."
          className="flex-1 min-w-48 rounded-lg border border-gray-200 px-3.5 py-2 text-sm outline-none focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444] transition"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded-lg border border-gray-200 px-3.5 py-2 text-sm outline-none focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444] transition"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "ALL" ? "All statuses" : s}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-[#ef3444] hover:bg-[#ff3b45] text-white font-semibold px-4 py-2 text-sm transition"
        >
          Search
        </button>
        {(q || status !== "ALL") && (
          <Link
            href="/admin/certificates"
            className="text-sm text-gray-500 hover:text-[#1a2025] underline"
          >
            Clear
          </Link>
        )}
      </form>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {requests.length === 0 ? (
          <p className="p-8 text-center text-gray-500 text-sm">
            {q || status !== "ALL"
              ? "No certificate requests match your search."
              : "No certificate requests yet."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="px-5 py-3 font-medium">Invoice</th>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Test / Level</th>
                  <th className="px-5 py-3 font-medium">Score</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, i) => {
                  const approveWithId = approveCertificateRequest.bind(null, req.id);
                  const rejectWithId = rejectCertificateRequest.bind(null, req.id);
                  return (
                    <tr key={req.id} className="border-b border-gray-100 last:border-0 align-top">
                      <td className="px-5 py-3">
                        <a href={invoiceUrls[i]} target="_blank" rel="noopener noreferrer">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={invoiceUrls[i]}
                            alt="Payment invoice"
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 bg-gray-50 hover:opacity-80 transition"
                          />
                        </a>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-[#1a2025] whitespace-nowrap">{req.user.name}</p>
                        <p className="text-xs text-gray-500">{req.user.email}</p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-[#1a2025] font-medium truncate max-w-40">{req.test.name}</p>
                        <p className="text-xs text-gray-500">
                          {req.levelCode} · {req.levelName}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-gray-700 whitespace-nowrap">
                        {req.score}/{req.total} ({req.percentage}%)
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[req.status]}`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <Link
                            href={`/admin/certificates/${req.id}`}
                            title="View detail"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:border-[#ef3444] hover:text-[#ef3444] transition"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Link>
                          {req.status === "PENDING" && (
                            <>
                              <form action={approveWithId}>
                                <button
                                  type="submit"
                                  title="Approve"
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-600 hover:bg-green-500 text-white transition"
                                >
                                  <CheckCircleIcon className="w-4 h-4" />
                                </button>
                              </form>
                              <form action={rejectWithId}>
                                <button
                                  type="submit"
                                  title="Reject"
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-red-200 text-[#ef3444] hover:bg-red-50 transition"
                                >
                                  <XCircleIcon className="w-4 h-4" />
                                </button>
                              </form>
                            </>
                          )}
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
          basePath="/admin/certificates"
          searchParams={{ q, status: status !== "ALL" ? status : undefined }}
        />
      </div>
    </div>
  );
}
