import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createMemoryRouter, RouterProvider } from "react-router"
import { beforeEach, expect, it } from "vitest"
import "@/i18n"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useWizardStore } from "@/store/wizard"
import SkillsStep from "./SkillsStep"

beforeEach(() => {
  localStorage.clear()
  useWizardStore.setState(useWizardStore.getInitialState(), true)
  useWizardStore.getState().actions.setLocale("en")
})

const renderSkills = () => {
  const router = createMemoryRouter(
    [
      { path: "/skills", element: <SkillsStep /> },
      { path: "/contact", element: <p>contact</p> },
    ],
    { initialEntries: ["/skills"] },
  )
  render(
    <QueryClientProvider client={new QueryClient()}>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>,
  )
}

it("lands with defaults selected and disables the primary button at 0 skills", async () => {
  const user = userEvent.setup()
  renderSkills()

  const next = screen.getByRole("button", { name: /share your contacts/i })
  expect(next).toBeDisabled() // skeleton while loading, never an enabled-then-disabled flash

  const checked = await screen.findAllByRole("checkbox", { checked: true })
  expect(checked).toHaveLength(3)
  expect(next).toBeEnabled()

  const summary = screen.getByLabelText(/what your agent will do/i)
  await user.click(within(summary).getByRole("button", { name: /remove search, documents/i }))

  expect(screen.queryAllByRole("checkbox", { checked: true })).toHaveLength(0)
  expect(next).toBeDisabled()
})
