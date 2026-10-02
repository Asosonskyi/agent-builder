import { useCallback, useLayoutEffect, useMemo, useState, type ReactNode } from "react"
import type { Locale } from "@/api/schemas"
import i18n from "@/i18n"
import { LocaleContext } from "./context"
import { getInitialLocale, writeStoredLocale } from "./storage"

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState(getInitialLocale)

  const setLocale = useCallback((next: Locale) => {
    writeStoredLocale(next)
    setLocaleState(next)
  }, [])

  // Before paint, so UI strings and <html lang> never lag behind the selected locale.
  // A no-op for i18n on a normal first render: it was initialised with the same locale.
  useLayoutEffect(() => {
    if (i18n.language !== locale) void i18n.changeLanguage(locale)
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale])
  return <LocaleContext value={value}>{children}</LocaleContext>
}
