import { Page, Locator } from "@playwright/test";
import { logger } from "../utils/logger";

export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginBtn: Locator;
  readonly roleHeading: Locator;
  readonly rocRadio: Locator;
  readonly proceedBtn: Locator;

  constructor(private page: Page) {
    this.username = page.getByRole("textbox", { name: /username/i });
    this.password = page.getByRole("textbox", { name: /password/i });
    this.loginBtn = page.getByRole("button", { name: "Login" });

    this.roleHeading = page.getByRole("heading", {
      name: "Select Your Role",
    });

    this.rocRadio = page.getByRole("radio", { name: "ROC" });
    this.proceedBtn = page.getByRole("button", { name: "Proceed" });
  }

  async login(username: string, password: string) {
    logger.info("Starting login process");

    // Fill credentials
    await this.username.fill(username);
    await this.password.fill(password);

    // Click login
    await this.loginBtn.click();

    const dashboardUrl = /dashboard/;

    // Wait up to 5 seconds for role popup
    const rolePopupAppeared = await this.roleHeading
      .waitFor({ state: "visible", timeout: 5000 })
      .then(() => true)
      .catch(() => false);

    if (rolePopupAppeared) {
      logger.info("Role selection popup appeared.");

      // Select ROC role
      await this.rocRadio.check();

      // Click Proceed and wait for navigation
      await Promise.all([
        this.page.waitForURL(dashboardUrl),
        this.proceedBtn.click(),
      ]);

      logger.info("ROC role selected and navigated to dashboard.");
    } else {
      logger.info("No role popup. Waiting for dashboard navigation.");

      await this.page.waitForURL(dashboardUrl);
    }
  }
}
