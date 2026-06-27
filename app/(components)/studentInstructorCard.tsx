import type { InstructorQuiz } from "@/actions/client/quiz.action";

function StudentInstructorCard({ inst }: { inst: InstructorQuiz }) {
  return (
    <div className="border border-gray-200 rounded-2xl p-3 flex items-center gap-2 mb-3">
      <div className="w-7 h-7 rounded-full bg-[#56205E]/10 flex items-center justify-center text-xs font-medium text-[#56205E]">
        {inst.instructorName?.charAt(0)?.toUpperCase() ?? "?"}
      </div>
      <p className="text-sm font-medium text-gray-700">
        {inst.instructorName}
      </p>
    </div>
  );
}

export default StudentInstructorCard;
