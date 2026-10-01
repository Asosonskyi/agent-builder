import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation()
  return (
    <div role="alert" className="flex flex-col items-start gap-4 border border-line p-6">
      <p className="text-base text-ink">{t("common.loadError")}</p>
      <Button variant="back" size="lg" onClick={onRetry}>
        {t("common.retry")}
      </Button>
    </div>
  )
}
