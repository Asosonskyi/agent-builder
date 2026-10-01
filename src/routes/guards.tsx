import { useEffect, useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router"

/**
 * Browsers keep history.state across a reload, so the flag is latched on mount and then cleared:
 * a reload of /success finds no state and redirects to "/".
 */
export function RequireSubmitted({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const submitted = (location.state as { submitted?: boolean } | null)?.submitted === true
  const [allowed] = useState(submitted)

  useEffect(() => {
    if (submitted) void navigate(".", { replace: true, state: null })
  }, [submitted, navigate])

  return allowed ? children : <Navigate to="/" replace />
}
