import assert from "node:assert/strict";
import { test } from "node:test";

const config = new URL("../../playwright.config.ts", import.meta.url).href;
let run = 0;
async function browserFor(env) {
  const keys = ["CI", "E2E_CHROME"];
  const saved = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
  for (const k of keys) delete process.env[k];
  Object.assign(process.env, env);
  try {
    const { default: c } = await import(`${config}?${run++}`);
    const { channel, launchOptions } = c.projects[0].use;
    return { channel, executablePath: launchOptions?.executablePath };
  } finally {
    for (const k of keys) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  }
}

test("e2e uses Playwright's Chromium; the installed Chrome only when E2E_CHROME asks for it", async () => {
  const plain = await browserFor({});
  assert.equal(plain.channel, undefined);
  assert.doesNotMatch(String(plain.executablePath), /Google Chrome/);
  assert.equal((await browserFor({ E2E_CHROME: "1" })).channel, "chrome");
});
