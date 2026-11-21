// End-to-end check against a running server: BASE_URL=http://localhost:3000 node scripts/e2e.mjs
// Needs: npm i -D playwright && npx playwright install chromium
import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const shots = process.env.SHOTS_DIR;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const fail = (message) => { console.error("FAIL:", message); process.exitCode = 1; };

await page.goto(base);
await page.getByRole("heading", { name: "Agent Ops Board" }).waitFor();
if (shots) await page.screenshot({ path: `${shots}/board.png` });

const title = `e2e task ${Date.now()}`;
await page.getByLabel("Task title").fill(title);
await page.getByLabel("Notes").fill("created by the e2e script");
await page.getByRole("button", { name: "Add task" }).click();
await page.getByRole("heading", { name: title }).waitFor();

await page.getByLabel(`Move ${title}`).selectOption("review");
await page.waitForFunction((t) => {
  const columns = [...document.querySelectorAll(".column")];
  const review = columns.find((c) => c.querySelector("h2")?.textContent?.startsWith("In review"));
  return review?.textContent?.includes(t);
}, title);

await page.getByLabel("Task title").fill("   ");
await page.getByRole("button", { name: "Add task" }).click();
await page.getByRole("alert").waitFor();
if (shots) await page.screenshot({ path: `${shots}/board-error.png` });

const card = page.locator("article", { hasText: title });
await card.getByRole("button", { name: "Delete" }).click();
await card.waitFor({ state: "detached" });

await browser.close();
if (!process.exitCode) console.log("e2e ok: add, move, validation error, delete");
