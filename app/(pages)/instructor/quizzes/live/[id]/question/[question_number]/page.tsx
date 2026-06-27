import { getLiveSession } from "@/actions/client/quiz.action";
import { notFound } from "next/navigation";
import InstructorQuestionPage from "./InstructorQuestionPage";

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string; question_number: string }>;
}) {
  const { id, question_number } = await params;
  const session = await getLiveSession(id);
  if (!session) notFound();

  const questionIndex = parseInt(question_number) - 1;
  const question = session.quiz.questions[questionIndex];
  if (!question) notFound();

  return (
    <InstructorQuestionPage
      sessionId={session.id}
      quizId={session.quizId}
      question={question}
      questionNumber={parseInt(question_number)}
      totalQuestions={session.quiz.questions.length}
    />
  );
}
