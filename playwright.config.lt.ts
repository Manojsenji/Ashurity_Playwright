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
          wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
            JSON.stringify({
              browserName: "chrome",
              browserVersion: "latest",
              platform: "Windows 11",
              name: "Ashurity Test",
              build: "Build 1",
              user: process.env.LAMBDA_USERNAME,
              accessKey: process.env.LAMBDA_ACCESS_KEY,
              network: true,
              console: true,
              video: true,
            }),
          )}`,
        },
      },
    },
  ],
});
