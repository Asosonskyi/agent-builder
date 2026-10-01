import { createBrowserRouter, Navigate } from "react-router"
import { RootLayout } from "@/components/layout/RootLayout"
import ContactStep from "@/routes/wizard/contact/ContactStep"
import GoalStep from "@/routes/wizard/goal/GoalStep"
import Landing from "@/routes/Landing"
import QuickRequest from "@/routes/QuickRequest"
import SkillsStep from "@/routes/wizard/skills/SkillsStep"
import Success from "@/routes/Success"
import { RequireSubmitted } from "@/routes/guards"
import { RequireGoal, RequireSkills } from "@/routes/wizard/guards"

export const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        { index: true, element: <Landing /> },
        { path: "goal", element: <GoalStep /> },
        {
          path: "skills",
          element: (
            <RequireGoal>
              <SkillsStep />
            </RequireGoal>
          ),
        },
        {
          path: "contact",
          element: (
            <RequireGoal>
              <RequireSkills>
                <ContactStep />
              </RequireSkills>
            </RequireGoal>
          ),
        },
        { path: "quick", element: <QuickRequest /> },
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
