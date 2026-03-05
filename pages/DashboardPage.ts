import { Page, Locator } from "@playwright/test";

export class DashboardPage {
  readonly roleManagementBtn: Locator;

  constructor(private page: Page) {
    this.roleManagementBtn = page.locator('span:has-text("Role Management")');
  }

  async goToRoleManagement() {
    console.log("Waiting for Role Management button...");

    await this.roleManagementBtn.waitFor({ state: "visible" });

    console.log("Clicking Role Management...");

    await Promise.all([
      this.page.waitForURL(/\/account$/),
      this.roleManagementBtn.click(),
    ]);

    console.log("Navigated to account page.");
  }
}
