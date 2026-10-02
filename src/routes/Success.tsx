import { useTranslation } from "react-i18next"
import { ImagePlaceholder } from "@/components/common/ImagePlaceholder"

export default function Success() {
  const { t } = useTranslation()
  return (
    <main className="flex flex-1 flex-col items-center pt-12 pb-24 text-center sm:pt-24 lg:pt-36">
      <ImagePlaceholder className="size-48 bg-panel sm:size-75" />
      <h1 className="mt-9 text-[1.75rem] text-ink sm:text-[2rem]">
        {t("success.title")}
      </h1>
      <p className="mt-2 max-w-sm text-base text-ink-muted">{t("success.subtitle")}</p>
    </main>
  )
}
