import { act, render, renderHook, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import i18n from "@/i18n"
import { LocaleProvider } from "./LocaleProvider"
import { detectLocale, getInitialLocale, LOCALE_STORAGE_KEY } from "./storage"
import { useLocale } from "./useLocale"

beforeEach(() => localStorage.clear())

describe("detectLocale", () => {
  it.each([
    ["en-US", "en"],
    ["EN", "en"],
    ["uk-UA", "uk"],
    ["de-DE", "uk"],
    ["", "uk"],
  ])("maps %j to %s", (language, expected) => {
    expect(detectLocale(language)).toBe(expected)
  })
})

describe("getInitialLocale", () => {
  it("prefers the stored locale", () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, "uk")
    expect(getInitialLocale()).toBe("uk")
  })

  it("falls back to the browser language when nothing valid is stored", () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, "fr")
    expect(getInitialLocale()).toBe(detectLocale())
  })
})

describe("LocaleProvider", () => {
  function Switcher() {
    const { locale, setLocale } = useLocale()
    return <button onClick={() => setLocale(locale === "en" ? "uk" : "en")}>{locale}</button>
  }

  it("persists the choice and syncs i18n and <html lang>", async () => {
    const user = userEvent.setup()
    localStorage.setItem(LOCALE_STORAGE_KEY, "en")
    render(
      <LocaleProvider>
        <Switcher />
      </LocaleProvider>,
    )
    expect(document.documentElement.lang).toBe("en")
    expect(i18n.language).toBe("en")

    await user.click(screen.getByRole("button", { name: "en" }))

    expect(screen.getByRole("button", { name: "uk" })).toBeInTheDocument()
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("uk")
    expect(i18n.language).toBe("uk")
    expect(document.documentElement.lang).toBe("uk")

    await act(() => i18n.changeLanguage("en"))
  })

  it("useLocale throws outside the provider", () => {
    expect(() => renderHook(() => useLocale())).toThrow(/LocaleProvider/)
  })
})
