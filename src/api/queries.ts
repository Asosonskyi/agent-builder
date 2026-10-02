import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query"
import { useLocale } from "@/locale/useLocale"
import { getCategories, getGoals } from "./catalog"
import type { Locale } from "./schemas"

export const goalsQuery = (locale: Locale) =>
  queryOptions({
    queryKey: ["goals", locale],
    queryFn: () => getGoals(locale),
    staleTime: Infinity,
    placeholderData: keepPreviousData,
  })

export const categoriesQuery = (goalId: string, locale: Locale) =>
  queryOptions({
    queryKey: ["categories", goalId, locale],
    queryFn: () => getCategories(goalId, locale),
    staleTime: Infinity,
    // Keep old content visible only across a language switch, never across a goal change:
    // showing another goal's catalog would seed the wrong defaults.
    placeholderData: (previous, previousQuery) =>
      previousQuery?.queryKey[1] === goalId ? previous : undefined,
  })

export function useGoals() {
  const { locale } = useLocale()
  return useQuery(goalsQuery(locale))
}

export function useCategories(goalId: string) {
  const { locale } = useLocale()
  return useQuery(categoriesQuery(goalId, locale))
}
