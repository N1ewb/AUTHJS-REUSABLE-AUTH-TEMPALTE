import { redirect } from "next/navigation";

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/instructor/quizzes/live/${id}`);
}
