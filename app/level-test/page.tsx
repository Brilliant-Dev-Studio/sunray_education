import type { Metadata } from "next";
import { prisma } from "@/app/lib/prisma";
import Header from "@/app/Header";
import LevelTestApp from "./LevelTestApp";

export const metadata: Metadata = {
  title: "Test Level",
};

export default async function LevelTestPage() {
  const test = await prisma.test.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    include: {
      levels: { orderBy: { order: "asc" } },
      _count: { select: { questions: true } },
    },
  });

  if (!test || test._count.questions === 0) {
    return (
      <>
        <Header />
        <div className="min-h-[30vh] flex items-center justify-center px-6 py-24 text-center">
          <p className="text-muted">
            No level test is available right now. Please check back soon.
          </p>
        </div>
      </>
    );
  }

  const levels = test.levels.map((l) => ({ code: l.code, name: l.name }));

  return (
    <>
      <Header />
      <LevelTestApp
        test={{ id: test.id, name: test.name, description: test.description }}
        levels={levels}
        questionCount={test._count.questions}
      />
    </>
  );
}
