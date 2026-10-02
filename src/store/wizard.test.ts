import { beforeEach, describe, expect, it } from "vitest"
import { catalog, goal } from "@/test/fixtures"
import { canContinueFromSkills, selectedByCategory } from "./selectors"
import { PERSIST_KEY, useWizardStore } from "./wizard"

const store = () => useWizardStore.getState()
const actions = () => store().actions

const allInOne = goal("all_in_one", [
  { skillId: "research", connectorIds: ["firecrawl"] },
  { skillId: "summaries", connectorIds: ["notion"] },
])
const personal = goal("personal", [{ skillId: "prep", connectorIds: [] }])

/** What SkillsStep does on mount (plan §6.1). */
const visitSkills = (g = allInOne) => {
  if (store().selectionsGoalId !== store().goalId) actions().seedDefaults(g, catalog)
}

beforeEach(() => {
  localStorage.clear()
  useWizardStore.setState(useWizardStore.getInitialState(), true)
  actions().setGoal("all_in_one")
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
    actions().toggleConnector("research", "notion")
    visitSkills()
    expect(store().selections.research.connectorIds).toEqual(["firecrawl", "notion"])
  })

  it("keeps a fully deselected state after a reload (no re-seed)", async () => {
    visitSkills()
    actions().clearCategory("search")
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
    actions().setGoal("personal")
    visitSkills(personal)
    expect(Object.keys(store().selections)).toEqual(["prep"])
    expect(store().selectionsGoalId).toBe("personal")
  })

  it("does not re-seed when the language changes", () => {
    visitSkills()
    actions().toggleSkill("prep", "meetings")
    actions().setLocale(store().locale === "en" ? "uk" : "en")
    visitSkills()
    expect(Object.keys(store().selections).sort()).toEqual(["prep", "research", "summaries"])
  })

  it("filters out unknown skill and connector IDs", () => {
    actions().seedDefaults(
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
    actions().toggleSkill("research", "search")
    actions().toggleSkill("research", "search")
    expect(store().selections.research.connectorIds).toEqual([])
  })

  it("clears only the given category", () => {
    visitSkills()
    actions().toggleSkill("prep", "meetings")
    actions().clearCategory("search")
    expect(Object.keys(store().selections)).toEqual(["prep"])
  })

  it("selects all skills in a category without touching existing connectors", () => {
    visitSkills()
    actions().selectAllInCategory(catalog[0].categories[1])
    expect(store().selections.prep).toEqual({ categoryId: "meetings", connectorIds: [] })
    expect(store().selections.research.connectorIds).toEqual(["firecrawl"])
  })

  it("groups the summary by category in catalog order", () => {
    actions().toggleSkill("prep", "meetings")
    actions().toggleSkill("summaries", "search")
    const summary = selectedByCategory(catalog, store().selections)
    expect(summary.map((s) => [s.category.id, s.skills.map((k) => k.id)])).toEqual([
      ["search", ["summaries"]],
      ["meetings", ["prep"]],
    ])
  })
})

describe("pruneSelections", () => {
  it("drops skills and connectors the catalog no longer has", () => {
    visitSkills()
    actions().toggleSkill("removed_skill", "search")
    actions().toggleConnector("research", "removed_connector")
    actions().pruneSelections(catalog)
    expect(store().selections).toEqual({
      research: { categoryId: "search", connectorIds: ["firecrawl"] },
      summaries: { categoryId: "search", connectorIds: ["notion"] },
    })
  })

  it("keeps the same selections object when nothing changed", () => {
    visitSkills()
    const before = store().selections
    actions().pruneSelections(catalog)
    expect(store().selections).toBe(before)
  })
})

describe("resetWizard", () => {
  it("clears everything except the locale", () => {
    actions().setLocale("en")
    visitSkills()
    actions().setContact({ name: "Ann", email: "ann@example.com" })
    actions().resetWizard()
    expect(store()).toMatchObject({
      locale: "en",
      goalId: "all_in_one",
      selectionsGoalId: null,
      selections: {},
      contact: { name: "", email: "", company: "" },
    })
  })
})
