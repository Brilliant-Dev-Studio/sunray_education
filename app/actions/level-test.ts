"use server";

import * as z from "zod";
import { prisma } from "@/app/lib/prisma";
import { resolveLevelForScore } from "@/app/lib/grading";

export type PublicQuestion = {
  id: string;
  text: string;
  options: { id: string; label: string; text: string }[];
};

export async function getAllTestQuestions(testId: string): Promise<PublicQuestion[]> {
  const questions = await prisma.question.findMany({
    where: { testId },
    orderBy: { order: "asc" },
    include: { options: { orderBy: { label: "asc" } } },
  });

  return questions.map((q) => ({
    id: q.id,
    text: q.text,
    options: q.options.map((o) => ({ id: o.id, label: o.label, text: o.text })),
  }));
}

const SubmitSchema = z.object({
  testId: z.string().min(1),
  timeTakenSeconds: z.number().int().min(0),
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      optionId: z.string().min(1),
    })
  ),
});

export type SubmitLevelTestInput = z.infer<typeof SubmitSchema>;

export type SubmitLevelTestResult =
  | {
      error: string;
    }
  | {
      score: number;
      total: number;
      percentage: number;
      timeTakenSeconds: number;
      level: { code: string; name: string; description: string | null };
    };

// Grades every question in the test (mixed CEFR levels), then maps the total
// score onto whichever level's score band the result falls into.
export async function submitLevelTestAttempt(
  input: SubmitLevelTestInput
): Promise<SubmitLevelTestResult> {
  const validated = SubmitSchema.safeParse(input);
  if (!validated.success) {
    return { error: "Invalid submission." };
  }

  const { testId, answers, timeTakenSeconds } = validated.data;

  const [questions, levels] = await Promise.all([
    prisma.question.findMany({ where: { testId }, include: { options: true } }),
    prisma.level.findMany({ where: { testId } }),
  ]);

  if (questions.length === 0) {
    return { error: "This test has no questions yet." };
  }
  if (levels.length === 0) {
    return { error: "This test has no levels configured." };
  }

  const answerByQuestion = new Map(answers.map((a) => [a.questionId, a.optionId]));

  let score = 0;
  for (const question of questions) {
    const selectedOptionId = answerByQuestion.get(question.id);
    if (!selectedOptionId) continue;
    const selected = question.options.find((o) => o.id === selectedOptionId);
    if (selected?.isCorrect) score += 1;
  }

  const total = questions.length;
  const percentage = Math.round((score / total) * 100);
  const level = resolveLevelForScore(score, levels);

  if (!level) {
    return { error: "Could not determine your level." };
  }

  return {
    score,
    total,
    percentage,
    timeTakenSeconds,
    level: { code: level.code, name: level.name, description: level.description },
  };
}
