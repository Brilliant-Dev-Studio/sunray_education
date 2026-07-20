import { getSiteSettings, updateCertificatePrice } from "@/app/admin/actions/settings";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1a2025]">Settings</h1>
        <p className="text-gray-500 mt-1">Site-wide configuration</p>
      </header>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium text-[#1a2025] mb-1">Certificate Price</h2>
        <p className="text-sm text-gray-500 mb-4">
          Price shown to users when requesting a certificate. Changing this only affects new
          requests going forward.
        </p>
        <form action={updateCertificatePrice} className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Price (MMK)
            </label>
            <input
              type="number"
              name="certificatePrice"
              min={0}
              defaultValue={settings.certificatePrice}
              required
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444]"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[#ef3444] hover:bg-[#ff3b45] text-white font-semibold px-5 py-2.5 text-sm transition"
          >
            Save
          </button>
        </form>
      </section>
    </div>
  );
}
