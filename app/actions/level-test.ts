"use server";

import * as z from "zod";
import { prisma } from "@/app/lib/prisma";

export type PublicQuestion = {
  id: string;
  text: string;
  options: { id: string; label: string; text: string }[];
};

export async function getLevelQuestions(
  testId: string,
  levelId: string
): Promise<PublicQuestion[]> {
  const questions = await prisma.question.findMany({
    where: { testId, levelId },
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
  levelId: z.string().min(1),
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

export async function submitLevelTestAttempt(
  input: SubmitLevelTestInput
): Promise<SubmitLevelTestResult> {
  const validated = SubmitSchema.safeParse(input);
  if (!validated.success) {
    return { error: "Invalid submission." };
  }

  const { testId, levelId, answers, timeTakenSeconds } = validated.data;

  const level = await prisma.level.findFirst({
    where: { id: levelId, testId },
  });
  if (!level) {
    return { error: "Level not found." };
  }

  const questions = await prisma.question.findMany({
    where: { testId, levelId },
    include: { options: true },
  });
  if (questions.length === 0) {
    return { error: "This level has no questions yet." };
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

  return {
    score,
    total,
    percentage,
    timeTakenSeconds,
    level: { code: level.code, name: level.name, description: level.description },
  };
}
