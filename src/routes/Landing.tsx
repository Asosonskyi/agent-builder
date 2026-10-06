import { AlarmClockIcon, ArrowRightIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { AppImage } from "@/components/common/AppImage"
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
        <h1 className="mt-8 text-[2rem] leading-[1.1] tracking-tight text-ink sm:mt-10 sm:text-[2.75rem]">
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
      <AppImage
        src="common/landing.jpg"
        alt={t("common.illustrationAlt")}
        fetchPriority="high"
        // Out of flow, so the text column sets the page height and the image fills what is left.
        className="relative h-80 max-md:hidden lg:h-full lg:max-h-140 lg:min-h-96 overflow-hidden"
        // The artwork has more white space below the robot than above, so nudge it down to centre it.
        imgClassName="absolute inset-0 translate-y-[11%]"
      />
    </main>
  )
}
