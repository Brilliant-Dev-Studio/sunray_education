import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { createQuestion } from "@/app/admin/actions/tests";
import QuestionForm from "../../QuestionForm";

export default async function NewQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const test = await prisma.test.findUnique({
    where: { id },
    include: { levels: { orderBy: { order: "asc" } } },
  });

  if (!test) notFound();

  const createWithTestId = createQuestion.bind(null, test.id);

  return (
    <QuestionForm
      testId={test.id}
      levels={test.levels}
      action={createWithTestId}
      title="Add Question"
    />
  );
}
