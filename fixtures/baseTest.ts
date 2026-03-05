import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { logger } from '../utils/logger';
import * as allure from 'allure-js-commons';

type MyFixtures = { loggedInPage: Page };

export const test = base.extend<MyFixtures>({
  loggedInPage: async ({ page }, use, testInfo) => {

    logger.info(`Starting Test: ${testInfo.title}`);

    await page.goto('/');

    const login = new LoginPage(page);
    await login.login(process.env.USERNAME!, process.env.PASSWORD!);
    // console.log('ENV USERNAME:', process.env.USERNAME);
    // console.log('ENV PASSWORD:', process.env.PASSWORD);

    await use(page);

    // Attach screenshot on failure
    if (testInfo.status !== testInfo.expectedStatus) {
      logger.error(`Test Failed: ${testInfo.title}`);
      const screenshot = await page.screenshot({ fullPage: true });
      await allure.attachment('Failure Screenshot', screenshot, 'image/png');
      logger.info('Screenshot attached to Allure report');
    } else {
      logger.info(`Test Passed: ${testInfo.title}`);
    }

   
  },
});

export { expect };