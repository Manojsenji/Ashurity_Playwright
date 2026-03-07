import { Page, Locator, expect } from "@playwright/test";
import { retry } from "../utils/retryUtils";

export class UserManagementPage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly table: Locator;

  constructor(page: Page) {
    this.page = page;

    // Adjust name if needed based on your UI
    this.searchBox = page.getByRole("textbox", {
      name: "Search by name, phone, or email...",
    });

    // Generic table locator
    this.table = page.locator("//div/table");
  }

  async searchUser(email: string) {
    await this.searchBox.fill("");
    await this.searchBox.fill(email);
    await this.searchBox.press("Enter");

    // wait for search request to complete
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(3000);
  }

  async validateEmailExists(email: string) {
    await retry(
      async () => {
        const row = this.page.locator("table tbody tr", {
          hasText: email,
        });

        await expect(row).toBeVisible({ timeout: 5000 });
      },
      5,
      3000,
    );
  }
}
