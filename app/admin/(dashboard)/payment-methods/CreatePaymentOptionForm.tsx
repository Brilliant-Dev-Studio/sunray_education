"use client";

import { useActionState } from "react";
import { createPaymentOption } from "@/app/admin/actions/paymentOptions";
import { PlusIcon } from "@/app/admin/icons";

const ALL_CODES = ["UAB_PAY", "KBZ_PAY", "WAVE_MONEY"] as const;

export default function CreatePaymentOptionForm({
  existingCodes,
}: {
  existingCodes: string[];
}) {
  const [state, formAction, pending] = useActionState(createPaymentOption, undefined);
  const availableCodes = ALL_CODES.filter((c) => !existingCodes.includes(c));

  if (availableCodes.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        All supported payment methods have been added.
      </p>
    );
  }

  return (
    <form action={formAction} className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-[#1a2025] mb-4">Add Payment Method</h2>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <select
          name="code"
          required
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444]"
        >
          {availableCodes.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          name="label"
          required
          placeholder="Display label (e.g. UAB Pay)"
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444]"
        />
        <input
          name="logoUrl"
          required
          placeholder="/payments/uabpay.jpg"
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444]"
        />
        <input
          name="qrUrl"
          required
          placeholder="/PaymentsQR/uabSunray.jpg"
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444]"
        />
      </div>

      {state?.error && (
        <p className="mt-3 text-sm text-[#ef3444] bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#ef3444] hover:bg-[#ff3b45] disabled:opacity-60 text-white font-semibold px-4 py-2 text-sm transition"
      >
        <PlusIcon className="w-4 h-4" />
        {pending ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
