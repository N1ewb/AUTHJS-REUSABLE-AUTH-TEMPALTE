import { getStudentAttempt } from "@/actions/client/quiz.action";
import StudentResults from "./StudentResults";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const attempt = await getStudentAttempt(id);
    return <StudentResults attempt={attempt} />;
  } catch {
    return (
      <div className="flex flex-col items-center justify-center flex-1 min-h-0 p-6 text-center">
        <p className="text-sm text-muted-foreground">No results available for this session.</p>
      </div>
    );
  }
}
