// playwright.config.lt.ts
import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  timeout: 120000,
  use: {
    headless: true,
  },
  projects: [
    {
      name: "chrome-lambdatest",
      use: {
        browserName: "chromium",
        connectOptions: {
          wsEndpoint: `wss://${process.env.LAMBDA_USERNAME}:${process.env.LAMBDA_ACCESS_KEY}@cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
            JSON.stringify({
              browserName: "chrome",
              browserVersion: "latest",
              platform: "Windows 11",
              name: "Ashurity Test",
              build: "Build 1",
            }),
          )}`,
        },
      },
    },
  ],
});
