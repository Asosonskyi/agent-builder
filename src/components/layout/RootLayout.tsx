import { Outlet, ScrollRestoration } from "react-router"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Header } from "./Header"

export function RootLayout() {
  return (
    <TooltipProvider>
      <div className="flex min-h-svh flex-col px-4 sm:px-8">
        <Header />
        <div className="flex flex-1 flex-col pt-8 lg:pt-12 short:pt-6">
          <Outlet />
        </div>
      </div>
      <ScrollRestoration />
    </TooltipProvider>
  )
}
