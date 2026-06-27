import StudentLiveSession from "./StudentLiveSession";

export default async function StudentLiveQuizSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StudentLiveSession code={id} />;
}
