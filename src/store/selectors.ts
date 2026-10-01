import type { Category, CategoryGroup, Skill } from "@/api/schemas"
import type { WizardData } from "./wizard"

type Selections = WizardData["selections"]

export const selectedSkillCount = (selections: Selections) => Object.keys(selections).length

export const canContinueFromSkills = (selections: Selections) => selectedSkillCount(selections) > 0

export const isCategoryFullySelected = (category: Category, selections: Selections) =>
  category.skills.length > 0 && category.skills.every((skill) => skill.id in selections)

export interface SelectedCategory {
  category: Category
  skills: Skill[]
}

/** Summary panel data: categories (in catalog order) with at least one selected skill. */
export function selectedByCategory(catalog: CategoryGroup[], selections: Selections) {
  const result: SelectedCategory[] = []
  for (const group of catalog)
    for (const category of group.categories) {
      const skills = category.skills.filter((skill) => skill.id in selections)
      if (skills.length > 0) result.push({ category, skills })
    }
  return result
}

/** Whether the persisted selections belong to the current goal and contain at least one skill. */
export const hasSelectionsForGoal = (state: WizardData) =>
  state.goalId !== null &&
  state.selectionsGoalId === state.goalId &&
  canContinueFromSkills(state.selections)
