"use server";

import * as z from "zod";
import { redirect } from "next/navigation";
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
}
