import { useTranslation } from "react-i18next"
import { Link } from "react-router"

import logoSrc from "/logo.svg"

export function Logo() {
  const { t } = useTranslation()
  return (
    <Link
      to="/"
      className="flex shrink-0 items-center gap-5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <img src={logoSrc} alt={t("header.logoAlt")} className="h-8 sm:h-14" />
      {/* The product name needs room the phone header doesn't have. */}
      <span aria-hidden className="h-12 w-px bg-line max-md:hidden" />
      <span className="flex flex-col text-base font-medium leading-6 text-ink max-md:hidden">
        <span>{t("header.productLine1")}</span>
        <span>{t("header.productLine2")}</span>
      </span>
    </Link>
  )
}
