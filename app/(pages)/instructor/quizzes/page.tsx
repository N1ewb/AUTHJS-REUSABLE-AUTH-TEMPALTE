import { getQuizzes } from "@/actions/client/quiz.action";
import Quizzes from "./Quizzes";
import QuizCardSkeleton from "@/app/(components)/QuizCardSkeleton";

export default async function InstructorQuizzesPage() {
  const quizzes = await getQuizzes();
  if (!quizzes) {
    return <QuizCardSkeleton />;
  }
  return <Quizzes quizzes={quizzes} />;
}
