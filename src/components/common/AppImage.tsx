import { cn } from "cn"
import { assetUrl } from "@/lib/utils"

interface AppImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  /** A full URL, a root path, or a path inside `public/` (e.g. `goals/personal.jpg`). */
  src?: string
  /** Classes for the `<img>` itself; `className` styles the frame around it. */
  imgClassName?: string
}

/**
 * An image fitted into a frame. The artwork is exported on white, so it is multiply-blended into
 * whatever background the frame (or its parent) has. Without `src` it renders a neutral grey block.
 */
export function AppImage({ src, alt = "", className, imgClassName, ...props }: AppImageProps) {
  if (!src) return <div aria-hidden className={cn("bg-placeholder", className)} />
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <img
        src={assetUrl(src)}
        alt={alt}
        decoding="async"
        className={cn("size-full object-contain mix-blend-multiply", imgClassName)}
        {...props}
      />
    </div>
  )
}
