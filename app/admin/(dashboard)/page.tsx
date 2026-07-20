import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { FileTextIcon, HelpCircleIcon, TargetIcon, PlusIcon } from "@/app/admin/icons";

export default async function AdminHomePage() {
  const [testCount, questionCount, levelCount, recentTests] = await Promise.all([
    prisma.test.count(),
    prisma.question.count(),
    prisma.level.count(),
    prisma.test.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { _count: { select: { questions: true, levels: true } } },
    }),
  ]);

  const stats = [
    { label: "Level Tests", value: testCount, icon: FileTextIcon },
    { label: "Total Questions", value: questionCount, icon: HelpCircleIcon },
    { label: "CEFR Levels", value: levelCount, icon: TargetIcon },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1a2025]">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your CEFR level tests</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{s.label}</p>
                <Icon className="w-5 h-5 text-[#ef3444]" />
              </div>
              <p className="text-3xl font-semibold text-[#1a2025] mt-2">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#1a2025]">Recent Tests</h2>
        <Link
          href="/admin/tests/new"
          className="inline-flex items-center gap-1.5 text-sm rounded-lg bg-[#ef3444] hover:bg-[#ff3b45] text-white font-semibold px-4 py-2 transition"
        >
          <PlusIcon className="w-4 h-4" />
          Create Test
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {recentTests.length === 0 ? (
          <p className="p-8 text-center text-gray-500 text-sm">
            No tests yet. Create your first CEFR level test to get started.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="px-5 py-3 font-medium">Test Name</th>
                <th className="px-5 py-3 font-medium">Questions</th>
                <th className="px-5 py-3 font-medium">Levels</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTests.map((t) => (
                <tr key={t.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/tests/${t.id}`}
                      className="text-[#1a2025] hover:text-[#ef3444] font-medium"
                    >
                      {t.name}
                    </Link>
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
