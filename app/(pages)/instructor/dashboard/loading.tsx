import { Skeleton } from "@/components/ui/skeleton";

export default function InstructorDashboardLoading() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl border p-5 flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="w-20 h-3" />
              <Skeleton className="w-12 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border mb-8">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <Skeleton className="w-32 h-5" />
          <Skeleton className="w-16 h-4" />
        </div>
        <div className="divide-y">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4">
              <div className="space-y-1.5">
                <Skeleton className="w-48 h-4" />
                <Skeleton className="w-24 h-3" />
              </div>
              <div className="flex items-center gap-6">
                <div className="space-y-1.5 text-center">
                  <Skeleton className="w-8 h-4 mx-auto" />
                  <Skeleton className="w-14 h-3 mx-auto" />
                </div>
                <div className="space-y-1.5 text-center">
                  <Skeleton className="w-8 h-4 mx-auto" />
                  <Skeleton className="w-14 h-3 mx-auto" />
                </div>
                <Skeleton className="w-16 h-6 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Skeleton className="w-36 h-10 rounded-lg" />
    </div>
  );
}
