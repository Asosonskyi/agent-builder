import { useTranslation } from "react-i18next"
import { Progress } from "@/components/ui/progress"

export const TOTAL_STEPS = 3

interface StepHeaderProps {
  step: number
  title: React.ReactNode
  subtitle?: React.ReactNode
}

export function StepHeader({ step, title, subtitle }: StepHeaderProps) {
  const { t } = useTranslation()
  const label = t("common.stepOf", { step, total: TOTAL_STEPS })
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3">
        <span className="shrink-0 text-base text-ink">{label}</span>
        <Progress
          aria-label={label}
          value={(step / TOTAL_STEPS) * 100}
          className="flex-1 [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-track]]:rounded-none [&_[data-slot=progress-track]]:bg-panel"
        />
      </div>
      <h1 className="mt-5 text-[1.75rem] leading-[1.2] tracking-tight text-ink sm:mt-6 sm:text-[2.25rem] lg:text-[2.5rem] short:mt-4 short:text-[2rem]">
        {title}
      </h1>
      {subtitle && <p className="mt-3 text-base text-ink-muted sm:mt-4 short:mt-2">{subtitle}</p>}
    </div>
  )
}
