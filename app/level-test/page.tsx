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
      levels: {
        orderBy: { order: "asc" },
        include: { _count: { select: { questions: true } } },
      },
    },
  });

  if (!test) {
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

  const levels = test.levels
    .filter((l) => l._count.questions > 0)
    .map((l) => ({
      id: l.id,
      code: l.code,
      name: l.name,
      description: l.description,
      questionCount: l._count.questions,
    }));

  return (
    <>
      <Header />
      <LevelTestApp
        test={{ id: test.id, name: test.name, description: test.description }}
        levels={levels}
      />
    </>
  );
}
