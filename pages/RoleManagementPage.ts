import { Page, Locator } from "@playwright/test";

export class RoleManagementPage {
  readonly createAccountBtn: Locator;

  constructor(private page: Page) {
    this.createAccountBtn = page.getByRole("button", {
      name: "Create Account",
    });
  }

  async clickCreateAccount() {
    await this.createAccountBtn.click();

    // Wait for ROC radio (form loaded)
    await this.page.getByLabel("ROC").waitFor({ state: "visible" });
  }
}
