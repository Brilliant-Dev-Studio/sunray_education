import { prisma } from "@/app/lib/prisma";
import { approveCertificateRequest, rejectCertificateRequest } from "@/app/admin/actions/certificates";
import { getInvoiceImageUrl } from "@/app/lib/s3";
import { CheckCircleIcon, XCircleIcon } from "@/app/level-test/icons";

const PAYMENT_LABELS: Record<string, string> = {
  UAB_PAY: "UAB Pay",
  KBZ_PAY: "KBZ Pay",
  WAVE_MONEY: "Wave Money",
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-green-50 text-green-700",
  REJECTED: "bg-gray-100 text-gray-500",
};

export default async function AdminCertificatesPage() {
  const requests = await prisma.certificateRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, test: true },
  });

  const invoiceUrls = await Promise.all(
    requests.map((req) => getInvoiceImageUrl(req.invoiceImage))
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1a2025]">Certificate Requests</h1>
        <p className="text-gray-500 mt-1">
          Review payment invoices and approve or reject certificate requests
        </p>
      </header>

      {requests.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 text-sm">
          No certificate requests yet.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req, i) => {
            const approveWithId = approveCertificateRequest.bind(null, req.id);
            const rejectWithId = rejectCertificateRequest.bind(null, req.id);
            return (
              <div
                key={req.id}
                className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col sm:flex-row gap-5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={invoiceUrls[i]}
                  alt="Payment invoice"
                  className="w-full sm:w-40 h-40 object-contain rounded-lg border border-gray-200 bg-gray-50 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-semibold text-[#1a2025]">{req.user.name}</p>
                      <p className="text-xs text-gray-500">{req.user.email}</p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[req.status]}`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Test</p>
                      <p className="text-[#1a2025] font-medium truncate">{req.test.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Level</p>
                      <p className="text-[#1a2025] font-medium">
                        {req.levelCode} · {req.levelName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Score</p>
                      <p className="text-[#1a2025] font-medium">
                        {req.score}/{req.total} ({req.percentage}%)
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Payment</p>
                      <p className="text-[#1a2025] font-medium">
                        {PAYMENT_LABELS[req.paymentMethod] ?? req.paymentMethod}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Contact Email</p>
                      <p className="text-[#1a2025] font-medium truncate">{req.contactEmail}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-3">
                    Requested{" "}
                    {new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(
                      req.createdAt
                    )}
                  </p>

                  {req.status === "PENDING" && (
                    <div className="flex items-center gap-3 mt-4">
                      <form action={approveWithId}>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-2 text-sm transition"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          Approve
                        </button>
                      </form>
                      <form action={rejectWithId}>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 text-[#ef3444] hover:bg-red-50 px-4 py-2 text-sm font-semibold transition"
                        >
                          <XCircleIcon className="w-4 h-4" />
                          Reject
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
