import React from "react";
import HistoryPage from "./HistoryPage";
import { getStudentQuizHistory } from "@/actions/client/quiz.action";

async function StudentQuizHistory() {
  const history = await getStudentQuizHistory();
  if (!history) {
    <div>Loading...</div>;
  }
  return <HistoryPage history={history} />;
}

export default StudentQuizHistory;
