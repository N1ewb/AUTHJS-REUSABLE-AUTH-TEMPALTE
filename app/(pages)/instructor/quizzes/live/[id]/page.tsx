import { getLiveSession } from "@/actions/client/quiz.action";
import { notFound } from "next/navigation";
import QuizLiveSessionPage from "./QuizLiveSessionPage";

export default async function QuizSession({
  params,
}: {
  params: { id: string };
}) {
  const session = await getLiveSession(params.id);
  if (!session) notFound();

  return <QuizLiveSessionPage session={session} />;
}
