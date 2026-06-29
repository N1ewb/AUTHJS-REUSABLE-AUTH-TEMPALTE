import Link from "next/link";
import { Frown } from "lucide-react";

export default function StudentStandardQuizNotFound() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow min-h-0 gap-4 text-center px-4">
      <Frown className="size-16 text-muted-foreground" />
      <h1 className="text-3xl font-bold">Quiz Not Found</h1>
      <p className="text-muted-foreground max-w-md">
        This quiz doesn&apos;t exist or the link may be incorrect. Check the
        code and try again.
      </p>
      <Link
        href="/student/dashboard"
        className="mt-2 inline-flex items-center rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
