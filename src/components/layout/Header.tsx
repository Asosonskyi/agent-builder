import { HeaderCta } from "./HeaderCta"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { Logo } from "./Logo"

export function Header() {
  return (
    <header className="mx-auto flex w-full max-w-page items-center justify-between pt-7 short:pt-4">
      <Logo />
      <div className="flex items-center gap-8">
        <LanguageSwitcher />
        <HeaderCta />
      </div>
    </header>
  )
}
