// Hugeicons glyphs that ayywi's own components draw (close buttons, the app shell's menu button). Copied from @hugeicons/core-free-icons
// (MIT, © Hugeicons) so ayywi keeps zero runtime dependencies; tests/node/icons.test.mjs checks they still match.
import type { IconData } from "../components/icon/icon";

export const Cancel01Icon: IconData = [
  ["path", { d: "M18 6L6.00081 17.9992M17.9992 18L6 6.00085", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", key: "0" }],
];

export const Menu01Icon: IconData = [
  ["path", { d: "M4 5L20 5", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", key: "0" }],
  ["path", { d: "M4 12L20 12", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", key: "1" }],
  ["path", { d: "M4 19L20 19", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", key: "2" }],
];
