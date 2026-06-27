import { getQuizByCode } from "@/actions/client/standardQuiz.action";
import { notFound } from "next/navigation";
import StandardQuestionPage from "./StandardQuestionPage";

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string; question_number: string }>;
}) {
  const { id: code, question_number } = await params;
  const quiz = await getQuizByCode(code);
  if (!quiz) notFound();

  const questionNumber = parseInt(question_number);
  const question = quiz.questions[questionNumber - 1];
  if (!question) notFound();

  return (
    <StandardQuestionPage
      quizCode={code}
      question={question}
      questionNumber={questionNumber}
      totalQuestions={quiz._count.questions}
    />
  );
}
