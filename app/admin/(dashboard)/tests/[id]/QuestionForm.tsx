import Link from "next/link";
import { ArrowLeftIcon } from "@/app/admin/icons";

type LevelOption = { id: string; code: string; name: string };

type QuestionDefaults = {
  text: string;
  levelId: string | null;
  options: { label: string; text: string; isCorrect: boolean }[];
};

const LABELS = ["A", "B", "C", "D"];

export default function QuestionForm({
  testId,
  levels,
  action,
  defaults,
  title,
}: {
  testId: string;
  levels: LevelOption[];
  action: (formData: FormData) => void;
  defaults?: QuestionDefaults;
  title: string;
}) {
  const correctIndex = defaults?.options.findIndex((o) => o.isCorrect) ?? -1;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link
        href={`/admin/tests/${testId}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a2025]"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Test
      </Link>
      <h1 className="text-2xl font-semibold text-[#1a2025] mt-2 mb-6">{title}</h1>

      <form action={action} className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Question Text
          </label>
          <input
            name="text"
            defaultValue={defaults?.text ?? ""}
            required
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Level</label>
          <select
            name="levelId"
            defaultValue={defaults?.levelId ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444]"
          >
            <option value="">No level</option>
            {levels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.code} · {l.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Options (select the correct one)
          </label>
          <div className="space-y-2.5">
            {LABELS.map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="correct"
                  value={i}
                  defaultChecked={i === correctIndex}
                  required
                  className="accent-[#ef3444]"
                />
                <span className="text-xs font-semibold text-gray-500 w-4">{label}</span>
                <input
                  name={`option_${label}`}
                  defaultValue={defaults?.options[i]?.text ?? ""}
                  placeholder={`Option ${label}`}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444]"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-[#ef3444] hover:bg-[#ff3b45] text-white font-semibold px-5 py-2.5 text-sm transition"
        >
          Save Question
        </button>
      </form>
    </div>
  );
}
