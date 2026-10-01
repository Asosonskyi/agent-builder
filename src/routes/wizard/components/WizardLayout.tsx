import { cn } from "cn"
import { StepHeader } from "./StepHeader"

interface WizardLayoutProps {
  step: number
  title: React.ReactNode
  subtitle?: React.ReactNode
  aside: React.ReactNode
  footer: React.ReactNode
  /**
   * Fill the viewport instead of growing with the aside. The aside is taken out of flow, so only
   * the main column sets the page height and the aside stretches (up to its cap) to match.
   */
  fitScreen?: boolean
  children: React.ReactNode
}

export function WizardLayout({
  step,
  title,
  subtitle,
  aside,
  footer,
  fitScreen = false,
  children,
}: WizardLayoutProps) {
  return (
    <>
      <main
        className={cn(
          "mx-auto grid w-full max-w-page flex-1 grid-cols-[580fr_548fr] gap-12",
          !fitScreen && "items-start",
        )}
      >
        <section className="flex min-w-0 flex-col">
          <StepHeader step={step} title={title} subtitle={subtitle} />
          {children}
        </section>
        {fitScreen ? (
          <aside className="relative max-h-159 min-w-0">
            <div className="absolute inset-0">{aside}</div>
          </aside>
        ) : (
          <aside className="sticky top-6 min-w-0">{aside}</aside>
        )}
      </main>
      {footer}
    </>
  )
}
