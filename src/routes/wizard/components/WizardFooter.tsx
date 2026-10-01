/**
 * Desktop: `mt-auto` pins it to the viewport bottom on short pages; on long pages it follows the
 * content. Below `lg` it sticks to the viewport bottom so "Next" stays in reach on long steps,
 * and the primary action stretches to fill the row.
 */
export function WizardFooter({ back, next }: { back?: React.ReactNode; next: React.ReactNode }) {
  return (
    <footer className="z-10 -mx-4 mt-12 border-t border-line bg-background px-4 py-3 max-lg:sticky max-lg:bottom-0 sm:-mx-8 sm:px-8 sm:py-5 lg:py-7 short:py-4">
      <div className="mx-auto flex w-full max-w-page items-center justify-between gap-3">
        {/* Keep the empty slot on wider screens so `justify-between` still pins "Next" right. */}
        <div className={back ? undefined : "max-sm:hidden"}>{back}</div>
        <div className="max-sm:flex-1 max-sm:*:w-full">{next}</div>
      </div>
    </footer>
  )
}
