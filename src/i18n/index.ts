import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import { getInitialLocale } from "@/locale/storage"
import en from "./locales/en.json"
import uk from "./locales/uk.json"

export const resources = { en: { translation: en }, uk: { translation: uk } } as const

// LocaleProvider owns language changes; this only picks the starting language.
void i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLocale(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
})

export default i18n
