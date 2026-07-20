import { prisma } from "@/app/lib/prisma";
import { togglePaymentOptionActive, deletePaymentOption } from "@/app/admin/actions/paymentOptions";
import { TrashIcon } from "@/app/admin/icons";
import CreatePaymentOptionForm from "./CreatePaymentOptionForm";

export default async function AdminPaymentMethodsPage() {
  const options = await prisma.paymentOption.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1a2025]">Payment Methods</h1>
        <p className="text-gray-500 mt-1">
          Payment options shown to users on the certificate request form
        </p>
      </header>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden mb-6">
        {options.length === 0 ? (
          <p className="p-8 text-center text-gray-500 text-sm">No payment methods yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="px-5 py-3 font-medium">Logo</th>
                <th className="px-5 py-3 font-medium">Code</th>
                <th className="px-5 py-3 font-medium">Label</th>
                <th className="px-5 py-3 font-medium">QR Code</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {options.map((opt) => {
                const toggleWithId = togglePaymentOptionActive.bind(null, opt.id, !opt.isActive);
                const deleteWithId = deletePaymentOption.bind(null, opt.id);
                return (
                  <tr key={opt.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-5 py-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={opt.logoUrl}
                        alt={opt.label}
                        className="w-10 h-10 object-cover rounded-md border border-gray-200"
                      />
                    </td>
                    <td className="px-5 py-3 text-gray-500 font-mono text-xs">{opt.code}</td>
                    <td className="px-5 py-3 font-medium text-[#1a2025]">{opt.label}</td>
                    <td className="px-5 py-3">
                      <a
                        href={opt.qrUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#ef3444] hover:underline text-xs"
                      >
                        View QR
                      </a>
                    </td>
                    <td className="px-5 py-3">
                      <form action={toggleWithId}>
                        <button
                          type="submit"
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition ${
                            opt.isActive
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {opt.isActive ? "Active" : "Inactive"}
                        </button>
                      </form>
                    </td>
                    <td className="px-5 py-3">
                      <form action={deleteWithId}>
                        <button
                          type="submit"
                          title="Delete"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-red-200 text-[#ef3444] hover:bg-red-50 transition"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <CreatePaymentOptionForm existingCodes={options.map((o) => o.code)} />
    </div>
  );
}
