import { cn } from "cn"

interface ImagePlaceholderProps {
  src?: string
  alt?: string
  className?: string
  children?: React.ReactNode
}

/** Shows `src` when the API/Figma provides one, otherwise a neutral grey block. */
export function ImagePlaceholder({ src, alt = "", className, children }: ImagePlaceholderProps) {
  if (src) return <img src={src} alt={alt} className={cn("object-cover", className)} />
  return (
    <div
      aria-hidden={!children}
      className={cn("flex items-center justify-center bg-placeholder text-ink-muted", className)}
    >
      {children}
    </div>
  )
}
