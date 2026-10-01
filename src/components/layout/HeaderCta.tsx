import { ArrowRightIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router"
import { ButtonLink } from "@/components/common/ButtonLink"

type CtaKey = "getEstimate" | "quickRequest" | "anotherWay"

const CTA_BY_PATH: Record<string, CtaKey> = {
  "/goal": "quickRequest",
  "/skills": "quickRequest",
  "/contact": "anotherWay",
}

export function HeaderCta() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const cta = CTA_BY_PATH[pathname] ?? "getEstimate"
  const isEstimate = cta === "getEstimate"

  return (
    <ButtonLink
      variant="brand"
      size="xl"
      to={isEstimate ? "/goal" : "/quick"}
      className="max-sm:h-11 max-sm:gap-1.5 max-sm:px-3 max-sm:text-sm max-sm:[&_svg]:size-4"
    >
      {t(`header.cta.${cta}`)}
      {isEstimate && <ArrowRightIcon />}
    </ButtonLink>
  )
}
