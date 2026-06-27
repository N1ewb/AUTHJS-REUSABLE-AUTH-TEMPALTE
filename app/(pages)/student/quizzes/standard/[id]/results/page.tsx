import { notFound } from "next/navigation";
import StandardQuizResults from "./StandardQuizResults";

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ attemptId?: string; timedOut?: string }>;
}) {
  await params;
  const { attemptId, timedOut } = await searchParams;
  if (!attemptId) notFound();

  return <StandardQuizResults attemptId={attemptId} timedOut={timedOut === "1"} />;
}
