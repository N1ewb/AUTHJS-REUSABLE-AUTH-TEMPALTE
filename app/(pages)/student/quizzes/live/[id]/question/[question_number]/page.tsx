import { getLiveQuestion } from "@/actions/client/quiz.action";
import { notFound } from "next/navigation";
import StudentQuestionPage from "./StudentQuestionPage";

export default async function StudentQuestion({
  params,
}: {
  params: Promise<{ id: string; question_number: string }>;
}) {
  const { id, question_number } = await params;
  const questionNumber = parseInt(question_number);

  try {
    const question = await getLiveQuestion(id, questionNumber);
    return (
      <StudentQuestionPage
        sessionId={id}
        question={question}
        questionNumber={questionNumber}
      />
    );
  } catch {
    notFound();
  }
}
