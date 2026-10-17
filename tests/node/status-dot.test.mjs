import test from "node:test";
import assert from "node:assert/strict";
import { statusDotClass, statusDotVariants, statusDotSizes } from "../../dist/index.js";

test("statusDotClass produces ayy-status-dot class and modifiers", () => {
  assert.equal(statusDotClass(), "ayy-status-dot ayy-status-dot--neutral");
  assert.equal(statusDotClass({ variant: "neutral" }), "ayy-status-dot ayy-status-dot--neutral");
  assert.equal(statusDotClass({ variant: "success" }), "ayy-status-dot ayy-status-dot--success");
  assert.equal(statusDotClass({ variant: "warning" }), "ayy-status-dot ayy-status-dot--warning");
  assert.equal(statusDotClass({ variant: "destructive" }), "ayy-status-dot ayy-status-dot--destructive");
  assert.equal(statusDotClass({ variant: "info" }), "ayy-status-dot ayy-status-dot--info");

  assert.equal(statusDotClass({ size: "sm" }), "ayy-status-dot ayy-status-dot--neutral ayy-status-dot--sm");
  assert.equal(statusDotClass({ size: "md" }), "ayy-status-dot ayy-status-dot--neutral");
  assert.equal(statusDotClass({ size: "lg" }), "ayy-status-dot ayy-status-dot--neutral ayy-status-dot--lg");

  assert.equal(statusDotClass({ pulse: true }), "ayy-status-dot ayy-status-dot--neutral ayy-status-dot--pulse");
  assert.equal(
    statusDotClass({ variant: "success", size: "lg", pulse: true, className: "custom" }),
    "ayy-status-dot ayy-status-dot--success ayy-status-dot--lg ayy-status-dot--pulse custom",
  );
});

test("statusDotVariants and statusDotSizes arrays match documented values", () => {
  assert.deepEqual(statusDotVariants, ["neutral", "success", "warning", "destructive", "info"]);
  assert.deepEqual(statusDotSizes, ["sm", "md", "lg"]);
});
