import type { VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Link, type LinkProps } from "react-router"
import { buttonVariants } from "@/components/ui/button"

/**
 * A navigation link styled as a button. Base UI's `<Button render={<Link />}>` would expose the
 * link as role="button", so links keep their native semantics here.
 */
export function ButtonLink({
  className,
  variant,
  size,
  ...props
}: LinkProps & VariantProps<typeof buttonVariants>) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
