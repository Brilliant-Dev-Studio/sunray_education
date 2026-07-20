import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import Header from "@/app/Header";
import { getUserSession } from "@/app/lib/userSession";
import TestRunner from "../../TestRunner";

export const metadata: Metadata = {
  title: "Test Level",
};

export default async function LevelTestRunnerPage({
  params,
}: {
  params: Promise<{ testId: string; levelId: string }>;
}) {
  const { testId, levelId } = await params;

  const session = await getUserSession();
  if (!session?.userId) {
    redirect(`/login?redirect=${encodeURIComponent(`/level-test/${testId}/${levelId}`)}`);
  }

  const [test, level] = await Promise.all([
    prisma.test.findUnique({ where: { id: testId, isActive: true } }),
    prisma.level.findFirst({
      where: { id: levelId, testId },
      include: { _count: { select: { questions: true } } },
    }),
  ]);

  if (!test || !level || level._count.questions === 0) {
    notFound();
  }

  return (
    <>
      <Header />
      <TestRunner
        test={{ id: test.id, name: test.name }}
        level={{
          id: level.id,
          code: level.code,
          name: level.name,
          description: level.description,
          questionCount: level._count.questions,
        }}
      />
    </>
  );
}
