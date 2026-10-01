import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { Category, CategoryGroup, Contact, Goal, Locale } from "@/api/schemas"

export const DEFAULT_GOAL_ID = "all_in_one"
export const PERSIST_KEY = "scope-builder-wizard"
const PERSIST_VERSION = 1

export interface SkillSelectionState {
  categoryId: string
  connectorIds: string[]
}

export interface WizardData {
  locale: Locale
  goalId: string | null
  /** Goal the current selections were seeded for (see plan §6.1). */
  selectionsGoalId: string | null
  /** Keyed by skill ID. IDs only: labels always come from the current-locale catalog. */
  selections: Record<string, SkillSelectionState>
  contact: Contact
}

export interface WizardActions {
  setLocale: (locale: Locale) => void
  setGoal: (goalId: string) => void
  seedDefaults: (goal: Goal, catalog: CategoryGroup[]) => void
  toggleSkill: (skillId: string, categoryId: string) => void
  toggleConnector: (skillId: string, connectorId: string) => void
  selectAllInCategory: (category: Category) => void
  clearCategory: (categoryId: string) => void
  setContact: (contact: Partial<Contact>) => void
  resetWizard: () => void
}

export type WizardState = WizardData & WizardActions

export function detectLocale(language = globalThis.navigator?.language ?? ""): Locale {
  return language.toLowerCase().startsWith("en") ? "en" : "uk"
}

const initialData = (locale: Locale): WizardData => ({
  locale,
  goalId: DEFAULT_GOAL_ID,
  selectionsGoalId: null,
  selections: {},
  contact: { name: "", email: "", company: "" },
})

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      ...initialData(detectLocale()),

      setLocale: (locale) => set({ locale }),

      setGoal: (goalId) => set({ goalId }),

      seedDefaults: (goal, catalog) => {
        const skillIndex = new Map<string, { categoryId: string; connectorIds: Set<string> }>()
        for (const group of catalog)
          for (const category of group.categories)
            for (const skill of category.skills)
              skillIndex.set(skill.id, {
                categoryId: category.id,
                connectorIds: new Set(skill.availableConnectors.map((c) => c.id)),
              })

        const selections: WizardData["selections"] = {}
        for (const { skillId, connectorIds } of goal.defaultSelectedSkills) {
          const known = skillIndex.get(skillId)
          if (!known) continue
          selections[skillId] = {
            categoryId: known.categoryId,
            connectorIds: [...new Set(connectorIds)].filter((id) => known.connectorIds.has(id)),
          }
        }
        set({ selections, selectionsGoalId: goal.id })
      },

      toggleSkill: (skillId, categoryId) =>
        set(({ selections }) => {
          const next = { ...selections }
          if (next[skillId]) delete next[skillId]
          else next[skillId] = { categoryId, connectorIds: [] }
          return { selections: next }
        }),

      toggleConnector: (skillId, connectorId) =>
        set(({ selections }) => {
          const current = selections[skillId]
          if (!current) return {}
          const connectorIds = current.connectorIds.includes(connectorId)
            ? current.connectorIds.filter((id) => id !== connectorId)
            : [...current.connectorIds, connectorId]
          return { selections: { ...selections, [skillId]: { ...current, connectorIds } } }
        }),

      selectAllInCategory: (category) =>
        set(({ selections }) => {
          const next = { ...selections }
          for (const skill of category.skills)
            next[skill.id] ??= { categoryId: category.id, connectorIds: [] }
          return { selections: next }
        }),

      clearCategory: (categoryId) =>
        set(({ selections }) => ({
          selections: Object.fromEntries(
            Object.entries(selections).filter(([, s]) => s.categoryId !== categoryId),
          ),
        })),

      setContact: (contact) => set((s) => ({ contact: { ...s.contact, ...contact } })),

      resetWizard: () => set((s) => initialData(s.locale)),
    }),
    {
      name: PERSIST_KEY,
      version: PERSIST_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ locale, goalId, selectionsGoalId, selections, contact }): WizardData => ({
        locale,
        goalId,
        selectionsGoalId,
        selections,
        contact,
      }),
      // Unknown or older persisted shapes fall back to a fresh wizard, keeping a valid locale.
      migrate: (persisted, version) => {
        const old = persisted as Partial<WizardData> | undefined
        const fresh = initialData(
          old?.locale === "en" || old?.locale === "uk" ? old.locale : detectLocale(),
        )
        return version === PERSIST_VERSION ? { ...fresh, ...old } : fresh
      },
    },
  ),
)
