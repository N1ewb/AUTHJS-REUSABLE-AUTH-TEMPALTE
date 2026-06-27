import { Skeleton } from "@/components/ui/skeleton";

export default function LiveSessionLoading() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 min-h-0 py-12">
      <div className="max-w-md w-full text-center space-y-8">
        <Skeleton className="h-4 w-24 mx-auto" />

        <div className="space-y-2">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-14 w-48 mx-auto" />
          </div>

          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
