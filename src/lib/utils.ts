export { cn } from "cn"

const ABSOLUTE_URL = /^([a-z][a-z\d+.-]*:|\/)/i

/** Paths inside `public/` are resolved against the deploy base so they work on GitHub Pages. */
export function assetUrl(src: string) {
  return ABSOLUTE_URL.test(src) ? src : `${import.meta.env.BASE_URL}${src}`
}
