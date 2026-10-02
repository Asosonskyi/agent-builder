import { localeSchema, type Locale } from "@/api/schemas"

export const LOCALE_STORAGE_KEY = "scope-builder-locale"

export function detectLocale(language = globalThis.navigator?.language ?? ""): Locale {
  return language.toLowerCase().startsWith("en") ? "en" : "uk"
}

export function readStoredLocale(): Locale | null {
  try {
    const parsed = localeSchema.safeParse(localStorage.getItem(LOCALE_STORAGE_KEY))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export function writeStoredLocale(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // Storage unavailable (private mode, blocked site data): the choice lasts for this session only.
  }
}

/** Read synchronously, so i18n starts in the right language and there is no flash on first render. */
export const getInitialLocale = (): Locale => readStoredLocale() ?? detectLocale()
