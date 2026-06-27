import { notFound } from "next/navigation";
import { getQuizById } from "@/actions/client/quiz.action";
import QuizPage from "./QuizPage";

export default async function QuizDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const quiz = await getQuizById(id);
  if (!quiz) notFound();

  return <QuizPage quiz={quiz} />;
}
