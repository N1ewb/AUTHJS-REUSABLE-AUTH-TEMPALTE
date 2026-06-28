import { getQuizAttemptSessions } from "@/actions/client/quiz.action";
import { notFound } from "next/navigation";
import QuizAttemptsList from "./QuizAttemptsList";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const sessions = await getQuizAttemptSessions(id);
    return <QuizAttemptsList sessions={sessions} />;
  } catch {
    notFound();
  }
}
