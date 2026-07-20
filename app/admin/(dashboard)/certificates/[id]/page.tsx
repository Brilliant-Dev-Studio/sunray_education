import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { approveCertificateRequest, rejectCertificateRequest } from "@/app/admin/actions/certificates";
import { getInvoiceImageUrl } from "@/app/lib/s3";
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from "@/app/level-test/icons";

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

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-[#1a2025] font-medium mt-0.5">{value}</p>
    </div>
  );
}

export default async function CertificateRequestDetailPage({
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

  const invoiceUrl = await getInvoiceImageUrl(req.invoiceImage);

  const approveWithId = approveCertificateRequest.bind(null, req.id);
  const rejectWithId = rejectCertificateRequest.bind(null, req.id);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="flex items-start justify-between mb-8">
        <div>
          <Link
            href="/admin/certificates"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a2025]"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Certificate Requests
          </Link>
          <h1 className="text-2xl font-semibold text-[#1a2025] mt-2">
            Certificate Request
          </h1>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLES[req.status]}`}
        >
          {req.status}
        </span>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Requester
          </h2>
          <div className="space-y-4">
            <Field label="Name" value={req.user.name} />
            <Field label="Account Email" value={req.user.email} />
            <Field label="Contact Email" value={req.contactEmail} />
            <Field
              label="Requested"
              value={new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(req.createdAt)}
            />
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Test Result
          </h2>
          <div className="space-y-4">
            <Field label="Test" value={req.test.name} />
            <Field label="Level" value={`${req.levelCode} · ${req.levelName}`} />
            <Field
              label="Score"
              value={`${req.score}/${req.total} (${req.percentage}%)`}
            />
            <Field
              label="Payment Method"
              value={PAYMENT_LABELS[req.paymentMethod] ?? req.paymentMethod}
            />
            <Field label="Price" value={`${req.price.toLocaleString()} MMK`} />
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 sm:col-span-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Payment Invoice
          </h2>
          <a href={invoiceUrl} target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={invoiceUrl}
              alt="Payment invoice"
              className="max-h-96 w-full object-contain rounded-lg border border-gray-200 bg-gray-50 hover:opacity-90 transition"
            />
          </a>
          <p className="text-xs text-gray-400 mt-2">Click image to open full size</p>
        </section>
      </div>

      {req.status === "PENDING" && (
        <div className="flex items-center gap-3 mt-6">
          <form action={approveWithId}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold px-5 py-2.5 text-sm transition"
            >
              <CheckCircleIcon className="w-4 h-4" />
              Approve
            </button>
          </form>
          <form action={rejectWithId}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 text-[#ef3444] hover:bg-red-50 px-5 py-2.5 text-sm font-semibold transition"
            >
              <XCircleIcon className="w-4 h-4" />
              Reject
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
