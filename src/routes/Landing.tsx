import { AlarmClockIcon, ArrowRightIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { ImagePlaceholder } from "@/components/common/ImagePlaceholder"
import { ButtonLink } from "@/components/common/ButtonLink"

export default function Landing() {
  const { t } = useTranslation()
  return (
    <main className="mx-auto grid w-full max-w-page flex-1 grid-cols-1 content-start gap-10 pb-12 lg:grid-cols-[580fr_548fr] lg:content-stretch lg:items-center lg:gap-12">
      <section className="flex flex-col items-start justify-center">
        <p className="flex items-center gap-2.5 bg-brand-tint px-4 py-3 text-sm text-brand sm:text-base">
          <AlarmClockIcon className="size-5 shrink-0" />
          {t("landing.badge")}
        </p>
        <h1 className="mt-8 text-[2rem] leading-[1.1] font-medium tracking-tight text-ink sm:mt-10 sm:text-[2.75rem]">
          <span className="text-brand">{t("landing.titleAccent")}</span>
          {t("landing.titleRest")}
        </h1>
        <p className="mt-6 max-w-[29rem] text-base text-ink-muted">{t("landing.subtitle")}</p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <ButtonLink size="xl" to="/goal">
            {t("landing.getEstimate")}
            <ArrowRightIcon />
          </ButtonLink>
          <ButtonLink variant="brand" size="xl" to="/quick">
            {t("landing.quickRequest")}
          </ButtonLink>
        </div>
      </section>
      <ImagePlaceholder className="h-80 bg-panel text-base max-md:hidden lg:h-full lg:max-h-180 lg:min-h-96">
        {t("common.illustrationPlaceholder")}
      </ImagePlaceholder>
    </main>
  )
}
