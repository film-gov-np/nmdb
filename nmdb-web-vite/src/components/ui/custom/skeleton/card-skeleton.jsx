import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton({ count = 1 }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={"main-row" + i} className="space-y-4 rounded-md border p-4">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-12" />
        </div>
      ))}
    </div>
  );
}
