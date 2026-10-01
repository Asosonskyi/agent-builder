import { expect, test } from "@playwright/test"

const PAGES = ["./", "./goal", "./skills", "./contact", "./quick"]

for (const path of PAGES) {
  test(`${path} has no horizontal scroll`, async ({ page }) => {
    await page.goto(path)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    // String form: the e2e tsconfig has no DOM lib.
    const overflow = await page.evaluate<number>(
      "document.documentElement.scrollWidth - document.documentElement.clientWidth",
    )
    expect(overflow).toBeLessThanOrEqual(0)
  })
}
