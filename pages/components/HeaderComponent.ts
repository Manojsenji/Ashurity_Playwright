import { Page, Locator } from "@playwright/test";
import { logger } from "../../utils/logger";

export class HeaderComponent {
  readonly profileIcon: Locator;
  readonly logoutBtn: Locator;

  constructor(private readonly page: Page) {
    this.profileIcon = page.getByAltText("Profile");
    this.logoutBtn = page.getByText("Logout", { exact: true });
  }

  async logout(): Promise<void> {
    logger.info("Starting logout process");
    await this.profileIcon.click();
    await this.logoutBtn.waitFor({ state: "visible" });
    await this.logoutBtn.click();
    await this.page.waitForURL(/login/, { timeout: 10000 });
    logger.info("Logout successful");
  }
}
