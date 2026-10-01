import type { z } from "zod"

export const API_MODE = import.meta.env.VITE_API_MODE === "live" ? "live" : "mock"

const MOCK_DELAY_MS = 300

const mockFiles = import.meta.glob<unknown>("./mocks/*/*.json", { import: "default" })

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function loadMock(path: string): Promise<unknown> {
  const load = mockFiles[`./mocks/${path}.json`]
  if (!load) throw new Error(`Mock not found: ${path}`)
  const [data] = await Promise.all([load(), delay(MOCK_DELAY_MS)])
  return data
}

async function fetchJson(path: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(`${import.meta.env.VITE_API_URL ?? ""}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  })
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`)
  return res.status === 204 ? undefined : res.json()
}

/**
 * GET a resource and validate it. `mockPath` is relative to `src/api/mocks`, without `.json`.
 * Throws on a schema mismatch so broken data never reaches the UI.
 */
export async function getResource<T extends z.ZodType>(
  schema: T,
  livePath: string,
  mockPath: string,
): Promise<z.infer<T>> {
  const data = API_MODE === "live" ? await fetchJson(livePath) : await loadMock(mockPath)
  return schema.parse(data)
}

export async function postJson(path: string, body: unknown): Promise<void> {
  await fetchJson(path, { method: "POST", body: JSON.stringify(body) })
}
