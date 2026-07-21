import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import Header from "@/app/Header";
import { getUserSession } from "@/app/lib/userSession";
import TestRunner from "../TestRunner";

export const metadata: Metadata = {
  title: "Test Level",
};

export default async function LevelTestRunnerPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;

  const session = await getUserSession();
  if (!session?.userId) {
    redirect(`/login?redirect=${encodeURIComponent(`/level-test/${testId}`)}`);
  }

  const test = await prisma.test.findUnique({
    where: { id: testId, isActive: true },
    include: { _count: { select: { questions: true } } },
  });

  if (!test || test._count.questions === 0) {
    notFound();
  }

  return (
    <>
      <Header />
      <TestRunner
        test={{ id: test.id, name: test.name }}
        questionCount={test._count.questions}
      />
    </>
  );
}
