import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { deleteTest } from "@/app/admin/actions/tests";
import { ArrowLeftIcon, TrashIcon, CheckIcon } from "@/app/admin/icons";

export default async function TestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const test = await prisma.test.findUnique({
    where: { id },
    include: {
      levels: { orderBy: { order: "asc" } },
      questions: {
        orderBy: { order: "asc" },
        include: { options: true, level: true },
      },
    },
  });

  if (!test) notFound();

  const deleteTestWithId = deleteTest.bind(null, test.id);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="flex items-start justify-between mb-8">
        <div>
          <Link
            href="/admin/tests"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a2025]"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Level Tests
          </Link>
          <h1 className="text-2xl font-semibold text-[#1a2025] mt-2">{test.name}</h1>
          {test.description && (
            <p className="text-gray-500 mt-1">{test.description}</p>
          )}
        </div>
        <form action={deleteTestWithId}>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 text-sm rounded-lg border border-red-200 text-[#ef3444] hover:bg-red-50 px-4 py-2 transition"
          >
            <TrashIcon className="w-4 h-4" />
            Delete Test
          </button>
        </form>
      </header>

      <section className="rounded-xl border border-gray-200 bg-white p-6 mb-8">
        <h2 className="text-lg font-medium text-[#1a2025] mb-4">CEFR Score Bands</h2>
        <div className="space-y-2">
          {test.levels.map((level) => (
            <div
              key={level.id}
              className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
            >
              <span className="text-sm font-semibold text-[#ef3444] w-14">
                {level.code}
              </span>
              <span className="text-sm text-[#1a2025] w-40">{level.name}</span>
              <span className="text-sm text-gray-500 w-28">
                {level.minScore}–{level.maxScore} pts
              </span>
              {level.description && (
                <span className="text-sm text-gray-500 flex-1">{level.description}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium text-[#1a2025] mb-4">
          Questions ({test.questions.length})
        </h2>
        <div className="space-y-4">
          {test.questions.map((q, i) => (
            <div key={q.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-[#1a2025] mb-2.5 flex items-center gap-2">
                <span className="text-gray-500">{i + 1}.</span>
                <span className="flex-1">{q.text}</span>
                {q.level && (
                  <span className="shrink-0 rounded-full bg-red-50 text-[#ef3444] text-xs font-semibold px-2 py-0.5">
                    {q.level.code}
                  </span>
                )}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-6">
                {q.options.map((o) => (
                  <div
                    key={o.id}
                    className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
                      o.isCorrect
                        ? "bg-green-50 text-green-700"
                        : "text-gray-500"
                    }`}
                  >
                    <span className="text-xs font-semibold w-4">{o.label}</span>
                    <span>{o.text}</span>
                    {o.isCorrect && (
                      <span className="ml-auto inline-flex items-center gap-1 text-xs">
                        <CheckIcon className="w-3.5 h-3.5" />
                        correct
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
