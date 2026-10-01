import { HeaderCta } from "./HeaderCta"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { Logo } from "./Logo"

export function Header() {
  return (
    <header className="mx-auto flex w-full max-w-page items-center justify-between gap-4 pt-4 sm:pt-7 short:pt-4">
      <Logo />
      <div className="flex items-center gap-2 sm:gap-8">
        <LanguageSwitcher />
        <HeaderCta />
      </div>
    </header>
  )
}
