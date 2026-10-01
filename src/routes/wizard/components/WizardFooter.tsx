/** `mt-auto` pins it to the viewport bottom on short pages; on long pages it follows the content. */
export function WizardFooter({ back, next }: { back?: React.ReactNode; next: React.ReactNode }) {
  return (
    <footer className="-mx-8 mt-12 border-t border-line bg-background px-8 py-7 short:py-4">
      <div className="mx-auto flex w-full max-w-page items-center justify-between">
        <div>{back}</div>
        <div>{next}</div>
      </div>
    </footer>
  )
}
