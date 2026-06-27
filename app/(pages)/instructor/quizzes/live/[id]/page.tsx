import { getLiveSession } from "@/actions/client/quiz.action";
import { notFound } from "next/navigation";
import QuizLiveSessionPage from "./QuizLiveSessionPage";

export default async function QuizSession({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getLiveSession(id);
  if (!session) notFound();

  return <QuizLiveSessionPage session={session} />;
}
