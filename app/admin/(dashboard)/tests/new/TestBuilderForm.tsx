"use client";

import { useState, useTransition } from "react";
import { createTest, type CreateTestState } from "@/app/admin/actions/tests";
import { buildCefrBandsForQuestionCount } from "@/app/lib/grading";
import { PlusIcon, XIcon } from "@/app/admin/icons";

type LevelDraft = {
  code: string;
  name: string;
  description: string;
  minScore: number;
  maxScore: number;
};

type OptionDraft = {
  label: string;
  text: string;
  isCorrect: boolean;
};

type QuestionDraft = {
  text: string;
  levelCode: string;
  options: OptionDraft[];
};

const OPTION_LABELS = ["A", "B", "C", "D"];

function emptyQuestion(levelCode: string): QuestionDraft {
  return {
    text: "",
    levelCode,
    options: OPTION_LABELS.map((label) => ({ label, text: "", isCorrect: false })),
  };
}

function standardLevels(questionCount: number): LevelDraft[] {
  return buildCefrBandsForQuestionCount(questionCount).map((band) => ({
    code: band.code,
    name: band.name,
    description: band.description,
    minScore: band.minScore,
    maxScore: band.maxScore,
  }));
}

export default function TestBuilderForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [levels, setLevels] = useState<LevelDraft[]>(standardLevels(1));
  const [questions, setQuestions] = useState<QuestionDraft[]>([emptyQuestion(standardLevels(1)[0].code)]);
  const [state, setState] = useState<CreateTestState>(undefined);
  const [pending, startTransition] = useTransition();

  function updateQuestionText(index: number, text: string) {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, text } : q)));
  }

  function updateOptionText(qIndex: number, oIndex: number, text: string) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((o, oi) => (oi === oIndex ? { ...o, text } : o)),
            }
          : q
      )
    );
  }

  function setCorrectOption(qIndex: number, oIndex: number) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((o, oi) => ({ ...o, isCorrect: oi === oIndex })),
            }
          : q
      )
    );
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, emptyQuestion(levels[0]?.code ?? "")]);
  }

  function removeQuestion(index: number) {
    setQuestions((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }

  function updateQuestionLevel(index: number, levelCode: string) {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, levelCode } : q)));
  }

  function resetLevelsToStandard() {
    const fresh = standardLevels(questions.length);
    setLevels(fresh);
    setQuestions((prev) => prev.map((q) => ({ ...q, levelCode: fresh[0].code })));
  }

  function updateLevel(index: number, patch: Partial<LevelDraft>) {
    setLevels((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  }

  function addLevel() {
    setLevels((prev) => [
      ...prev,
      { code: "", name: "", description: "", minScore: 0, maxScore: 0 },
    ]);
  }

  function removeLevel(index: number) {
    setLevels((prev) => {
      if (prev.length <= 1) return prev;
      const removedCode = prev[index].code;
      const next = prev.filter((_, i) => i !== index);
      setQuestions((qs) =>
        qs.map((q) => (q.levelCode === removedCode ? { ...q, levelCode: next[0].code } : q))
      );
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState(undefined);
    startTransition(async () => {
      const result = await createTest({
        name,
        description,
        levels: levels.map((l) => ({
          code: l.code,
          name: l.name,
          description: l.description,
          minScore: Number(l.minScore),
          maxScore: Number(l.maxScore),
        })),
        questions: questions.map((q) => ({
          text: q.text,
          levelCode: q.levelCode,
          options: q.options.filter((o) => o.text.trim().length > 0),
        })),
      });
      if (result) setState(result);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Test info */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium text-[#1a2025] mb-4">Test Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Test Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. General English CEFR Placement Test"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-[#1a2025] placeholder:text-gray-400 outline-none focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Short description shown to test takers"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-[#1a2025] placeholder:text-gray-400 outline-none focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444]"
            />
          </div>
        </div>
      </section>

      {/* Levels */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium text-[#1a2025]">CEFR Levels</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Score ranges that determine the CEFR band ({questions.length} question
              {questions.length === 1 ? "" : "s"} total)
            </p>
          </div>
          <button
            type="button"
            onClick={resetLevelsToStandard}
            className="text-xs rounded-lg border border-gray-300 hover:border-[#ef3444] text-gray-600 hover:text-[#ef3444] px-3 py-1.5 transition"
          >
            Auto-fill standard CEFR
          </button>
        </div>

        <div className="space-y-3">
          {levels.map((level, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-2 items-start rounded-lg border border-gray-200 bg-gray-50 p-3"
            >
              <input
                value={level.code}
                onChange={(e) => updateLevel(i, { code: e.target.value })}
                placeholder="Code (A1)"
                className="col-span-2 rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm text-[#1a2025] placeholder:text-gray-400 outline-none focus:border-[#ef3444]"
              />
              <input
                value={level.name}
                onChange={(e) => updateLevel(i, { name: e.target.value })}
                placeholder="Name (Beginner)"
                className="col-span-3 rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm text-[#1a2025] placeholder:text-gray-400 outline-none focus:border-[#ef3444]"
              />
              <input
                type="number"
                value={level.minScore}
                onChange={(e) => updateLevel(i, { minScore: Number(e.target.value) })}
                placeholder="Min"
                className="col-span-1 rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm text-[#1a2025] placeholder:text-gray-400 outline-none focus:border-[#ef3444]"
              />
              <input
                type="number"
                value={level.maxScore}
                onChange={(e) => updateLevel(i, { maxScore: Number(e.target.value) })}
                placeholder="Max"
                className="col-span-1 rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm text-[#1a2025] placeholder:text-gray-400 outline-none focus:border-[#ef3444]"
              />
              <input
                value={level.description}
                onChange={(e) => updateLevel(i, { description: e.target.value })}
                placeholder="Description / action plan"
                className="col-span-4 rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm text-[#1a2025] placeholder:text-gray-400 outline-none focus:border-[#ef3444]"
              />
              <button
                type="button"
                onClick={() => removeLevel(i)}
                className="col-span-1 flex items-center justify-center rounded-md text-gray-400 hover:text-[#ef3444] py-2"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addLevel}
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#ef3444] hover:text-[#ff3b45] font-medium"
        >
          <PlusIcon className="w-4 h-4" />
          Add level
        </button>
      </section>

      {/* Questions */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-[#1a2025]">
            Questions ({questions.length})
          </h2>
        </div>

        <div className="space-y-5">
          {questions.map((q, qi) => (
            <div key={qi} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start gap-3 mb-3">
                <span className="mt-2.5 text-sm text-gray-500 font-medium w-6 shrink-0">
                  {qi + 1}.
                </span>
                <input
                  value={q.text}
                  onChange={(e) => updateQuestionText(qi, e.target.value)}
                  placeholder="Question text"
                  required
                  className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-[#1a2025] placeholder:text-gray-400 outline-none focus:border-[#ef3444]"
                />
                <select
                  value={q.levelCode}
                  onChange={(e) => updateQuestionLevel(qi, e.target.value)}
                  className="mt-0 rounded-md border border-gray-300 bg-white px-2 py-2 text-sm text-[#1a2025] outline-none focus:border-[#ef3444]"
                >
                  {levels.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.code || "—"}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeQuestion(qi)}
                  className="mt-1.5 flex items-center justify-center text-gray-400 hover:text-[#ef3444] px-2"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="ml-9 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((o, oi) => (
                  <label
                    key={o.label}
                    className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition ${
                      o.isCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`correct-${qi}`}
                      checked={o.isCorrect}
                      onChange={() => setCorrectOption(qi, oi)}
                      className="accent-green-600"
                    />
                    <span className="text-xs font-semibold text-gray-500 w-4">
                      {o.label}
                    </span>
                    <input
                      value={o.text}
                      onChange={(e) => updateOptionText(qi, oi, e.target.value)}
                      placeholder={`Option ${o.label}`}
                      className="flex-1 bg-transparent text-sm text-[#1a2025] placeholder:text-gray-400 outline-none"
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addQuestion}
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-[#ef3444] hover:text-[#ff3b45] font-medium"
        >
          <PlusIcon className="w-4 h-4" />
          Add question
        </button>
      </section>

      {state?.error && (
        <p className="text-sm text-[#ef3444] bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {state.error}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[#ef3444] hover:bg-[#ff3b45] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 transition"
        >
          {pending ? "Creating test..." : "Create Test"}
        </button>
      </div>
    </form>
  );
}
