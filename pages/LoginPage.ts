import { Page, Locator } from '@playwright/test';
import { logger } from '../utils/logger';

export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginBtn: Locator;
  readonly radioBtn: Locator;
  readonly proceedbtn: Locator;

  constructor(private page: Page) {
    this.username = page.getByRole('textbox', { name: 'username' });
    this.password = page.getByRole('textbox', { name: 'password' });
    this.loginBtn = page.getByRole('button', { name: 'Login' });
    this.radioBtn = page.getByLabel('ROC');
    this.proceedbtn = page.getByRole('button', { name: 'Proceed' });
  }

  async login(username: string, password: string) {
    logger.info('Starting login process');

    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginBtn.click();

    await this.radioBtn.click();
    await this.proceedbtn.click();

    await this.page.waitForURL(/dashboard/, { timeout: 15000 });

    logger.info('Login successful - Dashboard loaded');
  }
}