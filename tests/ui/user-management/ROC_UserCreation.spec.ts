import { test } from "../../../fixtures/baseTest";
import { DashboardPage } from "../../../pages/DashboardPage";
import { RoleManagementPage } from "../../../pages/RoleManagementPage";
import { CreateUserPage, ROCUserData } from "../../../pages/CreateUserPage";
import { UserManagementPage } from "../../../pages/UserManagementPage";
import rocUsers from "../../../test-data/rocUsers.json";
import { logger } from "../../../utils/logger";

test.describe("ROC User Creation", () => {
  test.describe.configure({ mode: "serial" });

rocUsers.forEach((user) => {
  test(`ROC creates user: ${user.firstName} ${user.lastName}`, async ({
    loggedInPage,
  }) => {
    const dashboard = new DashboardPage(loggedInPage);
    const rolePage = new RoleManagementPage(loggedInPage);
    const createUser = new CreateUserPage(loggedInPage);
    const userManagement = new UserManagementPage(loggedInPage);

    const uniqueId = Date.now();

    const rocData: ROCUserData = {
      ...user,
      username: `roc${uniqueId}`,
      email: `roc_${uniqueId}@test.com`,
      employeeNumber: `EMP_${uniqueId}`,
    };

    logger.info(`Starting ROC user creation: ${rocData.username}`);

    await dashboard.goToRoleManagement();
    await rolePage.clickCreateAccount();

    const result = await createUser.createROCUser(rocData);

    if (!result.success) {
      logger.error(`User creation FAILED: ${rocData.username}`);

      await loggedInPage.screenshot({
        path: `logs/${rocData.username}_creation_failed.png`,
        fullPage: true,
      });

      throw new Error(result.message);
    }

    logger.info(`User creation SUCCESS: ${rocData.username}`);

    // Navigate to User Management
    await dashboard.goToRoleManagement();

    logger.info(`Searching user with email: ${rocData.email}`);

    // Search using your existing method
    await userManagement.searchUser(rocData.email);

    // Validate in table
    await userManagement.validateEmailExists(rocData.email);

    logger.info(`User successfully found in table: ${rocData.email}`);
  });
});
}); 