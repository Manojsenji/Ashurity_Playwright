import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  workers: 3,
  reporter: [
    ['html', {open: 'never'}],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['list'],
    ['allure-playwright']
  ],
  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      slowMo: 200, // simulate human typing
      args: [
        '--disable-autofill-keyboard-accessory-view',
        '--disable-password-manager-reauthentication'
      ],
    },
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});