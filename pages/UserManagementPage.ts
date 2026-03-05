import { Page, Locator, expect } from "@playwright/test";

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
    await this.searchBox.fill(email);
    await this.searchBox.press("Enter");

    // Wait until row with email appears
    await expect(
      this.page.getByRole("row", {
        name: new RegExp(email, "i"),
      }),
    ).toBeVisible();
  }

  async validateEmailExists(email: string) {
    const row = this.page.locator(`//table//tbody//tr[td[text()='${email}']]`);

    await expect(row).toBeVisible();
  }
}
