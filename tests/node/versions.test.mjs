import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const script = fileURLToPath(new URL("../../scripts/keep-versions.mjs", import.meta.url));
const run = promisify(execFile);

/** A fake live site: a versions.json with one older release, and that release's files. */
function liveSite(routes) {
  const server = createServer((req, res) => {
    const body = routes[req.url];
    if (body === undefined) {
      res.statusCode = 404;
      res.end();
    } else res.end(body);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

test("keep-versions copies earlier releases from the live site and merges versions.json", async (t) => {
  const out = mkdtempSync(join(tmpdir(), "ayywi-pages-"));
  t.after(() => rmSync(out, { recursive: true, force: true }));
  writeFileSync(join(out, "versions.json"), JSON.stringify({ latest: "0.5.0-bbbb", versions: [{ id: "0.5.0-bbbb", version: "0.5.0", built: "2026-10-02", files: ["dist/ayywi.min.css"] }] }));
  const older = { id: "0.4.0-aaaa", version: "0.4.0", built: "2026-09-29", files: ["dist/ayywi.min.css", "dist/fonts/sora.woff2"] };
  const server = await liveSite({
    "/ayywi/versions.json": JSON.stringify({ latest: "0.4.0-aaaa", versions: [older] }),
    "/ayywi/v/0.4.0-aaaa/dist/ayywi.min.css": ".ayy-button{}",
    "/ayywi/v/0.4.0-aaaa/dist/fonts/sora.woff2": "font",
  });
  t.after(() => server.close());
  const site = `http://127.0.0.1:${server.address().port}/ayywi/`;

  await run(process.execPath, [script], { env: { ...process.env, AYYWI_SITE: site, AYYWI_OUT: out } });
  assert.equal(readFileSync(join(out, "v/0.4.0-aaaa/dist/ayywi.min.css"), "utf8"), ".ayy-button{}");
  assert.ok(existsSync(join(out, "v/0.4.0-aaaa/dist/fonts/sora.woff2")));
  const versions = JSON.parse(readFileSync(join(out, "versions.json"), "utf8"));
  assert.equal(versions.latest, "0.5.0-bbbb", "the new build stays the latest");
  assert.deepEqual(versions.versions.map((v) => v.id), ["0.5.0-bbbb", "0.4.0-aaaa"]);
});

test("keep-versions: nothing to keep on a first deploy, and a missing file stops the deploy", async (t) => {
  const out = mkdtempSync(join(tmpdir(), "ayywi-pages-"));
  t.after(() => rmSync(out, { recursive: true, force: true }));
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, "versions.json"), JSON.stringify({ latest: "0.5.0-bbbb", versions: [] }));

  const empty = await liveSite({});
  t.after(() => empty.close());
  const first = await run(process.execPath, [script], { env: { ...process.env, AYYWI_SITE: `http://127.0.0.1:${empty.address().port}/`, AYYWI_OUT: out } });
  assert.match(first.stdout, /nothing to keep/);

  const broken = await liveSite({ "/versions.json": JSON.stringify({ versions: [{ id: "0.4.0-aaaa", files: ["dist/ayywi.min.css"] }] }) });
  t.after(() => broken.close());
  await assert.rejects(run(process.execPath, [script], { env: { ...process.env, AYYWI_SITE: `http://127.0.0.1:${broken.address().port}/`, AYYWI_OUT: out } }), /404/);
});
