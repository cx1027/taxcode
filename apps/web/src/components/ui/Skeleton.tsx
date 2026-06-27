import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-skeleton-pulse rounded-md bg-secondary/60",
        className
      )}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-soft",
        className
      )}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

export function SkeletonTableRow({ className }: SkeletonProps) {
  return (
    <div className={cn("flex items-center gap-4 border-b border-border py-3", className)}>
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="ml-auto h-6 w-20 rounded-full" />
    </div>
  );
}

export function SkeletonList({ count = 3, className }: SkeletonProps & { count?: number }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonTableRow key={i} />
      ))}
    </div>
  );
}
