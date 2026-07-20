import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import {
  deleteTest,
  toggleTestActive,
  updateTestDetails,
  createLevel,
  updateLevel,
  deleteLevel,
  deleteQuestion,
} from "@/app/admin/actions/tests";
import { ArrowLeftIcon, TrashIcon, CheckIcon, PlusIcon, EyeIcon } from "@/app/admin/icons";

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
  const toggleActiveWithId = toggleTestActive.bind(null, test.id, !test.isActive);
  const updateDetailsWithId = updateTestDetails.bind(null, test.id);
  const createLevelWithId = createLevel.bind(null, test.id);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link
        href="/admin/tests"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a2025]"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Level Tests
      </Link>

      <div className="flex items-start justify-between mt-2 mb-8 gap-4">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            test.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          {test.isActive ? "Active" : "Inactive"}
        </span>
        <div className="flex items-center gap-2">
          <form action={toggleActiveWithId}>
            <button
              type="submit"
              className="text-sm rounded-lg border border-gray-200 text-gray-600 hover:border-[#1a2025] hover:text-[#1a2025] px-4 py-2 transition"
            >
              {test.isActive ? "Deactivate" : "Activate"}
            </button>
          </form>
          <form action={deleteTestWithId}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 text-sm rounded-lg border border-red-200 text-[#ef3444] hover:bg-red-50 px-4 py-2 transition"
            >
              <TrashIcon className="w-4 h-4" />
              Delete Test
            </button>
          </form>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 mb-8">
        <h2 className="text-lg font-medium text-[#1a2025] mb-4">Test Details</h2>
        <form action={updateDetailsWithId} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Test Name
            </label>
            <input
              name="name"
              defaultValue={test.name}
              required
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={test.description ?? ""}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444]"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[#ef3444] hover:bg-[#ff3b45] text-white font-semibold px-4 py-2 text-sm transition"
          >
            Save Details
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 mb-8">
        <h2 className="text-lg font-medium text-[#1a2025] mb-4">CEFR Score Bands</h2>
        <div className="space-y-3">
          {test.levels.map((level) => {
            const updateWithIds = updateLevel.bind(null, level.id, test.id);
            const deleteWithIds = deleteLevel.bind(null, level.id, test.id);
            return (
              <form
                key={level.id}
                action={updateWithIds}
                className="grid grid-cols-2 sm:grid-cols-12 gap-2 items-center rounded-lg border border-gray-200 bg-gray-50 p-3"
              >
                <input
                  name="code"
                  defaultValue={level.code}
                  placeholder="Code"
                  className="sm:col-span-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-[#ef3444]"
                />
                <input
                  name="name"
                  defaultValue={level.name}
                  placeholder="Name"
                  className="sm:col-span-2 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-[#ef3444]"
                />
                <input
                  type="number"
                  name="minScore"
                  defaultValue={level.minScore}
                  placeholder="Min"
                  className="sm:col-span-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-[#ef3444]"
                />
                <input
                  type="number"
                  name="maxScore"
                  defaultValue={level.maxScore}
                  placeholder="Max"
                  className="sm:col-span-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-[#ef3444]"
                />
                <input
                  name="description"
                  defaultValue={level.description ?? ""}
                  placeholder="Description"
                  className="sm:col-span-4 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-[#ef3444]"
                />
                <button
                  type="submit"
                  className="sm:col-span-2 text-xs rounded-md bg-[#1a2025] hover:bg-black text-white font-semibold px-3 py-1.5 transition"
                >
                  Save
                </button>
                <button
                  formAction={deleteWithIds}
                  type="submit"
                  className="sm:col-span-1 flex items-center justify-center rounded-md text-gray-400 hover:text-[#ef3444] py-1.5"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </form>
            );
          })}
        </div>

        <details className="mt-4">
          <summary className="text-sm text-[#ef3444] font-medium cursor-pointer">
            + Add level
          </summary>
          <form
            action={createLevelWithId}
            className="grid grid-cols-2 sm:grid-cols-12 gap-2 items-center rounded-lg border border-gray-200 bg-gray-50 p-3 mt-3"
          >
            <input
              name="code"
              placeholder="Code (A1)"
              required
              className="sm:col-span-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-[#ef3444]"
            />
            <input
              name="name"
              placeholder="Name"
              required
              className="sm:col-span-2 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-[#ef3444]"
            />
            <input
              type="number"
              name="minScore"
              placeholder="Min"
              defaultValue={0}
              className="sm:col-span-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-[#ef3444]"
            />
            <input
              type="number"
              name="maxScore"
              placeholder="Max"
              defaultValue={0}
              className="sm:col-span-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-[#ef3444]"
            />
            <input
              name="description"
              placeholder="Description"
              className="sm:col-span-4 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-[#ef3444]"
            />
            <button
              type="submit"
              className="sm:col-span-3 text-xs rounded-md bg-[#ef3444] hover:bg-[#ff3b45] text-white font-semibold px-3 py-1.5 transition"
            >
              Add Level
            </button>
          </form>
        </details>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-[#1a2025]">
            Questions ({test.questions.length})
          </h2>
          <Link
            href={`/admin/tests/${test.id}/questions/new`}
            className="inline-flex items-center gap-1.5 text-sm rounded-lg bg-[#ef3444] hover:bg-[#ff3b45] text-white font-semibold px-3 py-1.5 transition"
          >
            <PlusIcon className="w-4 h-4" />
            Add Question
          </Link>
        </div>
        <div className="space-y-4">
          {test.questions.map((q, i) => {
            const deleteWithIds = deleteQuestion.bind(null, q.id, test.id);
            return (
              <div key={q.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <p className="text-sm text-[#1a2025] flex items-center gap-2 flex-1">
                    <span className="text-gray-500">{i + 1}.</span>
                    <span className="flex-1">{q.text}</span>
                    {q.level && (
                      <span className="shrink-0 rounded-full bg-red-50 text-[#ef3444] text-xs font-semibold px-2 py-0.5">
                        {q.level.code}
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      href={`/admin/tests/${test.id}/questions/${q.id}`}
                      title="Edit question"
                      className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-gray-200 text-gray-500 hover:border-[#ef3444] hover:text-[#ef3444] transition"
                    >
                      <EyeIcon className="w-3.5 h-3.5" />
                    </Link>
                    <form action={deleteWithIds}>
                      <button
                        type="submit"
                        title="Delete question"
                        className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-red-200 text-[#ef3444] hover:bg-red-50 transition"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-6">
                  {q.options.map((o) => (
                    <div
                      key={o.id}
                      className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
                        o.isCorrect ? "bg-green-50 text-green-700" : "text-gray-500"
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
            );
          })}
        </div>
      </section>
    </div>
  );
}
