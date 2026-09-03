import { defineConfig, devices } from "@playwright/test";

const APP_PORT = 3100;
const FIXTURE_API_PORT = 4100;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  failOnFlakyTests: Boolean(process.env.CI),
  // On CI the GitHub reporter annotates the run, and the HTML report is uploaded
  // as an artifact when the suite fails.
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${APP_PORT}`,
    trace: "on-first-retry",
  },
  expect: { timeout: 15_000 },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // The tests run against a production build wired to the fixture API, so they
  // check the same code path that ships. The build itself is done by the
  // `test:e2e` script, so it happens exactly once per run.
  webServer: [
    {
      command: "node tests/fixture-server.mjs",
      url: `http://127.0.0.1:${FIXTURE_API_PORT}/posts`,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `npm run start -- --hostname 127.0.0.1 --port ${APP_PORT}`,
      url: `http://127.0.0.1:${APP_PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      env: { API_BASE_URL: `http://127.0.0.1:${FIXTURE_API_PORT}` },
    },
  ],
});
