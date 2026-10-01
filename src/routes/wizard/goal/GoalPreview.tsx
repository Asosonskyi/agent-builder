import type { Goal } from "@/api/schemas"
import { ImagePlaceholder } from "@/components/common/ImagePlaceholder"
import { Skeleton } from "@/components/common/Skeleton"

/** The image shrinks with the viewport height so the panel fits the screen (see `fitScreen`). */
const IMAGE_SIZE = "size-[min(18.75rem,30svh)]"

export function GoalPreview({ goal }: { goal: Goal | undefined }) {
  return (
    <div
      aria-live="polite"
      className="flex h-full flex-col items-center justify-center overflow-hidden bg-panel px-12 py-8 text-center"
    >
      {goal ? (
        <>
          <ImagePlaceholder src={goal.image} className={`${IMAGE_SIZE} shrink-0 bg-background`} />
          <h2 className="mt-9 text-[2rem] leading-tight font-semibold text-ink">{goal.title}</h2>
          <p className="mt-4 max-w-72 text-base text-ink-muted">{goal.description}</p>
        </>
      ) : (
        <Skeleton className={IMAGE_SIZE} />
      )}
    </div>
  )
}
