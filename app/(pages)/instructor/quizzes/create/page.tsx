import dynamic from "next/dynamic";

const CreateQuiz = dynamic(() => import("./CreateQuiz"), { ssr: false });

export default function CreateQuizPage() {
  return <CreateQuiz />;
}
