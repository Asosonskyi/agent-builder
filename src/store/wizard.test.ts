import { beforeEach, describe, expect, it } from "vitest"
import { catalog, goal } from "@/test/fixtures"
import { canContinueFromSkills, selectedByCategory } from "./selectors"
import { PERSIST_KEY, useWizardStore } from "./wizard"

const store = () => useWizardStore.getState()

const allInOne = goal("all_in_one", [
  { skillId: "research", connectorIds: ["firecrawl"] },
  { skillId: "summaries", connectorIds: ["notion"] },
])
const personal = goal("personal", [{ skillId: "prep", connectorIds: [] }])

/** What SkillsStep does on mount (plan §6.1). */
const visitSkills = (g = allInOne) => {
  if (store().selectionsGoalId !== store().goalId) store().seedDefaults(g, catalog)
}

beforeEach(() => {
  localStorage.clear()
  useWizardStore.setState(useWizardStore.getInitialState(), true)
  store().setGoal("all_in_one")
})

describe("default seeding", () => {
  it("seeds the goal's defaults (skills and connectors) on the first visit", () => {
    visitSkills()
    expect(store().selections).toEqual({
      research: { categoryId: "search", connectorIds: ["firecrawl"] },
      summaries: { categoryId: "search", connectorIds: ["notion"] },
    })
    expect(store().selectionsGoalId).toBe("all_in_one")
    expect(canContinueFromSkills(store().selections)).toBe(true)
  })

  it("seeds only once per goal", () => {
    visitSkills()
    store().toggleConnector("research", "notion")
    visitSkills()
    expect(store().selections.research.connectorIds).toEqual(["firecrawl", "notion"])
  })

  it("keeps a fully deselected state after a reload (no re-seed)", async () => {
    visitSkills()
    store().clearCategory("search")
    expect(canContinueFromSkills(store().selections)).toBe(false)

    const persisted = localStorage.getItem(PERSIST_KEY)
    useWizardStore.setState(useWizardStore.getInitialState(), true)
    localStorage.setItem(PERSIST_KEY, persisted!)
    await useWizardStore.persist.rehydrate()

    visitSkills()
    expect(store().selections).toEqual({})
    expect(canContinueFromSkills(store().selections)).toBe(false)
  })

  it("re-seeds when the goal changes", () => {
    visitSkills()
    store().setGoal("personal")
    visitSkills(personal)
    expect(Object.keys(store().selections)).toEqual(["prep"])
    expect(store().selectionsGoalId).toBe("personal")
  })

  it("does not re-seed when the language changes", () => {
    visitSkills()
    store().toggleSkill("prep", "meetings")
    store().setLocale(store().locale === "en" ? "uk" : "en")
    visitSkills()
    expect(Object.keys(store().selections).sort()).toEqual(["prep", "research", "summaries"])
  })

  it("filters out unknown skill and connector IDs", () => {
    store().seedDefaults(
      goal("all_in_one", [
        { skillId: "research", connectorIds: ["firecrawl", "slack"] },
        { skillId: "does_not_exist", connectorIds: [] },
      ]),
      catalog,
    )
    expect(store().selections).toEqual({
      research: { categoryId: "search", connectorIds: ["firecrawl"] },
    })
  })
})

describe("selection actions", () => {
  it("removes a skill's connectors when it is unchecked", () => {
    visitSkills()
    store().toggleSkill("research", "search")
    store().toggleSkill("research", "search")
    expect(store().selections.research.connectorIds).toEqual([])
  })

  it("clears only the given category", () => {
    visitSkills()
    store().toggleSkill("prep", "meetings")
    store().clearCategory("search")
    expect(Object.keys(store().selections)).toEqual(["prep"])
  })

  it("selects all skills in a category without touching existing connectors", () => {
    visitSkills()
    store().selectAllInCategory(catalog[0].categories[1])
    expect(store().selections.prep).toEqual({ categoryId: "meetings", connectorIds: [] })
    expect(store().selections.research.connectorIds).toEqual(["firecrawl"])
  })

  it("groups the summary by category in catalog order", () => {
    store().toggleSkill("prep", "meetings")
    store().toggleSkill("summaries", "search")
    const summary = selectedByCategory(catalog, store().selections)
    expect(summary.map((s) => [s.category.id, s.skills.map((k) => k.id)])).toEqual([
      ["search", ["summaries"]],
      ["meetings", ["prep"]],
    ])
  })
})

describe("resetWizard", () => {
  it("clears everything except the locale", () => {
    store().setLocale("en")
    visitSkills()
    store().setContact({ name: "Ann", email: "ann@example.com" })
    store().resetWizard()
    expect(store()).toMatchObject({
      locale: "en",
      goalId: "all_in_one",
      selectionsGoalId: null,
      selections: {},
      contact: { name: "", email: "", company: "" },
    })
  })
})
