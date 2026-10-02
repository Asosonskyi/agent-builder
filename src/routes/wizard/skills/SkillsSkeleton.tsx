import { Skeleton } from "@/components/common/Skeleton"

interface SkillsSkeletonProps {
  count?: number
}

export function SkillsSkeleton({ count = 4 }: SkillsSkeletonProps) {
  return (
    <div className="flex flex-col gap-6" aria-busy>
      <Skeleton className="h-4 w-48" />
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex gap-3 sm:gap-4">
          <Skeleton className="size-14 shrink-0 sm:size-20" />
          <div className="flex flex-1 flex-col gap-3 pt-1">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
