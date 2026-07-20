import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { PlusIcon, EyeIcon } from "@/app/admin/icons";

export default async function TestsListPage() {
  const tests = await prisma.test.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { questions: true, levels: true } } },
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a2025]">Level Tests</h1>
          <p className="text-gray-500 mt-1">All CEFR-aligned level tests</p>
        </div>
        <Link
          href="/admin/tests/new"
          className="inline-flex items-center gap-1.5 text-sm rounded-lg bg-[#ef3444] hover:bg-[#ff3b45] text-white font-semibold px-4 py-2 transition"
        >
          <PlusIcon className="w-4 h-4" />
          Create Test
        </Link>
      </header>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {tests.length === 0 ? (
          <p className="p-8 text-center text-gray-500 text-sm">
            No tests yet.{" "}
            <Link href="/admin/tests/new" className="text-[#ef3444] hover:underline">
              Create one
            </Link>
            .
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="px-5 py-3 font-medium">Test Name</th>
                <th className="px-5 py-3 font-medium">Questions</th>
                <th className="px-5 py-3 font-medium">Levels</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Created</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t) => (
                <tr key={t.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/tests/${t.id}`}
                      className="text-[#1a2025] hover:text-[#ef3444] font-medium"
                    >
                      {t.name}
                    </Link>
                    {t.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{t.description}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{t._count.questions}</td>
                  <td className="px-5 py-3 text-gray-500">{t._count.levels}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        t.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {t.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                    }).format(t.createdAt)}
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/tests/${t.id}`}
                      title="View questions"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-[#ef3444] hover:text-[#ef3444] px-3 py-1.5 text-xs font-semibold transition"
                    >
                      <EyeIcon className="w-3.5 h-3.5" />
                      View Questions
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
