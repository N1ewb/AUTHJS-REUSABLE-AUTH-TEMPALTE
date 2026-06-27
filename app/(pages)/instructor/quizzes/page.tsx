import { getQuizzes, getInstructorSessionHistory } from "@/actions/client/quiz.action";
import QuizzesSection from "./QuizzesSection";
import QuizCardSkeleton from "@/app/(components)/QuizCardSkeleton";

export default async function InstructorQuizzesPage() {
  const [quizzes, sessions] = await Promise.all([
    getQuizzes(),
    getInstructorSessionHistory(),
  ]);
  if (!quizzes) {
    return <QuizCardSkeleton />;
  }
  return <QuizzesSection quizzes={quizzes} sessions={sessions} />;
}
