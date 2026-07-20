import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { updateQuestion } from "@/app/admin/actions/tests";
import QuestionForm from "../../QuestionForm";

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string; qid: string }>;
}) {
  const { id, qid } = await params;

  const [test, question] = await Promise.all([
    prisma.test.findUnique({
      where: { id },
      include: { levels: { orderBy: { order: "asc" } } },
    }),
    prisma.question.findUnique({
      where: { id: qid },
      include: { options: { orderBy: { label: "asc" } } },
    }),
  ]);

  if (!test || !question || question.testId !== test.id) notFound();

  const updateWithIds = updateQuestion.bind(null, question.id, test.id);

  return (
    <QuestionForm
      testId={test.id}
      levels={test.levels}
      action={updateWithIds}
      title="Edit Question"
      defaults={{
        text: question.text,
        levelId: question.levelId,
        options: question.options.map((o) => ({
          label: o.label,
          text: o.text,
          isCorrect: o.isCorrect,
        })),
      }}
    />
  );
}
