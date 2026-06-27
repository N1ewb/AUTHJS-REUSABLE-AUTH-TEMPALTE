import { getQuizByCode } from "@/actions/client/standardQuiz.action";
import { notFound } from "next/navigation";
import StudentStandardQuizIntro from "./StudentStandardQuizIntro";

export default async function StandardQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: code } = await params;
  const quiz = await getQuizByCode(code);

  if (!quiz) notFound();

  return <StudentStandardQuizIntro quiz={quiz} />;
}
