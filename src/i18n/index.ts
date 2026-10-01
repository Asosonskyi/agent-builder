import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import { useWizardStore } from "@/store/wizard"
import en from "./locales/en.json"
import uk from "./locales/uk.json"

export const resources = { en: { translation: en }, uk: { translation: uk } } as const

const syncDocumentLang = (locale: string) => {
  document.documentElement.lang = locale
}

// The store reads localStorage synchronously, so the persisted locale is known before the first render.
const initialLocale = useWizardStore.getState().locale

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLocale,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
})
syncDocumentLang(initialLocale)

useWizardStore.subscribe((state, prev) => {
  if (state.locale === prev.locale) return
  void i18n.changeLanguage(state.locale)
  syncDocumentLang(state.locale)
})

export default i18n
