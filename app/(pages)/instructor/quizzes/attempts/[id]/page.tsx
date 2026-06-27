import { getLiveSession } from "@/actions/client/quiz.action";
import { notFound } from "next/navigation";
import AttemptDetailPage from "./AttemptDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const session = await getLiveSession(id);
    return <AttemptDetailPage session={session} />;
  } catch {
    notFound();
  }
}
