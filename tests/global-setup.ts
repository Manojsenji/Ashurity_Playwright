import fs from "fs";
import path from "path";

async function globalSetup() {
  const resultsDir = "allure-results";

  // Create folder if not exists
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
  }

  // Environment file
  const envData = `
Browser=Chromium
Environment=DEV
BaseURL=http://ashurityuat.azurewebsites.net
Tester=Manoj
Execution=Playwright Automation
`;

  fs.writeFileSync(
    path.join(resultsDir, "environment.properties"),
    envData.trim(),
  );

  // Executor file
  const executorData = {
    name: "Playwright Automation",
    type: "playwright",
    buildName: "Ashurity Automation Run",
    buildUrl: "http://localhost",
    reportUrl: "http://localhost",
    buildOrder: 1,
  };

  fs.writeFileSync(
    path.join(resultsDir, "executor.json"),
    JSON.stringify(executorData, null, 2),
  );
}

export default globalSetup;
