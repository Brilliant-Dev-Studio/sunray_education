"use server";

import * as z from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { verifyAdminSession } from "@/app/lib/dal";

const OptionSchema = z.object({
  label: z.string().min(1).max(2),
  text: z.string().min(1, { error: "Option text is required." }),
  isCorrect: z.boolean(),
});

const QuestionSchema = z.object({
  text: z.string().min(1, { error: "Question text is required." }),
  levelCode: z.string().min(1, { error: "Each question needs a level." }),
  options: z
    .array(OptionSchema)
    .min(2, { error: "Each question needs at least 2 options." })
    .refine((opts) => opts.some((o) => o.isCorrect), {
      error: "Each question needs exactly one correct answer.",
    }),
});

const LevelSchema = z.object({
  code: z.string().min(1, { error: "Level code is required." }),
  name: z.string().min(1, { error: "Level name is required." }),
  description: z.string().optional(),
  minScore: z.number().int().min(0),
  maxScore: z.number().int().min(0),
});

const CreateTestSchema = z.object({
  name: z.string().min(1, { error: "Test name is required." }),
  description: z.string().optional(),
  levels: z.array(LevelSchema).min(1, { error: "Add at least one level." }),
  questions: z.array(QuestionSchema).min(1, { error: "Add at least one question." }),
});

export type CreateTestInput = z.infer<typeof CreateTestSchema>;

export type CreateTestState = {
  error?: string;
  fieldErrors?: Record<string, string>;
} | undefined;

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "test"
  );
}

export async function createTest(input: CreateTestInput): Promise<CreateTestState> {
  await verifyAdminSession();

  const validated = CreateTestSchema.safeParse(input);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Invalid form data." };
  }

  const { name, description, levels, questions } = validated.data;

  const levelCodes = new Set(levels.map((l) => l.code));
  const unknownLevel = questions.find((q) => !levelCodes.has(q.levelCode));
  if (unknownLevel) {
    return { error: "Every question must reference a level defined above." };
  }

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.test.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++suffix}`;
  }

  const testId = await prisma.$transaction(async (tx) => {
    const test = await tx.test.create({
      data: {
        name,
        slug,
        description: description || null,
        levels: {
          create: levels.map((level, index) => ({
            code: level.code,
            name: level.name,
            description: level.description || null,
            minScore: level.minScore,
            maxScore: level.maxScore,
            order: index,
          })),
        },
      },
      include: { levels: true },
    });

    const levelIdByCode = new Map(test.levels.map((l) => [l.code, l.id]));

    for (const [index, question] of questions.entries()) {
      await tx.question.create({
        data: {
          testId: test.id,
          levelId: levelIdByCode.get(question.levelCode) ?? null,
          text: question.text,
          order: index,
          options: {
            create: question.options.map((option) => ({
              label: option.label,
              text: option.text,
              isCorrect: option.isCorrect,
            })),
          },
        },
      });
    }

    return test.id;
  }, { maxWait: 15000, timeout: 15000 });

  redirect(`/admin/tests/${testId}`);
}

export async function deleteTest(testId: string) {
  await verifyAdminSession();
  await prisma.test.delete({ where: { id: testId } });
  redirect("/admin/tests");
}

export async function toggleTestActive(testId: string, isActive: boolean) {
  await verifyAdminSession();
  await prisma.test.update({ where: { id: testId }, data: { isActive } });
  revalidatePath(`/admin/tests/${testId}`);
  revalidatePath("/admin/tests");
}

export async function updateTestDetails(testId: string, formData: FormData) {
  await verifyAdminSession();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!name) return;

  await prisma.test.update({
    where: { id: testId },
    data: { name, description: description || null },
  });
  revalidatePath(`/admin/tests/${testId}`);
  revalidatePath("/admin/tests");
}

export async function createLevel(testId: string, formData: FormData) {
  await verifyAdminSession();
  const code = String(formData.get("code") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const minScore = Number(formData.get("minScore") ?? 0);
  const maxScore = Number(formData.get("maxScore") ?? 0);
  if (!code || !name) return;

  const count = await prisma.level.count({ where: { testId } });
  await prisma.level.create({
    data: { testId, code, name, description: description || null, minScore, maxScore, order: count },
  });
  revalidatePath(`/admin/tests/${testId}`);
}

export async function updateLevel(levelId: string, testId: string, formData: FormData) {
  await verifyAdminSession();
  const code = String(formData.get("code") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const minScore = Number(formData.get("minScore") ?? 0);
  const maxScore = Number(formData.get("maxScore") ?? 0);
  if (!code || !name) return;

  await prisma.level.update({
    where: { id: levelId },
    data: { code, name, description: description || null, minScore, maxScore },
  });
  revalidatePath(`/admin/tests/${testId}`);
}

export async function deleteLevel(levelId: string, testId: string) {
  await verifyAdminSession();
  await prisma.level.delete({ where: { id: levelId } });
  revalidatePath(`/admin/tests/${testId}`);
}

const QuestionFormSchema = z.object({
  text: z.string().min(1, { error: "Question text is required." }),
  levelId: z.string().optional(),
  labels: z.array(z.string()),
  texts: z.array(z.string()),
  correctIndex: z.number().int(),
});

function parseQuestionForm(formData: FormData) {
  const text = String(formData.get("text") ?? "").trim();
  const levelId = String(formData.get("levelId") ?? "") || undefined;
  const labels = ["A", "B", "C", "D"];
  const texts = labels.map((l) => String(formData.get(`option_${l}`) ?? "").trim());
  const correctIndex = Number(formData.get("correct") ?? -1);

  return QuestionFormSchema.safeParse({ text, levelId, labels, texts, correctIndex });
}

export async function createQuestion(testId: string, formData: FormData) {
  await verifyAdminSession();
  const parsed = parseQuestionForm(formData);
  if (!parsed.success) return;
  const { text, levelId, labels, texts, correctIndex } = parsed.data;

  const filled = labels
    .map((label, i) => ({ label, text: texts[i], isCorrect: i === correctIndex }))
    .filter((o) => o.text.length > 0);
  if (filled.length < 2 || !filled.some((o) => o.isCorrect)) return;

  const count = await prisma.question.count({ where: { testId } });
  await prisma.question.create({
    data: {
      testId,
      levelId: levelId || null,
      text,
      order: count,
      options: { create: filled },
    },
  });
  revalidatePath(`/admin/tests/${testId}`);
  redirect(`/admin/tests/${testId}`);
}

export async function updateQuestion(questionId: string, testId: string, formData: FormData) {
  await verifyAdminSession();
  const parsed = parseQuestionForm(formData);
  if (!parsed.success) return;
  const { text, levelId, labels, texts, correctIndex } = parsed.data;

  const filled = labels
    .map((label, i) => ({ label, text: texts[i], isCorrect: i === correctIndex }))
    .filter((o) => o.text.length > 0);
  if (filled.length < 2 || !filled.some((o) => o.isCorrect)) return;

  await prisma.$transaction([
    prisma.option.deleteMany({ where: { questionId } }),
    prisma.question.update({
      where: { id: questionId },
      data: {
        text,
        levelId: levelId || null,
        options: { create: filled },
      },
    }),
  ]);
  revalidatePath(`/admin/tests/${testId}`);
  redirect(`/admin/tests/${testId}`);
}

export async function deleteQuestion(questionId: string, testId: string) {
  await verifyAdminSession();
  await prisma.question.delete({ where: { id: questionId } });
  revalidatePath(`/admin/tests/${testId}`);
}
