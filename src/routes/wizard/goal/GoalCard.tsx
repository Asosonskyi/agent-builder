import { cn } from "cn"
import type { Goal } from "@/api/schemas"
import { ImagePlaceholder } from "@/components/common/ImagePlaceholder"

interface GoalCardProps {
  goal: Goal
  checked: boolean
  onSelect: () => void
}

/** A radio option styled as a card; a native radio input gives arrow-key navigation for free. */
export function GoalCard({ goal, checked, onSelect }: GoalCardProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 border p-3 transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50 sm:gap-4 sm:p-4 short:p-3",
        checked
          ? "border-2 border-brand bg-brand-tint p-2.75 sm:p-3.75 short:p-2.75"
          : "border-line hover:border-ink-subtle",
      )}
    >
      <input
        type="radio"
        name="goal"
        value={goal.id}
        checked={checked}
        onChange={onSelect}
        className="sr-only"
      />
      <ImagePlaceholder
        src={goal.image}
        className={cn("size-14 shrink-0 sm:size-20 short:size-16", checked && "bg-background")}
      />
      <span className="flex min-w-0 flex-col gap-1 sm:gap-2">
        <span className="text-lg font-semibold text-ink sm:text-xl">{goal.title}</span>
        <span className="text-sm text-ink-muted sm:text-base">{goal.description}</span>
      </span>
    </label>
  )
}
