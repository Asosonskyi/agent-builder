import { useTranslation } from "react-i18next"
import { Link } from "react-router"

import logoSrc from "/logo.svg"

export function Logo() {
  const { t } = useTranslation()
  return (
    <Link
      to="/"
      className="flex items-center gap-5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <img src={logoSrc} alt={t("header.logoAlt")} className="h-14" />
      <span aria-hidden className="h-12 w-px bg-line" />
      <span className="flex flex-col text-base leading-6 text-ink">
        <span>{t("header.productLine1")}</span>
        <span>{t("header.productLine2")}</span>
      </span>
    </Link>
  )
}
