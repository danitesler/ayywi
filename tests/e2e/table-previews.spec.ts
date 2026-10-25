import { expect, test } from "@playwright/test";
import { example, open } from "./helpers";

for (const renderer of ["react", "html"] as const) {
  test(`table previews progress from simple to medium to playground (${renderer})`, async ({ page }) => {
    await open(page, "table", { renderer });
    await expect(page.locator('.ayy-showcase__title')).toHaveText(["Simple", "Medium", "Playground"]);

    const simple = example(page, "simple").getByRole("table", { name: "Accounts" });
    await expect(simple.locator("tbody tr")).toHaveCount(4);
    await expect(simple.getByRole("button")).toHaveCount(0);
    await expect(simple.getByRole("checkbox")).toHaveCount(0);

    const medium = example(page, "medium").getByRole("table", { name: "Accounts" });
    await expect(medium.locator("tbody tr")).toHaveCount(6);
    await medium.getByRole("button", { name: "Seats", exact: true }).click();
    await expect(medium.locator("tbody tr").first()).toContainText("Kestrel Logistics");
    await medium.getByRole("button", { name: "Seats", exact: true }).click();
    await expect(medium.locator("tbody tr").first()).toContainText("Brightside Health");

    const all = medium.getByRole("checkbox", { name: "Select all accounts" });
    await all.check();
    await expect(medium.locator('tbody tr[aria-selected="true"]')).toHaveCount(6);
    await medium.getByRole("checkbox", { name: "Select Lumen Labs" }).uncheck();
    await expect(medium.locator('tbody tr[aria-selected="true"]')).toHaveCount(5);
    await expect(all).toHaveJSProperty("indeterminate", true);

    await expect(example(page, "playground").getByRole("table").getByRole("button", { name: "Plan", exact: true })).toBeVisible();
  });
}
