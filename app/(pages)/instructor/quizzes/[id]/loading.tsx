import { Skeleton } from "@/components/ui/skeleton";

export default function QuizDetailLoading() {
  return (
    <div className="flex flex-col flex-grow min-h-0 gap-8">
      <div className="flex justify-between rounded-2xl border border-gray-200 w-full p-6">
        <div className="flex flex-col justify-between flex-grow gap-4">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
            <Skeleton className="h-4 w-32 rounded-full" />
          </div>

          <div className="flex gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>

          <div className="flex gap-5">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>

        <Skeleton className="w-[30%] rounded-2xl aspect-[4/3]" />
      </div>

      <div className="flex-1 space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  );
}
