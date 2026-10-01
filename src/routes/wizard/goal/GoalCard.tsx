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
        "flex cursor-pointer items-center gap-4 border p-4 transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50 short:p-3",
        checked
          ? "border-2 border-brand bg-brand-tint p-[15px] short:p-2.75"
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
        className={cn("size-20 shrink-0 short:size-16", checked && "bg-background")}
      />
      <span className="flex flex-col gap-2">
        <span className="text-xl text-ink">{goal.title}</span>
        <span className="text-base text-ink-muted">{goal.description}</span>
      </span>
    </label>
  )
}
