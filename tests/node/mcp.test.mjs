import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const cli = fileURLToPath(new URL("../../cli/index.mjs", import.meta.url));

/** Talk to `ayywi mcp` over stdio like a real client would. */
function session() {
  const child = spawn(process.execPath, [cli, "mcp"], { stdio: ["pipe", "pipe", "inherit"] });
  const waiting = new Map();
  let buffer = "";
  child.stdout.on("data", (chunk) => {
    buffer += chunk;
    let i;
    while ((i = buffer.indexOf("\n")) >= 0) {
      const msg = JSON.parse(buffer.slice(0, i));
      buffer = buffer.slice(i + 1);
      waiting.get(msg.id)?.(msg);
    }
  });
  let id = 0;
  const request = (method, params) =>
    new Promise((resolve) => {
      waiting.set(++id, resolve);
      child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
    });
  const notify = (method) => child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method })}\n`);
  return { request, notify, close: () => child.kill() };
}

test("MCP handshake and tools", async (t) => {
  const s = session();
  t.after(s.close);

  const init = await s.request("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "0" } });
  assert.equal(init.result.serverInfo.name, "ayywi");
  assert.ok(init.result.capabilities.tools);
  s.notify("notifications/initialized");

  const list = await s.request("tools/list");
  const names = list.result.tools.map((tool) => tool.name).sort();
  assert.deepEqual(names, ["get_component", "get_rules", "get_tokens", "lint", "list_components", "search"]);

  const call = (name, args) => s.request("tools/call", { name, arguments: args }).then((r) => r.result.content[0].text);
  assert.match(await call("list_components", {}), /Dropdown menu|menu/i);
  assert.match(await call("get_component", { name: "DropdownMenu" }), /ayy-menu__item/);
  assert.match(await call("get_component", { name: "ayy-tabs" }), /ayy-value-change/);
  assert.match(await call("get_tokens", { group: "color" }), /--ayy-color-bg/);
  assert.match(await call("search", { query: "settings" }), /^- pattern settings:/);
  assert.match(await call("get_rules", {}), /Pattern: Settings[\s\S]*Back to <app name>[\s\S]*Settings row/);
  assert.match(await call("lint", { code: `<button class="ayy-buton">x</button>`, filename: "x.html" }), /unknown-class/);

  const bad = await s.request("tools/call", { name: "nope", arguments: {} });
  assert.ok(bad.error);
});
