import fs from "fs";
import path from "path";

const resultsDir = "allure-results";

// Ensure directory exists
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir);
}

// Create environment.properties
fs.writeFileSync(
  path.join(resultsDir, "environment.properties"),
  `Browser=Chromium
Environment=QA
BaseURL=http://ashurityuat.azurewebsites.net
Tester=Manoj`,
);

// Create executor.json
fs.writeFileSync(
  path.join(resultsDir, "executor.json"),
  JSON.stringify(
    {
      name: "Playwright Tests",
      type: "playwright",
      buildName: "Playwright Automation",
      buildUrl: "http://localhost",
      reportUrl: "http://localhost",
      buildOrder: 1,
    },
    null,
    2,
  ),
);
