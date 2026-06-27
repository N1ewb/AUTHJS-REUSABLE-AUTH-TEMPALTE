import { Skeleton } from "@/components/ui/skeleton";

export default function StudentQuizzesLoading() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 min-h-0 py-16">
      <div className="max-w-sm w-full text-center space-y-6">
        <Skeleton className="w-14 h-14 mx-auto rounded-2xl" />
        <Skeleton className="h-6 w-40 mx-auto" />
        <Skeleton className="h-4 w-56 mx-auto" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}
