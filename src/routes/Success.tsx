import { useTranslation } from "react-i18next"
import { ImagePlaceholder } from "@/components/common/ImagePlaceholder"

export default function Success() {
  const { t } = useTranslation()
  return (
    <main className="flex flex-1 flex-col items-center pt-36 pb-24 text-center">
      <ImagePlaceholder className="size-75 bg-panel" />
      <h1 className="mt-9 text-[2rem] font-medium text-ink">{t("success.title")}</h1>
      <p className="mt-2 max-w-sm text-base text-ink-muted">{t("success.subtitle")}</p>
    </main>
  )
}
