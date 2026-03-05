import { test, expect } from "../../../fixtures/baseTest";
import { DashboardPage } from "../../../pages/DashboardPage";
import { RoleManagementPage } from "../../../pages/RoleManagementPage";
import { CreateUserPage, ROCUserData } from "../../../pages/CreateUserPage";
import rocUsers from "../../../test-data/rocUsers.json";
import { logger } from "../../../utils/logger";

// ✅ Use a proper loop to create separate tests
for (const user of rocUsers) {
  test(`ROC creates user: ${user.firstName} ${user.lastName}`, async ({
    loggedInPage,
  }) => {
    const dashboard = new DashboardPage(loggedInPage);
    const rolePage = new RoleManagementPage(loggedInPage);
    const createUser = new CreateUserPage(loggedInPage);

    const uniqueId = Date.now();
    const rocData: ROCUserData = {
      ...user,
      username: `roc${uniqueId}`,
      email: `roc_${uniqueId}@test.com`,
      employeeNumber: `EMP_${uniqueId}`,
    };

    try {
      await dashboard.goToRoleManagement();
      await rolePage.clickCreateAccount();
      await createUser.createROCUser(rocData);
      logger.info(`User creation SUCCESS: ${rocData.username}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error(`User creation FAILED: ${rocData.username} → ${message}`);
      await loggedInPage.screenshot({
        path: `logs/${rocData.username}_creation_failed.png`,
        fullPage: true,
      });
      // ✅ Throw error so Playwright marks this test as failed
      throw new Error(`User creation failed: ${rocData.username} → ${message}`);
    }

    // Optional: Table validation (only if creation succeeded)
    try {
      const searchBox = loggedInPage.getByRole("textbox", {
        name: "Search by name, phone, or email...",
      });
      await searchBox.waitFor({ state: "visible", timeout: 10000 });
      await searchBox.fill(rocData.email);

      const userCell = loggedInPage.locator(`table >> text=${rocData.email}`);
      await expect(userCell).toBeVisible({ timeout: 5000 });
      logger.info(`User validated in table: ${rocData.email}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error(
        `Table validation FAILED for ${rocData.username} → ${message}`,
      );
      await loggedInPage.screenshot({
        path: `logs/${rocData.username}_table_failed.png`,
        fullPage: true,
      });
      throw new Error(
        `Table validation failed: ${rocData.username} → ${message}`,
      );
    }
  });
}
