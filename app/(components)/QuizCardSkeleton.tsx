import { Skeleton } from "@/components/ui/skeleton"

function QuizCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border p-1 h-full flex flex-col">
      <Skeleton className="w-full aspect-[2/1] rounded-lg" />

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="flex items-center gap-3 mt-auto">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-16 rounded" />
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2 border-t">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default QuizCardSkeleton
