import type { ComponentType } from "react"
import { createBrowserRouter, Navigate, Outlet } from "react-router"
import { RootLayout } from "@/components/layout/RootLayout"
import Landing from "@/routes/Landing"
import Success from "@/routes/Success"
import { RequireSubmitted } from "@/routes/guards"
import { RequireGoal, RequireSkills } from "@/routes/wizard/guards"

/** Route-level code splitting: the page chunk is fetched before the navigation commits. */
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
})

export const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        { index: true, element: <Landing /> },
        { path: "goal", lazy: page(() => import("@/routes/wizard/goal/GoalStep")) },
        {
          element: (
            <RequireGoal>
              <Outlet />
            </RequireGoal>
          ),
          children: [
            { path: "skills", lazy: page(() => import("@/routes/wizard/skills/SkillsStep")) },
            {
              element: (
                <RequireSkills>
                  <Outlet />
                </RequireSkills>
              ),
              children: [
                {
                  path: "contact",
                  lazy: page(() => import("@/routes/wizard/contact/ContactStep")),
                },
              ],
            },
          ],
        },
        { path: "quick", lazy: page(() => import("@/routes/QuickRequest")) },
        // Stays eager: submit relies on a synchronous navigate(..., { flushSync: true }) to
        // /success, and a lazy route would make that navigation async (guard race).
        {
          path: "success",
          element: (
            <RequireSubmitted>
              <Success />
            </RequireSubmitted>
          ),
        },
        { path: "*", element: <Navigate to="/" replace /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
)
