import { getStudentQuizHistory } from "@/actions/client/quiz.action";
import StudentQuizzes from "./StudentQuizzes";

export default async function StudentQuizzesPage() {
  const history = await getStudentQuizHistory();
  return <StudentQuizzes history={history} />;
}
