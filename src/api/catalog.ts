import { getResource } from "./client"
import { categoryGroupsSchema, goalsSchema, type Locale } from "./schemas"

export function getGoals(lang: Locale) {
  return getResource(goalsSchema, `/goals?lang=${lang}`, `${lang}/goals`)
}

export function getCategories(goalId: string, lang: Locale) {
  return getResource(
    categoryGroupsSchema,
    `/goals/${encodeURIComponent(goalId)}/categories?lang=${lang}`,
    `${lang}/categories.${goalId}`,
  )
}
