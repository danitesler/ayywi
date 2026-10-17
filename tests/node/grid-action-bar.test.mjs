import test from "node:test";
import assert from "node:assert/strict";
import {
  gridClass,
  gridItemActionsClass,
  gridWrapClass,
  gridToolbarClass,
  gridSelectAllClass,
  gridItemClass,
  gridMediaClass,
  gridHeaderClass,
  gridSelectClass,
  gridTitleClass,
  gridDescriptionClass,
  gridBodyClass,
  gridFooterClass,
  actionBarClass,
  actionBarButtonClass,
  actionBarSelectionClass,
  actionBarCountClass,
  actionBarCloseClass,
  actionBarSeparatorClass,
  actionBarActionsClass,
  tableActionsClass,
  tableRowActionsClass,
} from "../../dist/index.js";

test("gridClass produces ayy-grid and compact modifier", () => {
  assert.equal(gridClass(), "ayy-grid");
  assert.equal(gridClass({ compact: false }), "ayy-grid");
  assert.equal(gridClass({ compact: true }), "ayy-grid ayy-grid--compact");
  assert.equal(gridClass({ compact: true, className: "custom" }), "ayy-grid ayy-grid--compact custom");
});

test("gridItemActionsClass produces ayy-grid__actions and reveal modifier", () => {
  assert.equal(gridItemActionsClass(), "ayy-grid__actions");
  assert.equal(gridItemActionsClass({ reveal: true }), "ayy-grid__actions ayy-grid__actions--reveal");
  assert.equal(gridItemActionsClass({ reveal: true, className: "custom" }), "ayy-grid__actions ayy-grid__actions--reveal custom");
});

test("grid class constants match the CSS contract", () => {
  assert.equal(gridWrapClass, "ayy-grid-wrap");
  assert.equal(gridToolbarClass, "ayy-grid__toolbar");
  assert.equal(gridSelectAllClass, "ayy-grid__select-all");
  assert.equal(gridItemClass, "ayy-grid__item");
  assert.equal(gridMediaClass, "ayy-grid__media");
  assert.equal(gridHeaderClass, "ayy-grid__header");
  assert.equal(gridSelectClass, "ayy-grid__select");
  assert.equal(gridTitleClass, "ayy-grid__title");
  assert.equal(gridDescriptionClass, "ayy-grid__description");
  assert.equal(gridBodyClass, "ayy-grid__body");
  assert.equal(gridFooterClass, "ayy-grid__footer");
});

test("actionBarClass and actionBarButtonClass produce expected classes", () => {
  assert.equal(actionBarClass(), "ayy-action-bar");
  assert.equal(actionBarClass({ fixed: true }), "ayy-action-bar ayy-action-bar--fixed");
  assert.equal(actionBarClass({ fixed: true, className: "custom" }), "ayy-action-bar ayy-action-bar--fixed custom");

  assert.equal(actionBarButtonClass(), "ayy-action-bar__button");
  assert.equal(actionBarButtonClass({ variant: "default" }), "ayy-action-bar__button");
  assert.equal(actionBarButtonClass({ variant: "secondary" }), "ayy-action-bar__button ayy-action-bar__button--secondary");
  assert.equal(actionBarButtonClass({ secondary: true }), "ayy-action-bar__button ayy-action-bar__button--secondary");
  assert.equal(actionBarButtonClass({ variant: "primary" }), "ayy-action-bar__button ayy-action-bar__button--primary");
  assert.equal(actionBarButtonClass({ variant: "destructive" }), "ayy-action-bar__button ayy-action-bar__button--destructive");
});

test("action-bar and table row action class constants match the CSS contract", () => {
  assert.equal(actionBarSelectionClass, "ayy-action-bar__selection");
  assert.equal(actionBarCountClass, "ayy-action-bar__count");
  assert.equal(actionBarCloseClass, "ayy-action-bar__close");
  assert.equal(actionBarSeparatorClass, "ayy-action-bar__separator");
  assert.equal(actionBarActionsClass, "ayy-action-bar__actions");
  assert.equal(tableActionsClass, "ayy-table__actions");
  assert.equal(tableRowActionsClass(), "ayy-table__row-actions");
  assert.equal(tableRowActionsClass({ reveal: true }), "ayy-table__row-actions ayy-table__row-actions--reveal");
});
