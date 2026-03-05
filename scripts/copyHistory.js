import dotenv from "dotenv";
import fs from "fs";
import os from "os";
import path from "path";
import { execSync } from "child_process";
import { validateEnv } from "./config/validateENV";

export default async () => {

  const env = process.env.ENV || "DEV";

  dotenv.config({
    path: `.env.${env}`,
    override: true,
  });

  validateEnv(["BASE_URL", "USERNAME", "PASSWORD"], env);

  console.log(`Environment Loaded: ${env}`);

  const resultsDir = "allure-results";

  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
  }

  // -------- ENVIRONMENT INFO --------

  const environmentData = `
Browser=Chromium
Environment=${env}
BaseURL=${process.env.BASE_URL}
OS=${os.type()} ${os.release()}
Node=${process.version}
Tester=Manoj
Framework=Playwright
`;

  fs.writeFileSync(
    path.join(resultsDir, "environment.properties"),
    environmentData.trim()
  );

  // -------- EXECUTOR INFO --------

  let gitCommit = "unknown";

  try {
    gitCommit = execSync("git rev-parse --short HEAD").toString().trim();
  } catch (error) {}

  const executor = {
    name: "Playwright Automation",
    type: "playwright",
    buildName: "Ashurity Test Run",
    buildOrder: Date.now(),
    reportUrl: "http://localhost",
    buildUrl: "http://localhost",
    buildTag: gitCommit
  };

  fs.writeFileSync(
    path.join(resultsDir, "executor.json"),
    JSON.stringify(executor, null, 2)
  );

  console.log("Allure Environment and Executor files created");
};