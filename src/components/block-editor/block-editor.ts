// Block editor: a Notion-style document editor. Every line is a block (text, headings, lists, to-dos, quotes,
// callouts, code, dividers, images, embeds, files) with its own contentEditable; Enter splits a block, Backspace at its
// start merges it into the one above, the arrows walk between blocks, Markdown shortcuts ("# ", "- ", "[] ", "**bold**")
// turn into formatting as you type, "/" opens the block menu and a trigger ("@") opens mentions. Blocks reorder by their
// drag handle (connectDragDrop, the same look as every other drag in ayywi), Esc selects blocks, and a selection can run
// across blocks like in a text editor.
//
// The value is a list of blocks; text blocks carry their inline content as a small, sanitised HTML subset (strong, em,
// u, s, code, a and mention chips). The editor renders the blocks, keeps its own undo history (structural edits would
// confuse the browser's) and reports every change with the whole value. Nothing here needs React; the React wrapper
// and <ayy-block-editor> both call connectBlockEditor().
import { cx } from "../../lib/cx";
import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  ArrowUpRight01Icon,
  Attachment01Icon,
  BulbIcon,
  CheckListIcon,
  CloudUploadIcon,
  CodeIcon,
  Copy01Icon,
  CopyPlusIcon,
  Delete02Icon,
  Grid3x3Icon,
  Heading01Icon,
  Heading02Icon,
  Heading03Icon,
  Image01Icon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  Link01Icon,
  PlusSignIcon,
  QuoteDownIcon,
  SolidLine01Icon,
  SourceCodeIcon,
  TextBoldIcon,
  TextIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
  Unlink04Icon,
  Video01Icon,
} from "../../lib/icons";
import { autoPlace, supportsPopover } from "../../lib/position";
import { avatarClass, avatarInitials } from "../avatar/avatar";
import { buttonClass } from "../button/button";
import { checkboxClass } from "../checkbox/checkbox";
import { codeBlockCopyIcon, copyCodeBlock, normalizeLanguage, tokenizeCode } from "../code-block/code-block";
import { announce, connectDragDrop, dragHandleClass, dragHandleIcon, dragPreviewChip, dragPreviewClass, setDropEdge, type DragMove } from "../drag-drop/drag-drop";
import { iconSvg, type IconData } from "../icon/icon";
import { inputClass } from "../input/input";
import { isApplePlatform, shortcutHtml } from "../shortcut/shortcut";

// ---- Types and the class contract ----

export const blockEditorBlockTypes = [
  "text",
  "heading-1",
  "heading-2",
  "heading-3",
  "bullet",
  "number",
  "todo",
  "quote",
  "callout",
  "toggle",
  "table",
  "code",
  "divider",
  "image",
  "embed",
  "file",
] as const;
export type BlockEditorBlockType = (typeof blockEditorBlockTypes)[number];

export type BlockEditorTableAlign = "start" | "center" | "end";
const TABLE_ALIGNS: readonly BlockEditorTableAlign[] = ["start", "center", "end"];
const MIN_COLUMN = 48;
const MAX_COLUMN = 1200;

export interface BlockEditorBlock {
  /** Stable id; the editor makes one when it's missing. */
  id: string;
  type: BlockEditorBlockType;
  /** Inline content of text blocks as sanitised HTML: text with <strong>, <em>, <u>, <s>, <code>, <a href> and mention chips. Code blocks hold escaped plain text. */
  html?: string;
  /** Nesting level, 0–4 (lists, to-dos and text). */
  indent?: number;
  /** To-do blocks: done or not. */
  checked?: boolean;
  /** Toggle blocks: showing the blocks nested under it (otherwise they're hidden). */
  open?: boolean;
  /** Table blocks: the cells, row by row, as plain text. Every row has the same number of cells. */
  rows?: string[][];
  /** Table blocks: the first row is a header (default true). */
  header?: boolean;
  /** Table blocks: the first column is a header too (its cells name their row). */
  headerColumn?: boolean;
  /** Table blocks: each column's width in px; 0 leaves it to share what's left. Missing: every column the same. */
  widths?: number[];
  /** Table blocks: how each column's text lines up. Missing: all at the start. */
  align?: BlockEditorTableAlign[];
  /** Image, embed and file blocks: the URL. Empty until one is added. */
  src?: string;
  /** Image and embed blocks: plain-text caption (also the image's alt text). */
  caption?: string;
  /** Code blocks: the language it's highlighted as ("typescript", "python"…); none is plain text. */
  language?: string;
  /** Image blocks: width in percent of the column, 20–100. */
  width?: number;
  /** File blocks: file name and size in bytes. */
  name?: string;
  size?: number;
}

export interface BlockEditorMentionOption {
  id: string;
  /** What the chip and the menu show. */
  label: string;
  /** A muted second line in the menu: a role, a status. */
  hint?: string;
  /** An Avatar in the menu: true for initials, or an image URL. */
  avatar?: boolean | string;
}

export interface BlockEditorMentionSource {
  /** The character that opens this list, e.g. "@" for people or "#" for issues. */
  trigger: string;
  /** Heading over the suggestions ("People"). */
  label?: string;
  /** The suggestions, or a function that finds them for what's been typed after the trigger. */
  options: BlockEditorMentionOption[] | ((query: string) => BlockEditorMentionOption[] | Promise<BlockEditorMentionOption[]>);
}

export interface BlockEditorMention {
  trigger: string;
  id: string;
  label: string;
}

export interface BlockEditorOptions {
  /** The blocks to start with. Without it, the editor reads the blocks already in the markup. */
  value?: BlockEditorBlock[];
  /** Shown while the whole document is empty. */
  placeholder?: string;
  /** Accessible name of the editor. Default "Editor". */
  label?: string;
  /** Show the document without editing it. */
  readOnly?: boolean;
  /** Inline mention lists, one per trigger character. */
  mentions?: BlockEditorMentionSource[];
  /** Store a pasted, dropped or picked file and return its URL. Default: a data: URL (fine for demos, too big for real storage). */
  upload?: (file: File) => string | Promise<string>;
  /** Called after every change with the whole value. */
  onChange?: (value: BlockEditorBlock[]) => void;
  /** Called when a mention chip is clicked. */
  onMentionClick?: (mention: BlockEditorMention, event: MouseEvent) => void;
}

export interface BlockEditorController {
  getValue(): BlockEditorBlock[];
  /** Replace the document (clears the undo history). Ignored when it's the value the editor already has. */
  setValue(value: BlockEditorBlock[]): void;
  /** Change options after connecting (mentions, upload, callbacks, readOnly, placeholder, label). */
  setOptions(options: Partial<Omit<BlockEditorOptions, "value">>): void;
  /** Put the caret in the first or last text block. */
  focus(at?: "start" | "end"): void;
  destroy(): void;
}

export interface BlockEditorClassOptions {
  /** Keep the drag handles inside the editor's own box (for tight containers); by default they hang in the margin at the inline start. */
  inset?: boolean;
  className?: string;
}

export function blockEditorClass({ inset, className }: BlockEditorClassOptions = {}): string {
  return cx("ayy-block-editor", inset && "ayy-block-editor--inset", className);
}

const P = "ayy-block-editor";
export const blockEditorBlockClass = `${P}__block`;
export const blockEditorTextClass = `${P}__text`;
export const blockEditorMentionClass = `${P}__mention`;
const C = {
  block: blockEditorBlockClass,
  gutter: `${P}__gutter`,
  add: `${P}__add`,
  handle: `${P}__handle`,
  marker: `${P}__marker`,
  check: `${P}__check`,
  icon: `${P}__icon`,
  text: blockEditorTextClass,
  rule: `${P}__rule`,
  media: `${P}__media`,
  frame: `${P}__frame`,
  image: `${P}__image`,
  resize: `${P}__resize`,
  caption: `${P}__caption`,
  bookmark: `${P}__bookmark`,
  bookmarkTitle: `${P}__bookmark-title`,
  bookmarkUrl: `${P}__bookmark-url`,
  file: `${P}__file`,
  fileName: `${P}__file-name`,
  fileSize: `${P}__file-size`,
  empty: `${P}__empty`,
  mention: blockEditorMentionClass,
  mentionTrigger: `${P}__mention-trigger`,
  menu: `${P}__menu`,
  menuLabel: `${P}__menu-label`,
  option: `${P}__option`,
  optionIcon: `${P}__option-icon`,
  optionText: `${P}__option-text`,
  optionHint: `${P}__option-hint`,
  toggle: `${P}__toggle`,
  tableWrap: `${P}__table-wrap`,
  tableScroll: `${P}__table-scroll`,
  table: `${P}__table`,
  cell: `${P}__cell`,
  tableAdd: `${P}__table-add`,
  colResize: `${P}__col-resize`,
  toolbar: `${P}__toolbar`,
  codeBar: `${P}__code-bar`,
  codeButton: `${P}__code-button`,
  linkForm: `${P}__link-form`,
  anchor: `${P}__anchor`,
} as const;

interface TypeInfo {
  label: string;
  hint: string;
  icon: IconData;
  keywords: string;
  /** The Markdown shortcut that makes it, shown in the / menu. */
  markdown?: string;
  media?: boolean;
}

const TYPES: Record<BlockEditorBlockType, TypeInfo> = {
  text: { label: "Text", hint: "Just start writing", icon: TextIcon, keywords: "paragraph plain body" },
  "heading-1": { label: "Heading 1", hint: "Big section heading", icon: Heading01Icon, keywords: "h1 title", markdown: "#" },
  "heading-2": { label: "Heading 2", hint: "Medium section heading", icon: Heading02Icon, keywords: "h2 subtitle", markdown: "##" },
  "heading-3": { label: "Heading 3", hint: "Small section heading", icon: Heading03Icon, keywords: "h3", markdown: "###" },
  bullet: { label: "Bulleted list", hint: "A simple list", icon: LeftToRightListBulletIcon, keywords: "bullet unordered ul", markdown: "-" },
  number: { label: "Numbered list", hint: "A list with numbers", icon: LeftToRightListNumberIcon, keywords: "numbered ordered ol", markdown: "1." },
  todo: { label: "To-do list", hint: "Track tasks with a checkbox", icon: CheckListIcon, keywords: "todo task checkbox check", markdown: "[]" },
  quote: { label: "Quote", hint: "Set a quotation apart", icon: QuoteDownIcon, keywords: "blockquote citation", markdown: ">" },
  toggle: { label: "Toggle", hint: "Hide or show the blocks under it", icon: ArrowRight01Icon, keywords: "toggle collapsible collapse expand details accordion dropdown", markdown: ">>" },
  callout: { label: "Callout", hint: "Make a note stand out", icon: BulbIcon, keywords: "note tip info warning aside" },
  table: { label: "Table", hint: "Rows and columns of plain text", icon: Grid3x3Icon, keywords: "table grid rows columns cells spreadsheet" },
  code: { label: "Code", hint: "A monospace snippet", icon: SourceCodeIcon, keywords: "snippet pre program", markdown: "```" },
  divider: { label: "Divider", hint: "Separate sections", icon: SolidLine01Icon, keywords: "line rule separator hr", markdown: "---" },
  image: { label: "Image", hint: "Upload or link a picture", icon: Image01Icon, keywords: "picture photo screenshot img", media: true },
  embed: { label: "Video or embed", hint: "YouTube, Vimeo, Loom, audio or any link", icon: Video01Icon, keywords: "video embed youtube vimeo loom audio link bookmark iframe", media: true },
  file: { label: "File", hint: "Attach a file to download", icon: Attachment01Icon, keywords: "file attachment upload pdf document", media: true },
};

/** The label of a block type, as the editor's menus name it ("Heading 1", "To-do list"). */
export function blockEditorTypeLabel(type: BlockEditorBlockType): string {
  return TYPES[type].label;
}

const LIST_TYPES: readonly BlockEditorBlockType[] = ["bullet", "number", "todo"];

/** The languages a code block offers, by the id Code block's highlighter knows them as. */
export const blockEditorCodeLanguages: readonly { id: string; label: string }[] = [
  { id: "", label: "Plain text" },
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "jsx", label: "JSX" },
  { id: "tsx", label: "TSX" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "scss", label: "SCSS" },
  { id: "json", label: "JSON" },
  { id: "markdown", label: "Markdown" },
  { id: "bash", label: "Bash" },
  { id: "python", label: "Python" },
  { id: "sql", label: "SQL" },
  { id: "yaml", label: "YAML" },
  { id: "toml", label: "TOML" },
  { id: "graphql", label: "GraphQL" },
  { id: "go", label: "Go" },
  { id: "rust", label: "Rust" },
  { id: "java", label: "Java" },
  { id: "kotlin", label: "Kotlin" },
  { id: "swift", label: "Swift" },
  { id: "c", label: "C" },
  { id: "cpp", label: "C++" },
  { id: "csharp", label: "C#" },
  { id: "php", label: "PHP" },
  { id: "ruby", label: "Ruby" },
  { id: "dockerfile", label: "Dockerfile" },
  { id: "xml", label: "XML" },
];
/** A language name or alias ("js", "py", "shell") as the id code blocks store, or "" for plain text. */
function codeLanguage(raw: string | null | undefined): string {
  const id = normalizeLanguage(raw ?? "");
  return blockEditorCodeLanguages.some((l) => l.id === id) ? id : "";
}
const languageLabel = (id: string | undefined) => blockEditorCodeLanguages.find((l) => l.id === (id ?? ""))?.label ?? "Plain text";
const INDENTABLE: readonly BlockEditorBlockType[] = ["text", "bullet", "number", "todo", "toggle"];
const MAX_INDENT = 4;
const MAX_ROWS = 100;
const MAX_COLUMNS = 12;
const isText = (type: BlockEditorBlockType) => type !== "divider" && type !== "table" && !TYPES[type].media;
const isList = (type: BlockEditorBlockType) => LIST_TYPES.includes(type);
/** A zero-width space keeps the caret outside a mark that was just made at the end of a line; never stored. */
const ZW = "​";

let counter = 0;
/** A fresh block id. */
export function blockEditorId(): string {
  counter += 1;
  return `b${Date.now().toString(36)}${counter.toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}

/** A new block of `type` (text by default). */
export function blockEditorBlock(type: BlockEditorBlockType = "text", fields: Partial<Omit<BlockEditorBlock, "type">> = {}): BlockEditorBlock {
  return { id: blockEditorId(), type, ...(isText(type) ? { html: "" } : {}), ...(type === "todo" ? { checked: false } : {}), ...(type === "toggle" ? { open: true } : {}), ...(type === "table" ? { rows: tableRows(3, 3), header: true } : {}), ...fields };
}

/** An empty grid of cells. */
function tableRows(rows: number, columns: number): string[][] {
  return Array.from({ length: rows }, () => Array.from({ length: columns }, () => ""));
}

/** Cells as the table stores them: single-line plain text, every row as wide as the widest, at least one cell. */
function tableGrid(raw: unknown): string[][] {
  const grid = (Array.isArray(raw) ? raw : []).slice(0, MAX_ROWS).map((row) => (Array.isArray(row) ? row : []).slice(0, MAX_COLUMNS).map((cell) => String(cell ?? "").replace(/\s+/g, " ").trim()));
  const width = Math.max(1, ...grid.map((row) => row.length));
  if (!grid.length) grid.push([]);
  return grid.map((row) => Array.from({ length: width }, (_, c) => row[c] ?? ""));
}

// ---- Strings, URLs and embeds (no DOM needed) ----

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const unescapeHtml = (s: string) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

/** A URL that's safe to link to or load, or "" (no javascript:, no data: except images for `src`). */
function safeUrl(raw: string | null | undefined, kind: "href" | "src" = "href"): string {
  const url = (raw ?? "").trim();
  if (!url) return "";
  if (/^(https?:|mailto:|tel:)/i.test(url)) return kind === "src" && !/^https?:/i.test(url) ? "" : url;
  if (kind === "src" && (/^data:image\/(png|jpe?g|gif|webp|avif|svg\+xml);/i.test(url) || /^blob:/i.test(url))) return url;
  if (kind === "src" && /^data:(video|audio|application)\//i.test(url)) return url;
  if (/^(\/|\.\/|\.\.\/|#|\?)/.test(url)) return url;
  if (/^[\w-]+(\.[\w-]+)+(\/|$)/.test(url)) return `https://${url}`;
  return "";
}

export type BlockEditorEmbed =
  | { kind: "iframe"; src: string; provider: string; ratio: "video" | "audio" | "square" }
  | { kind: "video" | "audio"; src: string }
  | { kind: "link"; src: string; host: string };

/** What an embed block shows for a URL: a provider's player (YouTube, Vimeo, Loom, Spotify, Figma), a video or audio file, or a link card. */
export function blockEditorEmbed(rawUrl: string): BlockEditorEmbed | null {
  const url = safeUrl(rawUrl, "src") || safeUrl(rawUrl);
  if (!url) return null;
  let m: RegExpMatchArray | null;
  if ((m = url.match(/(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/))) {
    return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${m[1]}`, provider: "YouTube", ratio: "video" };
  }
  if ((m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/))) return { kind: "iframe", src: `https://player.vimeo.com/video/${m[1]}`, provider: "Vimeo", ratio: "video" };
  if ((m = url.match(/loom\.com\/(?:share|embed)\/([\w]+)/))) return { kind: "iframe", src: `https://www.loom.com/embed/${m[1]}`, provider: "Loom", ratio: "video" };
  if ((m = url.match(/open\.spotify\.com\/(track|album|playlist|episode|show)\/([\w]+)/))) {
    return { kind: "iframe", src: `https://open.spotify.com/embed/${m[1]}/${m[2]}`, provider: "Spotify", ratio: "audio" };
  }
  if (/^https:\/\/(www\.)?figma\.com\/(file|design|proto|board)\//.test(url)) {
    return { kind: "iframe", src: `https://www.figma.com/embed?embed_host=ayywi&url=${encodeURIComponent(url)}`, provider: "Figma", ratio: "square" };
  }
  const path = url.split(/[?#]/)[0].toLowerCase();
  if (/\.(mp4|webm|m4v|mov|ogv)$/.test(path) || /^data:video\//.test(url)) return { kind: "video", src: url };
  if (/\.(mp3|wav|ogg|oga|m4a|flac|aac)$/.test(path) || /^data:audio\//.test(url)) return { kind: "audio", src: url };
  if (!/^https?:/i.test(url)) return null;
  let host = url;
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    // Keep the URL as its own name.
  }
  return { kind: "link", src: url, host };
}

function formatSize(bytes: number | undefined): string {
  if (!bytes || bytes < 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes;
  let u = 0;
  while (n >= 1024 && u < units.length - 1) {
    n /= 1024;
    u++;
  }
  return `${n >= 10 || u === 0 ? Math.round(n) : n.toFixed(1)} ${units[u]}`;
}

/** A mention chip as the editor stores it, to put a mention into a block's html yourself. */
export function blockEditorMentionHtml(m: BlockEditorMention): string {
  return `<span class="${C.mention}" contenteditable="false" data-trigger="${escapeHtml(m.trigger)}" data-id="${escapeHtml(m.id)}" data-label="${escapeHtml(m.label)}"><span class="${C.mentionTrigger}">${escapeHtml(m.trigger)}</span>${escapeHtml(m.label)}</span>`;
}

const INLINE_TAGS = new Set(["strong", "em", "u", "s", "code"]);
/** The elements that count as each mark (what the browser or a paste may have written for it). */
const MARKS: Record<string, string[]> = { strong: ["STRONG", "B"], em: ["EM", "I"], u: ["U"], s: ["S", "STRIKE", "DEL"], code: ["CODE"] };
const attr = (attrs: string, name: string) => {
  const m = attrs.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? unescapeHtml(m[2] ?? m[3] ?? m[4] ?? "") : null;
};

/**
 * Keep only the inline HTML the editor makes (strong, em, u, s, code, a with a safe href, mention chips) and drop every
 * other tag and attribute. String based, so it runs without a DOM (on a server, in a worker).
 */
export function blockEditorCleanHtml(html: string): string {
  const source = html.replace(/<(script|style|template|iframe|object|embed|svg|math)\b[\s\S]*?<\/\1\s*>/gi, "").replace(/<!--[\s\S]*?-->/g, "");
  let out = "";
  let at = 0;
  const open: string[] = [];
  let skipChip = 0;
  for (const m of source.matchAll(/<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g)) {
    const text = source.slice(at, m.index);
    at = (m.index ?? 0) + m[0].length;
    if (!skipChip) out += text.replace(/</g, "&lt;").replace(/​/g, "");
    const closing = m[1] === "/";
    const tag = m[2].toLowerCase();
    const attrs = m[3] ?? "";
    if (skipChip) {
      if (tag === "span") skipChip += closing ? -1 : /\/\s*$/.test(attrs) ? 0 : 1;
      continue;
    }
    if (!closing && tag === "span" && (attr(attrs, "class") ?? "").split(/\s+/).includes(C.mention)) {
      const trigger = attr(attrs, "data-trigger") ?? "@";
      const id = attr(attrs, "data-id") ?? "";
      const label = attr(attrs, "data-label") ?? "";
      if (label) out += blockEditorMentionHtml({ trigger, id, label });
      skipChip = 1;
      continue;
    }
    const name = tag === "b" ? "strong" : tag === "i" ? "em" : tag === "strike" || tag === "del" ? "s" : tag;
    if (tag === "br") out += "\n";
    else if (INLINE_TAGS.has(name)) {
      if (closing) {
        const i = open.lastIndexOf(name);
        if (i >= 0) {
          for (let j = open.length - 1; j >= i; j--) out += `</${open[j]}>`;
          open.splice(i);
        }
      } else {
        open.push(name);
        out += `<${name}>`;
      }
    } else if (tag === "a") {
      if (closing) {
        const i = open.lastIndexOf("a");
        if (i >= 0) {
          for (let j = open.length - 1; j >= i; j--) out += `</${open[j]}>`;
          open.splice(i);
        }
      } else {
        const href = safeUrl(attr(attrs, "href"));
        if (href) {
          open.push("a");
          out += `<a href="${escapeHtml(href)}">`;
        }
      }
    }
  }
  if (!skipChip) out += source.slice(at).replace(/</g, "&lt;").replace(/​/g, "");
  for (let j = open.length - 1; j >= 0; j--) out += `</${open[j]}>`;
  return out;
}

/** Plain text of one block's inline HTML. */
function inlineText(html: string): string {
  return unescapeHtml(html.replace(/<[^>]*>/g, ""));
}

/** A value with every block well formed: ids, known types, indents in range, clean HTML, at least one block. */
export function blockEditorNormalize(value: readonly Partial<BlockEditorBlock>[] | null | undefined): BlockEditorBlock[] {
  const seen = new Set<string>();
  const out: BlockEditorBlock[] = [];
  for (const raw of value ?? []) {
    if (!raw || typeof raw !== "object") continue;
    const type = (blockEditorBlockTypes as readonly string[]).includes(raw.type ?? "") ? (raw.type as BlockEditorBlockType) : "text";
    let id = typeof raw.id === "string" && raw.id ? raw.id : blockEditorId();
    if (seen.has(id)) id = blockEditorId();
    seen.add(id);
    const b: BlockEditorBlock = { id, type };
    if (isText(type)) b.html = type === "code" ? escapeHtml(inlineText(raw.html ?? "")) : blockEditorCleanHtml(raw.html ?? "");
    if (INDENTABLE.includes(type) && raw.indent) b.indent = Math.max(0, Math.min(MAX_INDENT, Math.round(raw.indent)));
    if (type === "todo") b.checked = !!raw.checked;
    if (type === "toggle" && raw.open) b.open = true;
    if (type === "table") {
      b.rows = tableGrid(raw.rows);
      b.header = raw.header !== false;
      if (raw.headerColumn) b.headerColumn = true;
      const columns = b.rows[0].length;
      const widths = Array.from({ length: columns }, (_, c) => {
        const w = Number(raw.widths?.[c]);
        return w > 0 ? Math.max(MIN_COLUMN, Math.min(MAX_COLUMN, Math.round(w))) : 0;
      });
      if (widths.some(Boolean)) b.widths = widths;
      const align = Array.from({ length: columns }, (_, c) => (TABLE_ALIGNS.includes(raw.align?.[c] as BlockEditorTableAlign) ? (raw.align![c] as BlockEditorTableAlign) : "start"));
      if (align.some((a) => a !== "start")) b.align = align;
    }
    if (type === "code" && raw.language && codeLanguage(raw.language)) b.language = codeLanguage(raw.language);
    if (TYPES[type].media) {
      b.src = safeUrl(raw.src, type === "file" ? "href" : "src") || (type === "file" ? safeUrl(raw.src, "src") : "");
      if (type !== "file" && raw.caption) b.caption = String(raw.caption);
      if (type === "image" && raw.width && raw.width < 100) b.width = Math.max(20, Math.min(100, Math.round(raw.width)));
      if (type === "file") {
        if (raw.name) b.name = String(raw.name);
        if (raw.size) b.size = Number(raw.size) || undefined;
      }
    }
    out.push(b);
  }
  return out.length ? out : [blockEditorBlock()];
}

// ---- Markdown, HTML and plain text (no DOM needed) ----

const MD_SPECIAL = /([\\`*_~[\]])/g;

function inlineToMarkdown(html: string): string {
  let out = "";
  let at = 0;
  const links: string[] = [];
  const clean = blockEditorCleanHtml(html);
  for (const m of clean.matchAll(/<(\/?)(strong|em|u|s|code|a|span)((?:[^>"']|"[^"]*"|'[^']*')*)>/g)) {
    out += unescapeHtml(clean.slice(at, m.index)).replace(MD_SPECIAL, "\\$1");
    at = (m.index ?? 0) + m[0].length;
    const [, closing, tag, attrs] = m;
    if (tag === "strong") out += "**";
    else if (tag === "em") out += "*";
    else if (tag === "s") out += "~~";
    else if (tag === "code") out += "`";
    else if (tag === "a") {
      if (closing) out += `](${links.pop() ?? ""})`;
      else {
        links.push(attr(attrs, "href") ?? "");
        out += "[";
      }
    }
  }
  return out + unescapeHtml(clean.slice(at)).replace(MD_SPECIAL, "\\$1");
}

/** Inline Markdown (**bold**, *italic*, ~~strike~~, `code`, [link](url)) to the editor's inline HTML. */
function markdownInline(text: string): string {
  const codes: string[] = [];
  let s = escapeHtml(text).replace(/`([^`]+)`/g, (_, c: string) => {
    codes.push(`<code>${c}</code>`);
    return `\u0000${codes.length - 1}\u0000`;
  });
  s = s.replace(/\\([\\`*_~[\]])/g, (_, c: string) => `\u0001${c.charCodeAt(0)}\u0001`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (whole, label: string, href: string) => {
    const safe = safeUrl(unescapeHtml(href));
    return safe ? `<a href="${escapeHtml(safe)}">${label}</a>` : whole;
  });
  s = s.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>").replace(/__([^_]+?)__/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\*)/g, "$1<em>$2</em>").replace(/(^|[^_\w])_([^_\s][^_]*?)_(?!\w)/g, "$1<em>$2</em>");
  s = s.replace(/~~([^~]+?)~~/g, "<s>$1</s>");
  s = s.replace(/\u0001(\d+)\u0001/g, (_, n: string) => escapeHtml(String.fromCharCode(Number(n))));
  return s.replace(/\u0000(\d+)\u0000/g, (_, n: string) => codes[Number(n)]);
}

/** The separator line under a Markdown table's header: | --- | :---: |. */
const TABLE_RULE = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;
/** The cells of one Markdown table row, with \| unescaped. */
function markdownCells(line: string): string[] {
  const cells: string[] = [];
  let cell = "";
  for (let k = 0; k < line.length; k++) {
    if (line[k] === "\\" && line[k + 1] === "|") {
      cell += "|";
      k++;
    } else if (line[k] === "|") {
      cells.push(cell);
      cell = "";
    } else cell += line[k];
  }
  cells.push(cell);
  if (!cells[0].trim()) cells.shift();
  if (cells.length && !cells[cells.length - 1].trim() && /\|\s*$/.test(line)) cells.pop();
  return cells.map((c) => c.trim());
}

/** Parse Markdown into blocks: headings, lists (indented by two spaces or a tab), to-dos, toggles (<details>), quotes, code fences, tables, rules, images and paragraphs. Blank lines are dropped. */
export function blockEditorFromMarkdown(markdown: string): BlockEditorBlock[] {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const out: BlockEditorBlock[] = [];
  /** The <details> being read: what the blocks inside it add to their indent. */
  let nest = 0;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    let d: RegExpMatchArray | null;
    if ((d = raw.match(/^\s*<details(\s+open)?>\s*<summary>(.*)<\/summary>\s*$/i))) {
      out.push(blockEditorBlock("toggle", { html: d[2].trim(), ...(nest ? { indent: Math.min(MAX_INDENT, nest) } : {}), ...(d[1] ? {} : { open: false }) }));
      nest++;
      continue;
    }
    if (/^\s*<\/details>\s*$/i.test(raw)) {
      nest = Math.max(0, nest - 1);
      continue;
    }
    if (/^\s*```/.test(raw)) {
      const language = codeLanguage(raw.replace(/^\s*```/, "").trim());
      const body: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) body.push(lines[i++]);
      out.push(blockEditorBlock("code", { html: escapeHtml(body.join("\n")), ...(language ? { language } : {}) }));
      continue;
    }
    if (!raw.trim()) continue;
    if (/^\s*\|/.test(raw) && TABLE_RULE.test(lines[i + 1] ?? "")) {
      const grid = [markdownCells(raw)];
      const align = markdownCells(lines[i + 1]).map((c): BlockEditorTableAlign => (c.startsWith(":") && c.endsWith(":") ? "center" : c.endsWith(":") ? "end" : "start"));
      i += 2;
      while (i < lines.length && /^\s*\|/.test(lines[i])) grid.push(markdownCells(lines[i++]));
      i--;
      // A blank first row is the placeholder a table without a header is written with.
      const blank = grid[0].every((cell) => !cell);
      out.push(blockEditorBlock("table", { rows: tableGrid(blank && grid.length > 1 ? grid.slice(1) : grid), header: !blank || grid.length === 1, ...(align.some((a) => a !== "start") ? { align } : {}) }));
      continue;
    }
    const lead = raw.match(/^[ \t]*/)?.[0] ?? "";
    const indent = Math.min(MAX_INDENT, Math.floor(lead.replace(/\t/g, "  ").length / 2) + nest);
    const line = raw.slice(lead.length);
    let m: RegExpMatchArray | null;
    const nested = indent ? { indent } : {};
    if ((m = line.match(/^(#{1,6})\s+(.*)$/))) out.push(blockEditorBlock(`heading-${Math.min(3, m[1].length)}` as BlockEditorBlockType, { html: markdownInline(m[2]) }));
    else if ((m = line.match(/^[-*+]\s+\[( |x|X)\]\s+(.*)$/))) out.push(blockEditorBlock("todo", { html: markdownInline(m[2]), checked: m[1] !== " ", ...nested }));
    else if ((m = line.match(/^[-*+]\s+(.*)$/))) out.push(blockEditorBlock("bullet", { html: markdownInline(m[1]), ...nested }));
    else if ((m = line.match(/^\d+[.)]\s+(.*)$/))) out.push(blockEditorBlock("number", { html: markdownInline(m[1]), ...nested }));
    else if ((m = line.match(/^>\s?(.*)$/))) out.push(blockEditorBlock("quote", { html: markdownInline(m[1]) }));
    else if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) out.push(blockEditorBlock("divider"));
    else if ((m = line.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/))) {
      const src = safeUrl(m[2], "src");
      if (src) out.push(blockEditorBlock("image", { src, ...(m[1] ? { caption: m[1] } : {}) }));
    } else out.push(blockEditorBlock("text", { html: markdownInline(line), ...nested }));
  }
  return out;
}

/** The blocks as Markdown (mentions become plain text, underline is dropped, a callout is a quote). */
export function blockEditorToMarkdown(value: readonly BlockEditorBlock[]): string {
  const out: string[] = [];
  const numbers: number[] = [];
  /** Depths of the toggles still open as <details>: what's inside one is indented relative to it. */
  const toggles: number[] = [];
  for (const b of value) {
    const depth = b.indent ?? 0;
    while (toggles.length && toggles[toggles.length - 1] >= depth) {
      toggles.pop();
      out.push("</details>");
    }
    const level = depth - toggles.length;
    numbers.length = Math.min(numbers.length, level + 1);
    if (b.type === "number") numbers[level] = (numbers[level] ?? 0) + 1;
    else numbers[level] = 0;
    const pad = isList(b.type) ? "  ".repeat(level) : "";
    const text = isText(b.type) && b.type !== "code" ? inlineToMarkdown(b.html ?? "").replace(/\n/g, "  \n") : "";
    switch (b.type) {
      case "heading-1":
      case "heading-2":
      case "heading-3":
        out.push(`${"#".repeat(Number(b.type.slice(-1)))} ${text}`);
        break;
      case "bullet":
        out.push(`${pad}- ${text}`);
        break;
      case "number":
        out.push(`${pad}${numbers[level]}. ${text}`);
        break;
      case "todo":
        out.push(`${pad}- [${b.checked ? "x" : " "}] ${text}`);
        break;
      case "table": {
        const rows = tableGrid(b.rows);
        const line = (row: string[]) => `| ${row.map((cell) => cell.replace(/\|/g, "\\|")).join(" | ")} |`;
        const [first, ...rest] = b.header === false ? [rows[0].map(() => ""), ...rows] : rows;
        const rule = first.map((_, c) => (b.align?.[c] === "center" ? ":---:" : b.align?.[c] === "end" ? "---:" : "---"));
        out.push(line(first), `| ${rule.join(" | ")} |`, ...rest.map(line));
        break;
      }
      case "toggle":
        out.push(`<details${b.open ? " open" : ""}><summary>${escapeText(inlineText(b.html ?? "")).replace(/\n/g, " ")}</summary>`);
        toggles.push(depth);
        break;
      case "quote":
      case "callout":
        out.push(`> ${text}`);
        break;
      case "code":
        out.push(`\`\`\`${b.language ?? ""}`, inlineText(b.html ?? ""), "```");
        break;
      case "divider":
        out.push("---");
        break;
      case "image":
        if (b.src) out.push(`![${(b.caption ?? "").replace(/[[\]]/g, "")}](${b.src})`);
        break;
      case "embed":
      case "file":
        if (b.src) out.push(`[${(b.type === "file" ? b.name : b.caption) || b.src}](${b.src})`);
        break;
      default:
        out.push(text);
    }
  }
  for (const _ of toggles) out.push("</details>");
  return out.join("\n");
}

/** The blocks as plain text, one line per block: for search, previews and the clipboard. */
export function blockEditorToText(value: readonly BlockEditorBlock[]): string {
  return value
    .map((b) => (isText(b.type) ? inlineText(b.html ?? "") : b.type === "table" ? tableGrid(b.rows).map((row) => row.join("\t")).join("\n") : b.type === "file" ? (b.name ?? b.src ?? "") : b.type === "divider" ? "" : (b.caption ?? b.src ?? "")))
    .filter((line, i, all) => line || (i > 0 && all[i - 1]))
    .join("\n")
    .trim();
}

/** The blocks as semantic HTML (p, h1–h3, nested ul/ol, blockquote, aside, pre, hr, figure, iframe, a) to show outside the editor or send in an email. */
export function blockEditorToHtml(value: readonly BlockEditorBlock[]): string {
  const out: string[] = [];
  /** Depths of the toggles whose <details> is still open. */
  const toggles: number[] = [];
  const stack: { tag: "ul" | "ol"; depth: number }[] = [];
  const closeTo = (depth: number, tag?: "ul" | "ol") => {
    while (stack.length && (stack[stack.length - 1].depth > depth || (stack[stack.length - 1].depth === depth && stack[stack.length - 1].tag !== tag))) {
      out.push(`</${stack.pop()!.tag}>`);
    }
  };
  for (const b of value) {
    const html = isText(b.type) && b.type !== "code" ? blockEditorCleanHtml(b.html ?? "").replace(/\n/g, "<br>") : "";
    while (toggles.length && toggles[toggles.length - 1] >= (b.indent ?? 0)) {
      closeTo(-1);
      toggles.pop();
      out.push("</details>");
    }
    if (isList(b.type)) {
      const depth = b.indent ?? 0;
      const tag = b.type === "number" ? "ol" : "ul";
      closeTo(depth, tag);
      if (!stack.length || stack[stack.length - 1].depth < depth) {
        stack.push({ tag, depth });
        out.push(`<${tag}>`);
      }
      const box = b.type === "todo" ? `<input type="checkbox" disabled${b.checked ? " checked" : ""}> ` : "";
      out.push(`<li>${box}${html}</li>`);
      continue;
    }
    closeTo(-1);
    switch (b.type) {
      case "toggle":
        out.push(`<details${b.open ? " open" : ""}><summary>${html}</summary>`);
        toggles.push(b.indent ?? 0);
        break;
      case "heading-1":
      case "heading-2":
      case "heading-3":
        out.push(`<h${b.type.slice(-1)}>${html}</h${b.type.slice(-1)}>`);
        break;
      case "quote":
        out.push(`<blockquote>${html}</blockquote>`);
        break;
      case "callout":
        out.push(`<aside>${html}</aside>`);
        break;
      case "code":
        out.push(`<pre><code${b.language ? ` class="language-${escapeHtml(b.language)}"` : ""}>${escapeHtml(inlineText(b.html ?? ""))}</code></pre>`);
        break;
      case "divider":
        out.push("<hr>");
        break;
      case "table": {
        const rows = tableGrid(b.rows);
        const cell = (text: string, c: number, tag: "td" | "th", scope = "") => {
          const a = b.align?.[c];
          return `<${tag}${scope ? ` scope="${scope}"` : ""}${a && a !== "start" ? ` style="text-align:${a}"` : ""}>${escapeHtml(text)}</${tag}>`;
        };
        const row = (cells: string[], head: boolean) => `<tr>${cells.map((text, c) => (head ? cell(text, c, "th", "col") : b.headerColumn && c === 0 ? cell(text, c, "th", "row") : cell(text, c, "td"))).join("")}</tr>`;
        const widths = b.widths?.some(Boolean) ? `<colgroup>${rows[0].map((_, c) => (b.widths![c] ? `<col style="width:${b.widths![c]}px">` : "<col>")).join("")}</colgroup>` : "";
        const head = b.header !== false ? `<thead>${row(rows[0], true)}</thead>` : "";
        out.push(`<table>${widths}${head}<tbody>${(b.header !== false ? rows.slice(1) : rows).map((cells) => row(cells, false)).join("")}</tbody></table>`);
        break;
      }
      case "image":
        if (b.src) {
          const caption = b.caption ? `<figcaption>${escapeHtml(b.caption)}</figcaption>` : "";
          out.push(`<figure><img src="${escapeHtml(b.src)}" alt="${escapeHtml(b.caption ?? "")}">${caption}</figure>`);
        }
        break;
      case "embed": {
        const embed = b.src ? blockEditorEmbed(b.src) : null;
        if (!embed) break;
        const caption = b.caption ? `<figcaption>${escapeHtml(b.caption)}</figcaption>` : "";
        if (embed.kind === "iframe") out.push(`<figure><iframe src="${escapeHtml(embed.src)}" title="${escapeHtml(b.caption || embed.provider)}" loading="lazy" allowfullscreen></iframe>${caption}</figure>`);
        else if (embed.kind === "video" || embed.kind === "audio") out.push(`<figure><${embed.kind} src="${escapeHtml(embed.src)}" controls></${embed.kind}>${caption}</figure>`);
        else out.push(`<p><a href="${escapeHtml(embed.src)}">${escapeHtml(b.caption || embed.src)}</a></p>`);
        break;
      }
      case "file":
        if (b.src) out.push(`<p><a href="${escapeHtml(b.src)}" download="${escapeHtml(b.name ?? "")}">${escapeHtml(b.name || b.src)}</a></p>`);
        break;
      default:
        out.push(`<p>${html}</p>`);
    }
  }
  closeTo(-1);
  for (const _ of toggles) out.push("</details>");
  return out.join("\n");
}

// ---- DOM helpers ----

const ZW_RE = /​/g;
const textOf = (node: Node) => (node.textContent ?? "").replace(ZW_RE, "");
/** A code line's text, with the line breaks a browser may have written as <div> or <br> kept as "\n". */
const codeText = (el: Node) => inlineText(cleanDom(el));
const isElement = (node: Node | null | undefined): node is HTMLElement => !!node && node.nodeType === 1;
const SKIP_TAGS = new Set(["script", "style", "template", "iframe", "object", "embed", "svg", "math", "head", "meta", "link", "title", "input", "button", "select", "textarea"]);
const BLOCK_TAGS = new Set(["p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "blockquote", "pre", "hr", "img", "figure", "table", "tr", "section", "article", "header", "footer", "main", "aside", "nav", "dl", "dt", "dd"]);
const BLOCK_SELECTOR = [...BLOCK_TAGS].join(",");
const escapeText = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** An element's inline content as the editor's stored HTML: marks, safe links and mention chips; pasted styles (Google Docs' bold spans) become marks. */
function cleanDom(node: Node): string {
  let out = "";
  const children = Array.from(node.childNodes);
  children.forEach((child, i) => {
    if (child.nodeType === 3) {
      out += escapeText((child as Text).data.replace(ZW_RE, ""));
      return;
    }
    if (!isElement(child)) return;
    const tag = child.tagName.toLowerCase();
    if (child.classList.contains(C.mention)) {
      const d = child.dataset;
      if (d.label) out += blockEditorMentionHtml({ trigger: d.trigger ?? "@", id: d.id ?? "", label: d.label });
      return;
    }
    if (tag === "br") {
      if (!child.hasAttribute("data-tail")) out += "\n";
      return;
    }
    if (SKIP_TAGS.has(tag)) return;
    const style = child.style;
    let open = "";
    let close = "";
    const wrap = (name: string) => {
      open += `<${name}>`;
      close = `</${name}>${close}`;
    };
    let name = tag === "b" ? "strong" : tag === "i" ? "em" : tag === "strike" || tag === "del" ? "s" : tag;
    if (name === "strong" && /^(normal|[1-4]00)$/.test(style?.fontWeight ?? "")) name = "";
    if (INLINE_TAGS.has(name)) wrap(name);
    else if (name === "a") {
      const href = safeUrl(child.getAttribute("href"));
      if (href) {
        open += `<a href="${escapeHtml(href)}">`;
        close = `</a>${close}`;
      }
    } else if (style) {
      if (/^(bold|bolder|[6-9]00)$/.test(style.fontWeight)) wrap("strong");
      if (style.fontStyle === "italic") wrap("em");
      const deco = `${style.textDecorationLine} ${style.textDecoration}`;
      if (/underline/.test(deco)) wrap("u");
      if (/line-through/.test(deco)) wrap("s");
    }
    const inner = cleanDom(child);
    if (BLOCK_TAGS.has(tag) && inner && out && !out.endsWith("\n")) out += "\n";
    if (inner) out += open + inner + close;
    // Lines the browser wrapped in their own <div> or <p> stay lines.
    if (BLOCK_TAGS.has(tag) && i < children.length - 1 && inner && !out.endsWith("\n")) out += "\n";
  });
  return out;
}

function fragment(html: string): HTMLElement {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div;
}

function indexIn(node: Node): number {
  return Array.prototype.indexOf.call(node.parentNode?.childNodes ?? [], node);
}

function beside(node: Node, after: boolean): [Node, number] {
  const neighbour = after ? node.nextSibling : node.previousSibling;
  if (neighbour && neighbour.nodeType === 3) return [neighbour, after ? 0 : (neighbour as Text).length];
  return [node.parentNode as Node, indexIn(node) + (after ? 1 : 0)];
}

/** A character offset inside `el` as a DOM point, never inside a mention chip and past any zero-width space. */
function pointAt(el: Node, offset: number): [Node, number] {
  let left = Math.max(0, offset);
  const walker = (el.ownerDocument ?? document).createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let lastChip: Element | null = null;
  for (let n = walker.nextNode() as Text | null; n; n = walker.nextNode() as Text | null) {
    const chip = n.parentElement?.closest(`.${C.mention}`) ?? null;
    if (chip && chip !== el && el.contains(chip)) {
      if (chip === lastChip) continue;
      lastChip = chip;
      const length = textOf(chip).length;
      if (left < length) return beside(chip, left > 0);
      left -= length;
      continue;
    }
    const data = n.data;
    let count = 0;
    for (let i = 0; i <= data.length; i++) {
      if (count === left) {
        let j = i;
        while (j < data.length && data[j] === ZW) j++;
        return [n, j];
      }
      if (i < data.length && data[i] !== ZW) count++;
    }
    left -= count;
  }
  const tail = isElement(el) ? el.querySelector(":scope > br[data-tail]") : null;
  return tail ? [el, indexIn(tail)] : [el, el.childNodes.length];
}

/** The character offset of a DOM point inside `el`. */
function offsetIn(el: Node, node: Node, offset: number): number {
  const range = document.createRange();
  range.selectNodeContents(el);
  try {
    range.setEnd(node, offset);
  } catch {
    return textOf(el).length;
  }
  return range.toString().replace(ZW_RE, "").length;
}

function selectionIn(el: HTMLElement): { start: number; end: number } | null {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount || !sel.anchorNode || !sel.focusNode || !el.contains(sel.anchorNode) || !el.contains(sel.focusNode)) return null;
  const range = sel.getRangeAt(0);
  return { start: offsetIn(el, range.startContainer, range.startOffset), end: offsetIn(el, range.endContainer, range.endOffset) };
}

function selectText(el: HTMLElement, start: number, end = start): void {
  if (document.activeElement !== el) el.focus({ preventScroll: true });
  const sel = window.getSelection();
  if (!sel) return;
  const [sn, so] = pointAt(el, start);
  const [en, eo] = end === start ? [sn, so] : pointAt(el, end);
  sel.setBaseAndExtent(sn, so, en, eo);
  const rect = caretRect();
  const box = el.getBoundingClientRect();
  if (rect && (rect.top < 0 || rect.bottom > window.innerHeight)) el.scrollIntoView({ block: "nearest" });
  else if (!rect && (box.top < 0 || box.bottom > window.innerHeight)) el.scrollIntoView({ block: "nearest" });
}

/** The stored HTML between two character offsets of `html`. */
function sliceHtml(html: string, from: number, to = Number.POSITIVE_INFINITY): string {
  const div = fragment(html);
  const length = textOf(div).length;
  const start = Math.max(0, Math.min(from, length));
  const end = Math.max(start, Math.min(to, length));
  if (start === 0 && end === length) return cleanDom(div);
  if (start === end) return "";
  const range = document.createRange();
  const [sn, so] = pointAt(div, start);
  const [en, eo] = end >= length ? [div, div.childNodes.length] : pointAt(div, end);
  range.setStart(sn, so);
  range.setEnd(en, eo);
  const out = document.createElement("div");
  out.append(range.cloneContents());
  return cleanDom(out);
}

const htmlLength = (html: string) => textOf(fragment(html)).length;

function caretRect(): DOMRect | null {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return null;
  const range = sel.getRangeAt(0).cloneRange();
  range.collapse(false);
  const rects = range.getClientRects();
  if (rects.length) return rects[rects.length - 1];
  const node = range.startContainer;
  const host = isElement(node) ? node : node.parentElement;
  return host ? host.getBoundingClientRect() : null;
}

function lineHeight(el: HTMLElement): number {
  const style = getComputedStyle(el);
  const lh = parseFloat(style.lineHeight);
  return Number.isFinite(lh) ? lh : parseFloat(style.fontSize) * 1.5 || 20;
}

/** Is the caret on the first visual line of `el` (wrapped lines count)? */
function onFirstLine(el: HTMLElement): boolean {
  const rect = caretRect();
  const at = selectionIn(el);
  if (!rect || (rect.top === 0 && rect.bottom === 0)) return !at || at.start === 0;
  return rect.top - el.getBoundingClientRect().top < lineHeight(el) * 0.8;
}

function onLastLine(el: HTMLElement): boolean {
  const rect = caretRect();
  const at = selectionIn(el);
  if (!rect || (rect.top === 0 && rect.bottom === 0)) return !at || at.end === textOf(el).length;
  return el.getBoundingClientRect().bottom - rect.bottom < lineHeight(el) * 0.8;
}

/** The text position under a point. */
function caretAt(x: number, y: number): [Node, number] | null {
  const doc = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };
  if (doc.caretPositionFromPoint) {
    const p = doc.caretPositionFromPoint(x, y);
    return p ? [p.offsetNode, p.offset] : null;
  }
  const r = doc.caretRangeFromPoint?.(x, y);
  return r ? [r.startContainer, r.startOffset] : null;
}

/** Keep an editable line well formed: empty means no nodes (so :empty shows the placeholder); a trailing newline or chip gets a <br data-tail> so the caret can sit after it. */
function tidy(el: HTMLElement): void {
  for (const br of Array.from(el.querySelectorAll("br:not([data-tail])"))) {
    if (!br.nextSibling && br.parentNode === el) br.remove();
    else br.replaceWith(document.createTextNode("\n"));
  }
  const text = textOf(el);
  if (!text && !el.querySelector(`.${C.mention}`)) {
    if (el.childNodes.length && !el.textContent?.includes(ZW)) el.replaceChildren();
    return;
  }
  let last: Node | null = el.lastChild;
  while (last && ((isElement(last) && last.hasAttribute("data-tail")) || (last.nodeType === 3 && !(last as Text).data))) last = last.previousSibling;
  const chipLast = isElement(last) && last.classList.contains(C.mention);
  const needTail = text.endsWith("\n") || chipLast;
  const tails = Array.from(el.querySelectorAll(":scope > br[data-tail]"));
  if (needTail) {
    const tail = tails.shift() ?? document.createElement("br");
    tail.setAttribute("data-tail", "");
    if (el.lastChild !== tail) el.append(tail);
  }
  for (const extra of needTail ? tails : Array.from(el.querySelectorAll(":scope > br[data-tail]"))) extra.remove();
}

/** Drop zero-width spaces once real text sits next to them, keeping the caret where it was. */
function dropZw(el: HTMLElement): void {
  if (!el.textContent?.includes(ZW)) return;
  const sel = window.getSelection();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  for (let n = walker.nextNode() as Text | null; n; n = walker.nextNode() as Text | null) if (n.data.includes(ZW)) nodes.push(n);
  for (const n of nodes) {
    const holdsCaret = sel?.anchorNode === n;
    if (n.data === ZW && holdsCaret) continue;
    const caret = holdsCaret ? sel!.anchorOffset : -1;
    const before = caret >= 0 ? n.data.slice(0, caret).replace(ZW_RE, "").length : 0;
    n.data = n.data.replace(ZW_RE, "");
    if (holdsCaret) sel!.collapse(n, Math.min(before, n.length));
    if (!n.data && !holdsCaret) n.remove();
  }
}

function svg(icon: IconData): string {
  return iconSvg(icon);
}

function make<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, attrs: Record<string, string> = {}): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

function tooltipped(button: HTMLElement, label: string, shortcut?: string, side = "top"): HTMLElement {
  const host = make("span", "ayy-tooltip");
  const tip = make("span", "ayy-tooltip__content", { role: "tooltip", "data-side": side });
  tip.innerHTML = escapeText(label) + (shortcut ? ` ${shortcutHtml(shortcut)}` : "");
  host.append(button, tip);
  return host;
}

function numberLabel(n: number, depth: number): string {
  const level = depth % 3;
  if (level === 0) return `${n}.`;
  if (level === 1) {
    let s = "";
    for (let k = n; k > 0; k = Math.floor((k - 1) / 26)) s = String.fromCharCode(97 + ((k - 1) % 26)) + s;
    return `${s}.`;
  }
  const romans: [number, string][] = [[1000, "m"], [900, "cm"], [500, "d"], [400, "cd"], [100, "c"], [90, "xc"], [50, "l"], [40, "xl"], [10, "x"], [9, "ix"], [5, "v"], [4, "iv"], [1, "i"]];
  let s = "";
  let k = n;
  for (const [v, r] of romans) {
    while (k >= v) {
      s += r;
      k -= v;
    }
  }
  return `${s}.`;
}

const BULLETS = ["•", "◦", "▪"];

/** A line's direction from its first strong character (Hebrew, Arabic… → rtl; any other letter → ltr), or null with none. */
function directionOf(text: string): "rtl" | "ltr" | null {
  const m = text.match(/[\p{L}]/u);
  if (!m) return null;
  return /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/.test(m[0]) ? "rtl" : "ltr";
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Blocks written in the page's markup: full ones the editor rendered, or short ones like <div class="ayy-block-editor__block" data-type="heading-1">Title</div>. A <script type="application/json"> child holding a value wins. */
/** A table block written as markup: a <table> in the block, with a header when its first row is <th> or in a <thead>, a header column of <th scope="row">, <col> widths and cells' text-align. */
function tableMarkup(el: HTMLElement): Partial<BlockEditorBlock> {
  const table = el.querySelector("table");
  const trs = Array.from(table?.querySelectorAll("tr") ?? []);
  const rows = trs.map((tr) => Array.from(tr.children).map((cell) => cell.textContent ?? ""));
  const align = Array.from(trs[0]?.children ?? []).map((cell) => {
    const a = (cell as HTMLElement).style?.textAlign || (cell as HTMLElement).dataset?.align || "";
    return a === "center" ? "center" : a === "end" || a === "right" ? "end" : "start";
  });
  return {
    rows,
    header: !!table?.querySelector("thead, tr:first-child th"),
    headerColumn: !!table?.querySelector('tbody th[scope="row"], tr:not(:first-child) > th:first-child'),
    widths: Array.from(table?.querySelectorAll("col") ?? []).map((col) => parseFloat((col as HTMLElement).style.inlineSize || (col as HTMLElement).style.width) || 0),
    align: align as BlockEditorTableAlign[],
  };
}

function readMarkup(root: HTMLElement): BlockEditorBlock[] {
  const json = root.querySelector<HTMLScriptElement>(':scope > script[type="application/json"]:not([data-mentions])');
  if (json) {
    try {
      return blockEditorNormalize(JSON.parse(json.textContent ?? "[]"));
    } catch {
      // Fall through to the markup.
    }
  }
  const out: Partial<BlockEditorBlock>[] = [];
  for (const el of Array.from(root.querySelectorAll<HTMLElement>(`:scope > .${C.block}`))) {
    const d = el.dataset;
    const type = (d.type ?? "text") as BlockEditorBlockType;
    const text = el.querySelector<HTMLElement>(`.${C.text}`) ?? el;
    const img = el.querySelector("img");
    out.push({
      id: d.id,
      type,
      html: type === "code" ? escapeHtml(textOf(text)) : cleanDom(text),
      indent: d.indent ? Number(d.indent) : undefined,
      checked: d.checked !== undefined || !!el.querySelector<HTMLInputElement>(`.${C.check}`)?.checked,
      open: d.open !== undefined && d.open !== "false",
      ...(type === "table" ? tableMarkup(el) : {}),
      src: d.src ?? img?.getAttribute("src") ?? undefined,
      caption: d.caption ?? el.querySelector(`.${C.caption}`)?.textContent ?? undefined,
      width: d.width ? Number(d.width) : undefined,
      language: d.language,
      name: d.name,
      size: d.size ? Number(d.size) : undefined,
    });
  }
  return blockEditorNormalize(out);
}

/** Pasted HTML (another editor, a web page, Google Docs) as blocks. */
function htmlToBlocks(html: string): BlockEditorBlock[] {
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  const out: BlockEditorBlock[] = [];
  let inline: Node[] = [];
  /** How many <details> deep the walk is: what the blocks inside add to their indent. */
  let nest = 0;
  const flush = () => {
    if (!inline.length) return;
    const holder = document.createElement("div");
    holder.append(...inline.map((n) => n.cloneNode(true)));
    inline = [];
    const clean = cleanDom(holder).replace(/^\s+|\s+$/g, "");
    if (clean) out.push(blockEditorBlock("text", { html: clean, ...(nest ? { indent: Math.min(MAX_INDENT, nest) } : {}) }));
  };
  const walk = (parent: Node, list: { type: "bullet" | "number"; depth: number } | null) => {
    for (const node of Array.from(parent.childNodes)) {
      if (!isElement(node)) {
        if (node.nodeType === 3) inline.push(node);
        continue;
      }
      const tag = node.tagName.toLowerCase();
      if (SKIP_TAGS.has(tag)) continue;
      if (tag === "details") {
        flush();
        const summary = node.querySelector(":scope > summary");
        out.push(blockEditorBlock("toggle", { html: summary ? cleanDom(summary).trim() : "", open: node.hasAttribute("open"), ...(nest ? { indent: Math.min(MAX_INDENT, nest) } : {}) }));
        summary?.remove();
        nest++;
        walk(node, null);
        flush();
        nest--;
        continue;
      }
      if (!BLOCK_TAGS.has(tag) && !node.querySelector(BLOCK_SELECTOR)) {
        inline.push(node);
        continue;
      }
      flush();
      const nested = list || nest ? { indent: Math.min(MAX_INDENT, (list?.depth ?? 0) + nest) } : {};
      if (/^h[1-6]$/.test(tag)) out.push(blockEditorBlock(`heading-${Math.min(3, Number(tag[1]))}` as BlockEditorBlockType, { html: cleanDom(node).trim() }));
      else if (tag === "ul" || tag === "ol") walk(node, { type: tag === "ol" ? "number" : "bullet", depth: list ? list.depth + 1 : 0 });
      else if (tag === "li") {
        const own = document.createElement("div");
        const sublists: HTMLElement[] = [];
        for (const child of Array.from(node.childNodes)) {
          if (isElement(child) && (child.tagName === "UL" || child.tagName === "OL")) sublists.push(child);
          else own.append(child.cloneNode(true));
        }
        const box = own.querySelector<HTMLInputElement>('input[type="checkbox"]');
        const type = box ? "todo" : (list?.type ?? "bullet");
        out.push(blockEditorBlock(type, { html: cleanDom(own).trim(), ...nested, ...(box ? { checked: box.checked || box.hasAttribute("checked") } : {}) }));
        for (const sub of sublists) walk(sub, { type: sub.tagName === "OL" ? "number" : "bullet", depth: (list?.depth ?? -1) + 1 });
      } else if (tag === "blockquote") out.push(blockEditorBlock("quote", { html: cleanDom(node).trim() }));
      else if (tag === "pre") {
        const hint = `${node.className} ${node.querySelector("code")?.className ?? ""} ${node.dataset.language ?? ""}`;
        const language = codeLanguage(hint.match(/(?:language|lang)-([\w+#-]+)/)?.[1] ?? node.dataset.language);
        out.push(blockEditorBlock("code", { html: escapeHtml(node.textContent ?? ""), ...(language ? { language } : {}) }));
      }
      else if (tag === "hr") out.push(blockEditorBlock("divider"));
      else if (tag === "table") {
        const rows = Array.from(node.querySelectorAll("tr")).map((tr) => Array.from(tr.children).map((cell) => cell.textContent ?? ""));
        if (rows.length) out.push(blockEditorBlock("table", { rows: tableGrid(rows), header: !!node.querySelector("thead, tr:first-child th") }));
      }
      else if (tag === "img" || tag === "figure") {
        const img = tag === "img" ? node : node.querySelector("img");
        const src = safeUrl(img?.getAttribute("src"), "src");
        if (src) out.push(blockEditorBlock("image", { src, ...(node.querySelector("figcaption")?.textContent || img?.getAttribute("alt") ? { caption: (node.querySelector("figcaption")?.textContent || img?.getAttribute("alt")) ?? "" } : {}) }));
      } else if (node.querySelector(BLOCK_SELECTOR)) walk(node, list);
      else {
        const clean = cleanDom(node).trim();
        if (clean) out.push(blockEditorBlock("text", { html: clean, ...nested }));
      }
    }
    flush();
  };
  walk(tpl.content, null);
  return out;
}

/** The text-like blocks of a selection, cut at its two points (for copying part of a document). */
function cutBlocks(all: readonly BlockEditorBlock[], start: Point, end: Point): BlockEditorBlock[] {
  return all.slice(start.index, end.index + 1).map((b, i, list) => {
    if (!isText(b.type)) return { ...b };
    const from = i === 0 ? start.offset : 0;
    const to = i === list.length - 1 ? end.offset : Number.POSITIVE_INFINITY;
    const html = b.type === "code" ? escapeHtml(inlineText(b.html ?? "").slice(from, to)) : sliceHtml(b.html ?? "", from, to);
    return { ...b, html };
  });
}

interface Point {
  index: number;
  offset: number;
}

type Focus = { id: string; start: number | "end"; end?: number; cell?: [number, number] } | { pick: [string, string] };

interface Snapshot {
  blocks: BlockEditorBlock[];
  focus: Focus | null;
}

interface MenuItem {
  key: string;
  label: string;
  hint?: string;
  icon?: string;
  meta?: string;
  group?: string;
  current?: boolean;
  destructive?: boolean;
  /** Not offered right now (a submenu leaves it out). */
  disabled?: boolean;
  /** Opens the submenu of that name instead of running (a ">" shows at its end); null goes back to the list above. */
  sub?: string | null;
  run(): void;
}

type MenuState =
  | { mode: "slash"; id: string; start: number; query: string; index: number }
  | { mode: "mention"; id: string; start: number; query: string; index: number; source: BlockEditorMentionSource; options: BlockEditorMentionOption[] }
  | { mode: "actions"; ids: string[]; index: number; anchor: HTMLElement; list: "actions" | "language"; sub?: string };

const BLOCKS_MIME = "application/x-ayy-blocks+json";

/** One Highlight per code token type, shared by every editor on the page (CSS ::highlight(ayy-code-keyword)…). */
const codeHighlights = new Map<string, Highlight>();
const CODE_TOKENS = ["keyword", "string", "comment", "function", "number", "operator", "tag", "attribute", "property", "punctuation", "boolean"];
function setUpHighlights(): boolean {
  if (typeof CSS === "undefined" || !("highlights" in CSS) || typeof Highlight !== "function") return false;
  for (const type of CODE_TOKENS) {
    const name = `ayy-code-${type}`;
    const highlight = CSS.highlights.get(name) ?? new Highlight();
    CSS.highlights.set(name, highlight);
    codeHighlights.set(type, highlight);
  }
  return true;
}

/** Remove the text between two points across blocks. The first block keeps its type and takes what follows the end. */
function deleteSpan(list: readonly BlockEditorBlock[], start: Point, end: Point): { next: BlockEditorBlock[]; caret: { id: string; start: number } } {
  const first = list[start.index];
  const last = list[end.index];
  const head = isText(first.type) ? sliceHtml(first.html ?? "", 0, start.offset) : "";
  const tail = isText(last.type) ? sliceHtml(last.html ?? "", end.offset) : "";
  let merged: BlockEditorBlock;
  if (isText(first.type)) merged = { ...first, html: first.type === "code" ? escapeHtml(inlineText(head) + inlineText(tail)) : head + tail };
  else if (isText(last.type)) merged = { ...last, html: tail };
  else merged = blockEditorBlock("text");
  const next = list.slice();
  next.splice(start.index, end.index - start.index + 1, merged);
  return { next, caret: { id: merged.id, start: isText(first.type) ? htmlLength(head) : 0 } };
}

/** Put `incoming` blocks over the text between `from` and `to` of block `i`: one text block merges into the line, more split it (Notion's paste). */
function insertInto(list: readonly BlockEditorBlock[], i: number, from: number, to: number, incoming: BlockEditorBlock[]): { next: BlockEditorBlock[]; caret: Focus } {
  const b = list[i];
  const next = list.slice();
  if (!incoming.length) return { next, caret: { id: b.id, start: from } };
  if (b.type === "code") {
    const text = inlineText(b.html ?? "");
    const pasted = incoming.map((x) => (isText(x.type) ? inlineText(x.html ?? "") : (x.src ?? ""))).join("\n");
    next[i] = { ...b, html: escapeHtml(text.slice(0, from) + pasted + text.slice(to)) };
    return { next, caret: { id: b.id, start: from + pasted.length } };
  }
  const html = b.html ?? "";
  const left = sliceHtml(html, 0, from);
  const right = sliceHtml(html, to);
  const first = incoming[0];
  if (incoming.length === 1 && isText(first.type) && (first.type === "text" || first.type === b.type || inlineText(html).trim())) {
    next[i] = { ...b, html: left + (first.type === "code" ? escapeText(inlineText(first.html ?? "")) : (first.html ?? "")) + right };
    return { next, caret: { id: b.id, start: htmlLength(left) + htmlLength(first.html ?? "") } };
  }
  const out: BlockEditorBlock[] = [];
  if (b.type === "text" && !inlineText(left).trim() && !left.includes(C.mention)) out.push({ ...first, id: b.id });
  else if (isText(first.type) && first.type !== "code") out.push({ ...b, html: left + (first.html ?? "") });
  else out.push({ ...b, html: left }, first);
  out.push(...incoming.slice(1));
  const last = out[out.length - 1];
  let caret: Focus;
  if (isText(last.type) && last.type !== "code") {
    caret = { id: last.id, start: htmlLength(last.html ?? "") };
    out[out.length - 1] = { ...last, html: (last.html ?? "") + right };
  } else {
    const tail = blockEditorBlock("text", { html: right });
    out.push(tail);
    caret = { id: tail.id, start: 0 };
  }
  next.splice(i, 1, ...out);
  return { next, caret };
}

/**
 * Make `root` a block editor. It renders `options.value` (or the blocks already written inside it), handles typing,
 * the keyboard, menus, formatting, media and drag and drop, and calls `onChange` with the whole value after every
 * change. Returns a controller; call destroy() when the element goes away. Used by React BlockEditor and <ayy-block-editor>.
 */
export function connectBlockEditor(root: HTMLElement, options: BlockEditorOptions = {}): BlockEditorController {
  let opts: BlockEditorOptions = { ...options };
  const native = supportsPopover();
  const apple = isApplePlatform();
  const isMod = (e: KeyboardEvent | MouseEvent) => (apple ? e.metaKey : e.ctrlKey);
  const uid = Math.random().toString(36).slice(2, 8);
  let blocks = blockEditorNormalize(options.value ?? readMarkup(root));
  let undoStack: Snapshot[] = [];
  let redoStack: Snapshot[] = [];
  let typing: { id: string; at: number } | null = null;
  let beforeFocus: Focus | null = null;
  let picked: { anchor: string; head: string } | null = null;
  let spanning = false;
  let pressing = false;
  let menu: MenuState | null = null;
  let menuItems: MenuItem[] = [];
  let dismissed: { id: string; start: number } | null = null;
  let mentionRequest = 0;
  let stopMenuPlacing: (() => void) | null = null;
  let stopToolbarPlacing: (() => void) | null = null;
  let toolbarFrame = 0;
  let toolbarShown = false;
  let lastRange: Range | null = null;
  let fileTarget: string | null = null;
  let copied = false;
  const uploading = new Set<string>();
  const els = new Map<string, HTMLElement>();
  const sigs = new Map<string, string>();
  /** Blocks nested under a closed toggle: in the value, but not shown. */
  let hiddenIds = new Set<string>();
  /** The table cell that had the caret last, which the block actions menu's row and column items work on. */
  let lastCell: { id: string; row: number; col: number } | null = null;

  root.classList.add(P);
  root.replaceChildren();
  root.setAttribute("role", "group");
  root.tabIndex = -1;

  // ---- Floating parts: the caret anchor, the menu, the formatting bar, the file picker ----

  const anchor = make("span", C.anchor, { "aria-hidden": "true", contenteditable: "false" });
  const menuEl = make("div", `ayy-combobox__listbox ${C.menu}`, { role: "listbox", id: `ayy-be-${uid}-menu`, tabindex: "-1", contenteditable: "false" });
  const toolbar = make("div", `ayy-toolbar ayy-toolbar--floating ${C.toolbar}`, { role: "toolbar", "aria-label": "Format text", contenteditable: "false" });
  const fileInput = make("input", undefined, { type: "file", hidden: "", tabindex: "-1", "aria-hidden": "true" });
  for (const floating of [menuEl, toolbar]) {
    if (native) floating.setAttribute("popover", "manual");
    else floating.hidden = true;
  }
  const FORMATS = [
    { command: "strong", label: "Bold", icon: TextBoldIcon, shortcut: "Mod+B" },
    { command: "em", label: "Italic", icon: TextItalicIcon, shortcut: "Mod+I" },
    { command: "u", label: "Underline", icon: TextUnderlineIcon, shortcut: "Mod+U" },
    { command: "s", label: "Strikethrough", icon: TextStrikethroughIcon, shortcut: "Mod+Shift+S" },
    { command: "code", label: "Inline code", icon: CodeIcon, shortcut: "Mod+E" },
    { command: "link", label: "Link", icon: Link01Icon, shortcut: "Mod+K" },
  ];
  const formatGroup = make("div", "ayy-toolbar__group");
  for (const f of FORMATS) {
    if (f.command === "link") formatGroup.append(make("span", "ayy-toolbar__separator", { "aria-hidden": "true" }));
    const button = make("button", "ayy-toolbar__button", { type: "button", tabindex: "-1", "aria-label": f.label, "aria-pressed": "false", "data-command": f.command });
    button.innerHTML = svg(f.icon);
    formatGroup.append(tooltipped(button, f.label, f.shortcut));
  }
  const linkForm = make("form", C.linkForm, { hidden: "" });
  const linkInput = make("input", inputClass({ size: "sm" }), { type: "url", placeholder: "Paste or type a link", "aria-label": "Link address", autocomplete: "off", spellcheck: "false" });
  const openLinkButton = make("button", "ayy-toolbar__button", { type: "button", "aria-label": "Open link", "data-link": "open" });
  openLinkButton.innerHTML = svg(ArrowUpRight01Icon);
  const unlinkButton = make("button", "ayy-toolbar__button", { type: "button", "aria-label": "Remove link", "data-link": "remove" });
  unlinkButton.innerHTML = svg(Unlink04Icon);
  linkForm.append(linkInput, tooltipped(openLinkButton, "Open link"), tooltipped(unlinkButton, "Remove link"));
  toolbar.append(formatGroup, linkForm);
  root.append(anchor, menuEl, toolbar, fileInput);

  // ---- Reading the document ----

  const readOnly = () => !!opts.readOnly;
  const indexOf = (id: string) => blocks.findIndex((b) => b.id === id);
  const blockOf = (node: Node | null | undefined): HTMLElement | null => {
    const el = (isElement(node) ? node : node?.parentElement)?.closest<HTMLElement>(`.${C.block}`) ?? null;
    return el && el.parentElement === root ? el : null;
  };
  const idOf = (node: Node | null | undefined) => blockOf(node)?.dataset.id ?? "";
  const textEl = (id: string) => els.get(id)?.querySelector<HTMLElement>(`:scope > .${C.text}`) ?? null;
  /** The block `dir` steps from index `i` that's showing (the arrows skip what a closed toggle hides), or -1. */
  function stepVisible(i: number, dir: -1 | 1): number {
    for (let j = i + dir; j >= 0 && j < blocks.length; j += dir) if (!hiddenIds.has(blocks[j].id)) return j;
    return -1;
  }
  /** `ids` plus every block a closed toggle among them hides, so moving, copying or deleting a toggle takes what's inside it. */
  function withKids(ids: string[]): string[] {
    const set = new Set(ids);
    for (const id of ids) {
      const i = indexOf(id);
      const b = blocks[i];
      if (!b || b.type !== "toggle" || b.open) continue;
      for (let j = i + 1; j < blocks.length && (blocks[j].indent ?? 0) > (b.indent ?? 0); j++) set.add(blocks[j].id);
    }
    return blocks.filter((b) => set.has(b.id)).map((b) => b.id);
  }
  /** Open every closed toggle above a hidden block, so a caret or a selection can land in it. */
  function reveal(id: string): boolean {
    const i = indexOf(id);
    if (!hiddenIds.has(id)) return false;
    const next = blocks.slice();
    let depth = blocks[i].indent ?? 0;
    for (let j = i - 1; j >= 0 && depth > 0; j--) {
      const d = next[j].indent ?? 0;
      if (d >= depth) continue;
      if (next[j].type === "toggle") next[j] = { ...next[j], open: true };
      depth = d;
    }
    blocks = next;
    render();
    return true;
  }
  /** Open or close a toggle. */
  function setOpen(id: string, open: boolean): void {
    const i = indexOf(id);
    const b = blocks[i];
    if (!b || b.type !== "toggle" || !!b.open === open) return;
    const next = { ...b };
    if (open) next.open = true;
    else delete next.open;
    if (readOnly()) {
      blocks = replaceAt(i, next);
      render();
      return;
    }
    const focus = focusNow();
    commit(replaceAt(i, next), focus && "id" in focus && hiddenAfterClose(i, focus.id) ? { id, start: "end" } : focus);
    announce(open ? "Toggle opened" : "Toggle closed");
  }
  /** Would closing the toggle at `i` hide the block `id`? (Then the caret moves to the toggle.) */
  function hiddenAfterClose(i: number, id: string): boolean {
    const depth = blocks[i].indent ?? 0;
    const at = indexOf(id);
    if (at <= i) return false;
    for (let j = i + 1; j <= at; j++) if ((blocks[j].indent ?? 0) <= depth) return false;
    return true;
  }
  const textHost = (node: Node | null | undefined): HTMLElement | null => {
    const el = (isElement(node) ? node : node?.parentElement)?.closest<HTMLElement>(`.${C.text}`) ?? null;
    return el && root.contains(el) ? el : null;
  };
  const lengthOf = (index: number) => {
    const b = blocks[index];
    const el = b ? textEl(b.id) : null;
    return el ? textOf(el).length : 0;
  };
  const isEmptyDoc = () => blocks.length === 1 && blocks[0].type === "text" && !inlineText(blocks[0].html ?? "") && !(blocks[0].html ?? "").includes(C.mention);
  const signature = (b: BlockEditorBlock) => [b.type, b.html ?? "", b.src ?? "", b.caption ?? "", b.name ?? "", b.size ?? "", b.rows ? b.rows.map((r) => r.join("\u0002")).join("\u0003") : "", b.header === false ? 0 : 1, b.headerColumn ? 1 : 0, b.widths?.join(",") ?? "", b.align?.join(",") ?? "", readOnly() ? 1 : 0, uploading.has(b.id) ? 1 : 0].join("\u0001");
  const replaceAt = (i: number, ...items: BlockEditorBlock[]) => {
    const next = blocks.slice();
    next.splice(i, 1, ...items);
    return next;
  };
  const hint = () => {
    const triggers = (opts.mentions ?? []).map((m) => m.trigger);
    return `Type / for blocks${triggers.length ? `, ${triggers.join(" or ")} to mention` : ""}`;
  };
  const placeholderOf = (b: BlockEditorBlock) => {
    if (b.type === "text") return isEmptyDoc() ? (opts.placeholder ?? `Write something, or ${hint().charAt(0).toLowerCase()}${hint().slice(1)}`) : hint();
    if (isList(b.type)) return b.type === "todo" ? "To-do" : "List";
    return TYPES[b.type].label.replace(/ list$/, "");
  };

  /** Convert a text block to another text type, keeping its content (and indent and checkbox where they still apply). */
  function asType(b: BlockEditorBlock, type: BlockEditorBlockType): BlockEditorBlock {
    const out: BlockEditorBlock = { id: b.id, type, html: type === "code" ? escapeHtml(inlineText(b.html ?? "")) : (b.html ?? "") };
    if (INDENTABLE.includes(type) && b.indent) out.indent = b.indent;
    if (type === "todo") out.checked = b.type === "todo" ? !!b.checked : false;
    if (type === "toggle") out.open = b.type === "toggle" ? !!b.open : true;
    return out;
  }

  // ---- Rendering ----

  function buildGutter(): HTMLElement {
    const gutter = make("div", C.gutter, { contenteditable: "false" });
    const add = make("button", C.add, { type: "button", tabindex: "-1", "aria-label": "Add a block below" });
    add.innerHTML = svg(PlusSignIcon);
    const handle = make("button", `${dragHandleClass} ${C.handle}`, { type: "button", tabindex: "-1", "aria-label": "Drag to move, click for options", "aria-haspopup": "listbox", "aria-expanded": "false" });
    handle.innerHTML = dragHandleIcon;
    gutter.append(tooltipped(add, "Add below · Alt-click above", undefined, "bottom"), tooltipped(handle, "Drag to move · click for options", undefined, "bottom"));
    return gutter;
  }

  function buildText(b: BlockEditorBlock): HTMLElement {
    const el = make("div", C.text);
    const code = b.type === "code";
    if (!readOnly()) {
      el.setAttribute("role", "textbox");
      el.setAttribute("aria-label", TYPES[b.type].label);
      if (code) el.setAttribute("aria-multiline", "true");
      try {
        el.contentEditable = code ? "plaintext-only" : "true";
      } catch {
        el.contentEditable = "true";
      }
      el.spellcheck = !code;
    }
    if (code) el.textContent = inlineText(b.html ?? "");
    else el.innerHTML = b.html ?? "";
    tidy(el);
    return el;
  }

  function buildEmptyMedia(b: BlockEditorBlock): HTMLElement {
    const box = make("div", C.empty, { contenteditable: "false" });
    if (uploading.has(b.id)) box.setAttribute("aria-busy", "true");
    box.innerHTML = svg(TYPES[b.type].icon);
    const placeholder =
      b.type === "image" ? "Paste an image link and press Enter" : b.type === "file" ? "Paste a file link and press Enter" : "Paste a YouTube, Vimeo, Loom, Spotify, Figma or media link";
    const input = make("input", inputClass({ size: "sm" }), { type: "url", placeholder, "aria-label": `${TYPES[b.type].label} link`, "data-media-input": "", autocomplete: "off" });
    const upload = make("button", buttonClass({ variant: "outline", size: "sm" }), { type: "button", "data-media-upload": "" });
    upload.innerHTML = `${svg(CloudUploadIcon)}Upload`;
    box.append(input, upload);
    return box;
  }

  function buildMedia(b: BlockEditorBlock): HTMLElement {
    if (!b.src) return readOnly() ? make("div", C.empty, { hidden: "" }) : buildEmptyMedia(b);
    if (b.type === "file") {
      const link = make("a", C.file, { href: b.src, target: "_blank", rel: "noopener noreferrer", download: b.name ?? "" });
      link.innerHTML = svg(Attachment01Icon);
      const name = make("span", C.fileName, { dir: "auto" });
      name.textContent = b.name || decodeURIComponent(b.src.split(/[?#]/)[0].split("/").pop() || "") || "File";
      link.append(name);
      const size = formatSize(b.size);
      if (size) {
        const sizeEl = make("span", C.fileSize);
        sizeEl.textContent = size;
        link.append(sizeEl);
      }
      return link;
    }
    const figure = make("figure", C.media);
    const frame = make("div", C.frame);
    if (b.type === "image") {
      frame.append(make("img", C.image, { src: b.src, alt: b.caption ?? "", loading: "lazy", draggable: "false" }));
      if (!readOnly()) {
        frame.append(make("span", C.resize, { role: "separator", tabindex: "0", contenteditable: "false", "aria-orientation": "vertical", "aria-label": "Image width", "aria-valuemin": "20", "aria-valuemax": "100" }));
      }
    } else {
      const embed = blockEditorEmbed(b.src) ?? { kind: "link" as const, src: b.src, host: b.src };
      if (embed.kind === "iframe") {
        frame.dataset.ratio = embed.ratio;
        frame.append(
          make("iframe", undefined, {
            src: embed.src,
            title: b.caption || `${embed.provider} embed`,
            loading: "lazy",
            allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
            allowfullscreen: "",
            referrerpolicy: "strict-origin-when-cross-origin",
            sandbox: "allow-scripts allow-same-origin allow-popups allow-presentation allow-forms",
          }),
        );
      } else if (embed.kind === "video" || embed.kind === "audio") {
        frame.append(make(embed.kind, undefined, { src: embed.src, controls: "", preload: "metadata" }));
      } else if (embed.kind === "link") {
        const card = make("a", C.bookmark, { href: embed.src, target: "_blank", rel: "noopener noreferrer" });
        card.innerHTML = svg(Link01Icon);
        const title = make("span", C.bookmarkTitle);
        title.textContent = embed.host;
        const url = make("span", C.bookmarkUrl);
        url.textContent = embed.src;
        card.append(title, url);
        frame.append(card);
      }
    }
    figure.append(frame);
    if (!readOnly() || b.caption) {
      const caption = make("figcaption", C.caption, { dir: "auto", "data-placeholder": "Add a caption" });
      if (!readOnly()) {
        caption.setAttribute("role", "textbox");
        caption.setAttribute("aria-label", "Caption");
        try {
          caption.contentEditable = "plaintext-only";
        } catch {
          caption.contentEditable = "true";
        }
      }
      caption.textContent = b.caption ?? "";
      figure.append(caption);
    }
    return figure;
  }

  /** A code block's header: its language (a menu of languages) and Copy. */
  function buildCodeBar(): HTMLElement {
    const bar = make("div", C.codeBar, { contenteditable: "false" });
    const language = readOnly()
      ? make("span", C.codeButton, { "data-code-language": "" })
      : make("button", C.codeButton, { type: "button", "aria-haspopup": "listbox", "aria-expanded": "false", "data-code-language": "" });
    const copy = make("button", C.codeButton, { type: "button", "aria-label": "Copy code", "data-code-copy": "" });
    copy.innerHTML = codeBlockCopyIcon;
    bar.append(language, tooltipped(copy, "Copy code", undefined, "bottom"));
    return bar;
  }

  /** The cells of a table block as a grid to change (never the value's own arrays). */
  const gridOf = (b: BlockEditorBlock): string[][] => (b.rows?.length ? b.rows : tableGrid([])).map((row) => row.slice());
  const cellPos = (cell: HTMLElement): [number, number] => [Number(cell.dataset.row), Number(cell.dataset.col)];
  const cellEl = (id: string, row: number, col: number) => els.get(id)?.querySelector<HTMLElement>(`.${C.cell}[data-row="${row}"][data-col="${col}"]`) ?? null;

  function buildTable(b: BlockEditorBlock): HTMLElement {
    const wrap = make("div", C.tableWrap);
    const scroll = make("div", C.tableScroll);
    const table = make("table", C.table);
    const grid = gridOf(b);
    const header = b.header !== false;
    const sized = !!b.widths?.some(Boolean);
    const cols = make("colgroup");
    grid[0].forEach((_, c) => {
      const col = make("col");
      if (b.widths?.[c]) col.style.inlineSize = `${b.widths[c]}px`;
      cols.append(col);
    });
    if (sized) {
      table.setAttribute("data-sized", "");
      table.style.inlineSize = `${b.widths!.reduce((sum, w) => sum + (w || 160), 0)}px`;
    }
    const head = make("thead");
    const body = make("tbody");
    grid.forEach((row, r) => {
      const tr = make("tr");
      row.forEach((text, c) => {
        const th = header && r === 0;
        const rowHead = !th && !!b.headerColumn && c === 0;
        const td = make(th || rowHead ? "th" : "td", undefined, th ? { scope: "col" } : rowHead ? { scope: "row" } : {});
        const field = make("div", C.cell, { dir: "auto", "data-row": String(r), "data-col": String(c) });
        const align = b.align?.[c];
        if (align && align !== "start") field.dataset.align = align;
        if (!readOnly()) {
          field.setAttribute("role", "textbox");
          field.setAttribute("aria-label", `${th ? "Header" : `Row ${r + 1}`}, column ${c + 1}`);
          try {
            field.contentEditable = "plaintext-only";
          } catch {
            field.contentEditable = "true";
          }
          field.spellcheck = true;
        }
        field.textContent = text;
        td.append(field);
        if (r === 0 && !readOnly()) td.append(make("span", C.colResize, { role: "separator", "aria-orientation": "vertical", "aria-label": `Resize column ${c + 1}`, contenteditable: "false", "data-col": String(c) }));
        tr.append(td);
      });
      (header && r === 0 ? head : body).append(tr);
    });
    table.append(cols);
    if (header) table.append(head);
    table.append(body);
    scroll.append(table);
    wrap.append(scroll);
    if (!readOnly()) {
      for (const axis of ["column", "row"] as const) {
        const add = make("button", C.tableAdd, { type: "button", tabindex: "-1", contenteditable: "false", "data-axis": axis, "aria-label": `Add ${axis}` });
        add.innerHTML = svg(PlusSignIcon);
        wrap.append(add);
      }
    }
    return wrap;
  }

  function buildBlock(b: BlockEditorBlock): HTMLElement {
    const el = make("div", C.block, { "data-type": b.type, "data-id": b.id });
    if (!readOnly()) el.append(buildGutter());
    if (isText(b.type)) {
      if (b.type === "bullet" || b.type === "number") el.append(make("span", C.marker, { "aria-hidden": "true", contenteditable: "false" }));
      if (b.type === "todo") {
        const box = make("input", `${checkboxClass} ${C.check}`, { type: "checkbox", "aria-label": "Done", contenteditable: "false" });
        box.disabled = readOnly();
        el.append(box);
      }
      if (b.type === "toggle") {
        const arrow = make("button", `${C.toggle}`, { type: "button", tabindex: "-1", contenteditable: "false", "aria-label": "Toggle", "aria-expanded": "false" });
        arrow.innerHTML = iconSvg(ArrowRight01Icon, { directional: true });
        el.append(arrow);
      }
      if (b.type === "callout") {
        const icon = make("span", C.icon, { "aria-hidden": "true", contenteditable: "false" });
        icon.innerHTML = svg(BulbIcon);
        el.append(icon);
      }
      el.append(buildText(b));
      if (b.type === "code") el.append(buildCodeBar());
    } else if (b.type === "divider") el.append(make("hr", C.rule));
    else if (b.type === "table") el.append(buildTable(b));
    else el.append(buildMedia(b));
    return el;
  }

  // Code is coloured with the CSS Custom Highlight API: ranges over the text, so the editable DOM (and the caret) is
  // never touched. One Highlight per token type is shared by every editor on the page; each editor owns its ranges.
  const codeRanges = new Map<string, Range[]>();
  function unpaintCode(id: string): void {
    for (const range of codeRanges.get(id) ?? []) for (const h of codeHighlights.values()) h.delete(range);
    codeRanges.delete(id);
  }
  function paintCode(b: BlockEditorBlock): void {
    if (!codeHighlights.size && !setUpHighlights()) return;
    unpaintCode(b.id);
    const el = textEl(b.id);
    if (!el || b.type !== "code" || !b.language) return;
    const ranges: Range[] = [];
    let at = 0;
    for (const token of tokenizeCode(textOf(el), b.language)) {
      const length = token.value.length;
      const highlight = codeHighlights.get(token.type);
      if (highlight && token.value.trim()) {
        const range = document.createRange();
        const [sn, so] = pointAt(el, at);
        const [en, eo] = pointAt(el, at + length);
        range.setStart(sn, so);
        range.setEnd(en, eo);
        highlight.add(range);
        ranges.push(range);
      }
      at += length;
    }
    codeRanges.set(b.id, ranges);
  }

  function decorate(el: HTMLElement, b: BlockEditorBlock, counts: number[]): void {
    const depth = b.indent ?? 0;
    if (depth) el.setAttribute("data-indent", String(depth));
    else el.removeAttribute("data-indent");
    if (!isList(b.type)) counts.length = Math.min(counts.length, depth);
    else {
      counts.length = Math.min(counts.length, depth + 1);
      counts[depth] = b.type === "number" ? (counts[depth] ?? 0) + 1 : 0;
    }
    const marker = el.querySelector<HTMLElement>(`:scope > .${C.marker}`);
    if (marker) marker.textContent = b.type === "number" ? numberLabel(counts[depth], depth) : BULLETS[depth % BULLETS.length];
    if (b.type === "code") {
      const label = el.querySelector<HTMLElement>("[data-code-language]");
      if (label) {
        label.textContent = languageLabel(b.language);
        label.setAttribute("aria-label", `Code language: ${languageLabel(b.language)}`);
      }
      paintCode(b);
    }
    if (b.type === "toggle") {
      el.toggleAttribute("data-open", !!b.open);
      const arrow = el.querySelector<HTMLElement>(`:scope > .${C.toggle}`);
      arrow?.setAttribute("aria-expanded", String(!!b.open));
      arrow?.setAttribute("aria-label", b.open ? "Close toggle" : "Open toggle");
    }
    el.toggleAttribute("hidden", hiddenIds.has(b.id));
    if (b.type === "todo") {
      el.toggleAttribute("data-checked", !!b.checked);
      const box = el.querySelector<HTMLInputElement>(`:scope > .${C.check}`);
      if (box) box.checked = !!b.checked;
    }
    if (b.type === "image") {
      const frame = el.querySelector<HTMLElement>(`.${C.frame}`);
      if (frame) frame.style.inlineSize = b.width ? `${b.width}%` : "";
      const handle = el.querySelector<HTMLElement>(`.${C.resize}`);
      handle?.setAttribute("aria-valuenow", String(b.width ?? 100));
      handle?.setAttribute("aria-valuetext", `${b.width ?? 100}%`);
    }
    el.toggleAttribute("data-selected", isPicked(b.id));
    el.querySelector(`:scope > .${C.text}`)?.setAttribute("data-placeholder", placeholderOf(b));
    orient(el, b);
  }

  /** A block takes the direction of its own text, so its marker, checkbox and quote line sit on the side the text starts. */
  function orient(el: HTMLElement, b: BlockEditorBlock): void {
    const dir = directionOf(isText(b.type) ? inlineText(b.html ?? "") : (b.caption ?? b.name ?? ""));
    if (dir) el.setAttribute("dir", dir);
    else el.removeAttribute("dir");
  }

  /** Bring the DOM in line with `blocks`, reusing the element of every block whose content didn't change (an embed doesn't reload, a caret stays). */
  function render(): void {
    let cursor: Element | null = root.firstElementChild;
    if (cursor && !cursor.classList.contains(C.block)) cursor = null;
    const keep = new Set<string>();
    const counts: number[] = [];
    hiddenIds = new Set();
    let closedAt = -1;
    for (const b of blocks) {
      const depth = b.indent ?? 0;
      if (closedAt >= 0 && depth > closedAt) hiddenIds.add(b.id);
      else {
        closedAt = b.type === "toggle" && !b.open ? depth : -1;
      }
    }
    for (const b of blocks) {
      keep.add(b.id);
      const sig = signature(b);
      let el = els.get(b.id);
      if (!el || sigs.get(b.id) !== sig) {
        const fresh = buildBlock(b);
        if (el) {
          if (cursor === el) cursor = fresh;
          el.replaceWith(fresh);
        }
        el = fresh;
        els.set(b.id, el);
        sigs.set(b.id, sig);
      }
      if (cursor === el) {
        const next = el.nextElementSibling;
        cursor = next && next.classList.contains(C.block) ? next : null;
      } else root.insertBefore(el, cursor ?? anchor);
      decorate(el, b, counts);
    }
    for (const [id, el] of els) {
      if (keep.has(id)) continue;
      unpaintCode(id);
      el.remove();
      els.delete(id);
      sigs.delete(id);
    }
    root.toggleAttribute("data-empty", isEmptyDoc());
    root.setAttribute("aria-label", opts.label ?? "Editor");
    if (readOnly()) root.setAttribute("aria-readonly", "true");
    else root.removeAttribute("aria-readonly");
  }

  function refreshPlaceholders(): void {
    const empty = isEmptyDoc();
    if (root.hasAttribute("data-empty") === empty) return;
    root.toggleAttribute("data-empty", empty);
    for (const b of blocks) els.get(b.id)?.querySelector(`:scope > .${C.text}`)?.setAttribute("data-placeholder", placeholderOf(b));
  }

  // ---- History and changes ----

  function focusNow(): Focus | null {
    if (picked) return { pick: [picked.anchor, picked.head] };
    const span = spanning ? spanOf() : null;
    if (span) {
      const b = blocks[span[0].index];
      return { id: b.id, start: span[0].offset, end: span[0].index === span[1].index ? span[1].offset : undefined };
    }
    const active = document.activeElement;
    const cell = isElement(active) && active.classList.contains(C.cell) && root.contains(active) ? active : null;
    if (cell) {
      const at = selectionIn(cell);
      return { id: idOf(cell), cell: cellPos(cell), start: at?.start ?? 0, end: at && at.end !== at.start ? at.end : undefined };
    }
    const host = textHost(active);
    const id = idOf(host);
    if (!host || !id) return null;
    const at = selectionIn(host);
    return { id, start: at?.start ?? 0, end: at && at.end !== at.start ? at.end : undefined };
  }

  function pushHistory(focus: Focus | null = focusNow()): void {
    undoStack.push({ blocks, focus });
    if (undoStack.length > 300) undoStack.shift();
    redoStack = [];
  }

  const copyOf = (b: BlockEditorBlock): BlockEditorBlock => (b.rows ? { ...b, rows: b.rows.map((r) => r.slice()) } : { ...b });
  const emit = () => opts.onChange?.(blocks.map(copyOf));

  function commit(next: BlockEditorBlock[], focus?: Focus | null, history = true): void {
    if (history) {
      pushHistory();
      typing = null;
    }
    blocks = next.length ? next : [blockEditorBlock()];
    render();
    if (focus) applyFocus(focus);
    emit();
  }

  function travel(from: Snapshot[], to: Snapshot[]): void {
    const snap = from.pop();
    if (!snap) return;
    to.push({ blocks, focus: focusNow() });
    typing = null;
    closeMenu();
    hideToolbar(true);
    setSpanning(false);
    picked = null;
    blocks = snap.blocks;
    render();
    applyFocus(snap.focus ?? { id: blocks[blocks.length - 1].id, start: "end" });
    emit();
  }
  const undo = () => travel(undoStack, redoStack);
  const redo = () => travel(redoStack, undoStack);

  function applyFocus(f: Focus): void {
    if ("pick" in f) {
      if (indexOf(f.pick[0]) >= 0 && indexOf(f.pick[1]) >= 0) pick(f.pick[0], f.pick[1]);
      return;
    }
    reveal(f.id);
    const el = els.get(f.id);
    if (!el) return;
    if (picked) unpick();
    const input = el.querySelector<HTMLInputElement>("[data-media-input]");
    if (input) {
      input.focus();
      return;
    }
    const grid = el.dataset.type === "table" ? gridOf(blocks[indexOf(f.id)]) : null;
    if (grid) {
      const [row, col] = f.cell ?? (f.start === "end" ? [grid.length - 1, grid[0].length - 1] : [0, 0]);
      const cell = cellEl(f.id, Math.min(row, grid.length - 1), Math.min(col, grid[0].length - 1));
      if (cell) {
        const length = textOf(cell).length;
        const start = f.start === "end" ? length : Math.min(f.start, length);
        selectText(cell, start, f.end !== undefined ? Math.min(f.end, length) : start);
        return;
      }
    }
    const text = el.querySelector<HTMLElement>(`:scope > .${C.text}`);
    if (!text) {
      pick(f.id, f.id);
      return;
    }
    const length = textOf(text).length;
    const start = f.start === "end" ? length : Math.min(f.start, length);
    selectText(text, start, f.end !== undefined ? Math.min(f.end, length) : start);
  }

  /** The typed text of a line or caption, back into the value. */
  function syncText(el: HTMLElement, history: "burst" | "step" | "none" = "burst"): void {
    const id = idOf(el);
    const i = indexOf(id);
    if (i < 0) return;
    const b = blocks[i];
    tidy(el);
    const now = Date.now();
    if (history === "step" || (history === "burst" && (!typing || typing.id !== id || now - typing.at > 1200))) pushHistory(beforeFocus ?? focusNow());
    typing = history === "burst" ? { id, at: now } : history === "step" ? null : typing;
    beforeFocus = null;
    let next: BlockEditorBlock;
    if (el.classList.contains(C.cell)) {
      const [row, col] = cellPos(el);
      const rows = gridOf(b);
      rows[row][col] = textOf(el);
      next = { ...b, rows };
    } else if (el.classList.contains(C.caption)) {
      next = { ...b, caption: textOf(el) };
      if (!next.caption) delete next.caption;
      els.get(id)?.querySelector("img")?.setAttribute("alt", next.caption ?? "");
    } else next = { ...b, html: b.type === "code" ? escapeHtml(codeText(el)) : cleanDom(el) };
    blocks = replaceAt(i, next);
    sigs.set(id, signature(next));
    const blockEl = els.get(id);
    if (blockEl) orient(blockEl, next);
    if (next.type === "code") paintCode(next);
    refreshPlaceholders();
  }

  /** After a format applied across blocks: read every line back. */
  function syncAll(): void {
    let changed = false;
    blocks = blocks.map((b) => {
      const el = textEl(b.id);
      if (!el) return b;
      tidy(el);
      const html = b.type === "code" ? escapeHtml(codeText(el)) : cleanDom(el);
      if (html === b.html) return b;
      changed = true;
      const next = { ...b, html };
      sigs.set(b.id, signature(next));
      const blockEl = els.get(b.id);
      if (blockEl) orient(blockEl, next);
      return next;
    });
    if (changed) refreshPlaceholders();
  }

  // ---- Block selection (Esc, Shift+click, the handle) ----

  function pickedRange(): [number, number] | null {
    if (!picked) return null;
    const a = indexOf(picked.anchor);
    const h = indexOf(picked.head);
    if (a < 0 || h < 0) return null;
    // A closed toggle in the selection takes what it hides.
    let hi = Math.max(a, h);
    while (hi + 1 < blocks.length && hiddenIds.has(blocks[hi + 1].id)) hi++;
    return [Math.min(a, h), hi];
  }
  const pickedIds = () => {
    const range = pickedRange();
    return range ? blocks.slice(range[0], range[1] + 1).map((b) => b.id) : [];
  };
  function isPicked(id: string): boolean {
    const range = pickedRange();
    if (!range) return false;
    const i = indexOf(id);
    return i >= range[0] && i <= range[1];
  }
  function paintPicked(): void {
    for (const [id, el] of els) el.toggleAttribute("data-selected", isPicked(id));
  }
  function pick(anchorId: string, headId: string): void {
    setSpanning(false);
    if (menu?.mode !== "actions") closeMenu();
    hideToolbar(true);
    picked = { anchor: anchorId, head: headId };
    window.getSelection()?.removeAllRanges();
    paintPicked();
    if (document.activeElement !== root && !menuEl.contains(document.activeElement)) root.focus({ preventScroll: true });
    els.get(headId)?.scrollIntoView({ block: "nearest" });
    const n = pickedIds().length;
    announce(`${n} ${n === 1 ? "block" : "blocks"} selected`);
  }
  function unpick(): void {
    if (!picked) return;
    picked = null;
    paintPicked();
  }

  // ---- Structural edits ----

  function duplicate(ids: string[]): void {
    ids = withKids(ids);
    const idx = ids.map(indexOf).filter((i) => i >= 0).sort((a, b) => a - b);
    if (!idx.length) return;
    const copies = idx.map((i) => ({ ...blocks[i], id: blockEditorId() }));
    const next = blocks.slice();
    next.splice(idx[idx.length - 1] + 1, 0, ...copies);
    const caret: Focus = picked || copies.length > 1 || !isText(copies[0].type) ? { pick: [copies[0].id, copies[copies.length - 1].id] } : { id: copies[0].id, start: "end" };
    commit(next, caret);
  }

  function moveBlocks(ids: string[], dir: -1 | 1): void {
    ids = withKids(ids);
    const idx = ids.map(indexOf).filter((i) => i >= 0).sort((a, b) => a - b);
    if (!idx.length) return;
    const lo = idx[0];
    const hi = idx[idx.length - 1];
    if ((dir < 0 && lo === 0) || (dir > 0 && hi === blocks.length - 1)) return;
    const focus = focusNow();
    const next = blocks.slice();
    const run = next.splice(lo, hi - lo + 1);
    // Past one block, or past a whole closed toggle with what it hides.
    let at = lo + dir;
    if (dir < 0) at = Math.max(0, stepVisible(lo, -1));
    else {
      const over = next[lo];
      at = lo + 1;
      if (over.type === "toggle" && !over.open) while (at < next.length && (next[at].indent ?? 0) > (over.indent ?? 0)) at++;
    }
    next.splice(at, 0, ...run);
    commit(next, focus);
    announce(`Moved ${dir < 0 ? "up" : "down"} to position ${at + 1} of ${blocks.length}`);
  }

  function removeBlocks(ids: string[]): void {
    ids = withKids(ids);
    const set = new Set(ids);
    const lo = Math.min(...ids.map(indexOf).filter((i) => i >= 0));
    const next = blocks.filter((b) => !set.has(b.id));
    if (!next.length) next.push(blockEditorBlock());
    const target = next[Math.max(0, Math.min(lo - 1, next.length - 1))];
    picked = null;
    commit(next, isText(target.type) ? { id: target.id, start: lo === 0 ? 0 : "end" } : { pick: [target.id, target.id] });
  }

  function turnInto(ids: string[], type: BlockEditorBlockType): void {
    const set = new Set(ids);
    const focus = focusNow();
    commit(
      blocks.map((b) => (set.has(b.id) && isText(b.type) ? asType(b, type) : b)),
      focus,
    );
  }

  /** Tab / Shift+Tab: nest under the block above (at most one level deeper than it), carrying nested blocks along. */
  function indentBlocks(ids: string[], dir: -1 | 1): void {
    const set = new Set(ids);
    const next = blocks.slice();
    let changed = false;
    for (let i = 0; i < next.length; i++) {
      const b = next[i];
      if (!set.has(b.id) || !INDENTABLE.includes(b.type)) continue;
      const prev = next[i - 1];
      const current = b.indent ?? 0;
      const limit = prev && INDENTABLE.includes(prev.type) ? (prev.indent ?? 0) + 1 : 0;
      const want = dir > 0 ? Math.min(current + 1, limit, MAX_INDENT) : Math.max(0, current - 1);
      const delta = want - current;
      if (!delta) continue;
      changed = true;
      next[i] = withIndent(b, want);
      for (let j = i + 1; j < next.length && !set.has(next[j].id) && (next[j].indent ?? 0) > current; j++) {
        next[j] = withIndent(next[j], Math.max(0, Math.min(MAX_INDENT, (next[j].indent ?? 0) + delta)));
      }
    }
    if (changed) commit(next, focusNow());
  }
  function withIndent(b: BlockEditorBlock, indent: number): BlockEditorBlock {
    const out = { ...b };
    if (indent && INDENTABLE.includes(b.type)) out.indent = indent;
    else delete out.indent;
    return out;
  }

  // ---- Text selections across blocks ----
  //
  // Each block is its own contentEditable, and browsers keep a selection inside the editing host it started in. When a
  // selection may cross blocks (a press in the text, Shift+arrows at an edge), the editor itself becomes the editing
  // host, so the browser selects and paints across blocks natively. Edits in that state go through beforeinput and the
  // block model, never the browser's DOM changes, and once the selection fits in one block again, that block gets focus back.

  function setSpanning(on: boolean): void {
    if (spanning === on) return;
    spanning = on;
    if (on) root.setAttribute("contenteditable", "true");
    else root.removeAttribute("contenteditable");
  }

  function pointOf(node: Node, offset: number): Point | null {
    if (!root.contains(node) || !blocks.length) return null;
    if (node === root) {
      const after = Array.from(root.childNodes)
        .slice(offset)
        .find((n): n is HTMLElement => isElement(n) && n.classList.contains(C.block));
      if (after) return { index: indexOf(after.dataset.id ?? ""), offset: 0 };
      return { index: blocks.length - 1, offset: lengthOf(blocks.length - 1) };
    }
    const host = blockOf(node);
    const index = host ? indexOf(host.dataset.id ?? "") : -1;
    if (!host || index < 0) return null;
    const text = host.querySelector<HTMLElement>(`:scope > .${C.text}`);
    if (!text) return { index, offset: 0 };
    if (text.contains(node)) return { index, offset: offsetIn(text, node, offset) };
    const at = node === host ? (host.childNodes[offset] ?? null) : node;
    const before = at !== null && !!(text.compareDocumentPosition(at) & Node.DOCUMENT_POSITION_PRECEDING);
    return { index, offset: at === null || !before ? lengthOf(index) : 0 };
  }

  function domPoint(p: Point): [Node, number] | null {
    const b = blocks[p.index];
    const host = b ? els.get(b.id) : null;
    if (!host) return null;
    const text = host.querySelector<HTMLElement>(`:scope > .${C.text}`);
    return text ? pointAt(text, p.offset) : [host, 0];
  }

  function spanOf(): [Point, Point] | null {
    const sel = window.getSelection();
    if (!sel?.anchorNode || !sel.focusNode) return null;
    const a = pointOf(sel.anchorNode, sel.anchorOffset);
    const f = pointOf(sel.focusNode, sel.focusOffset);
    if (!a || !f) return null;
    let [start, end] = a.index < f.index || (a.index === f.index && a.offset <= f.offset) ? [a, f] : [f, a];
    // A triple-click selects up to the start of the next block; that block isn't part of it.
    if (end.index > start.index && end.offset === 0) end = { index: end.index - 1, offset: lengthOf(end.index - 1) };
    return [start, end];
  }

  function spanTo(a: Point, h: Point): void {
    const from = domPoint(a);
    const to = domPoint(h);
    if (!from || !to) return;
    closeMenu();
    setSpanning(true);
    root.focus({ preventScroll: true });
    window.getSelection()?.setBaseAndExtent(from[0], from[1], to[0], to[1]);
    (isElement(to[0]) ? to[0] : to[0].parentElement)?.scrollIntoView({ block: "nearest" });
  }

  /** Shift+↑/↓ into block `index`: the spot on its nearest line below or above the caret. */
  function pointNear(index: number, edge: "top" | "bottom"): Point {
    const b = blocks[index];
    const fallback = { index, offset: edge === "top" ? 0 : lengthOf(index) };
    // The hit test below would find the formatting bar or a menu if one floats over that line.
    hideToolbar(true);
    closeMenu();
    const el = textEl(b.id);
    const caret = caretRect();
    if (!el || !caret) return fallback;
    const box = el.getBoundingClientRect();
    const hit = caretAt(caret.left, edge === "top" ? box.top + 4 : box.bottom - 4);
    const p = hit ? pointOf(hit[0], hit[1]) : null;
    return p && p.index === index ? p : fallback;
  }

  function settle(): void {
    if (!spanning) return;
    const sel = window.getSelection();
    const span = spanOf();
    if (!sel?.anchorNode || !sel.focusNode || !span) {
      setSpanning(false);
      return;
    }
    if (span[0].index !== span[1].index) return;
    const raw = [pointOf(sel.anchorNode, sel.anchorOffset), pointOf(sel.focusNode, sel.focusOffset)];
    const [a, h] = raw[0] && raw[1] && raw[0].index === raw[1].index ? [raw[0], raw[1]] : span;
    const b = blocks[a.index];
    const text = textEl(b.id);
    setSpanning(false);
    if (!text) {
      pick(b.id, b.id);
      return;
    }
    text.focus({ preventScroll: true });
    const from = domPoint(a);
    const to = domPoint(h);
    if (from && to) sel.setBaseAndExtent(from[0], from[1], to[0], to[1]);
  }

  /** Replace the selected text across blocks with `text` (and split the line for Enter). */
  function editSpan([start, end]: [Point, Point], text: string, split = false): void {
    let { next, caret } = deleteSpan(blocks, start, end);
    let focus: Focus = caret;
    if (text) {
      const i = next.findIndex((b) => b.id === caret.id);
      ({ next, caret: focus } = insertInto(next, i, caret.start, caret.start, [blockEditorBlock("text", { html: escapeText(text) })]));
    }
    if (split && "id" in focus) {
      const i = next.findIndex((b) => "id" in focus && b.id === focus.id);
      const b = next[i];
      const at = typeof focus.start === "number" ? focus.start : 0;
      const after = blockEditorBlock(isList(b.type) ? b.type : "text", { html: sliceHtml(b.html ?? "", at), ...(isList(b.type) && b.indent ? { indent: b.indent } : {}) });
      next = next.slice();
      next.splice(i, 1, { ...b, html: sliceHtml(b.html ?? "", 0, at) }, after);
      focus = { id: after.id, start: 0 };
    }
    setSpanning(false);
    commit(next, focus);
  }

  // ---- Menus: "/" for blocks, a trigger for mentions, the handle for block actions ----

  /** How well a block type matches what's typed after "/": its name starting with it first, then a word of its name, a keyword, anything. */
  function slashScore(type: BlockEditorBlockType, q: string): number {
    if (!q) return 0;
    const t = TYPES[type];
    const label = t.label.toLowerCase();
    const words = `${label} ${t.keywords} ${type}`.split(/[\s-]+/);
    if (label.startsWith(q) || t.markdown === q) return 1;
    if (label.split(/\s+/).some((w) => w.startsWith(q))) return 2;
    if (words.some((w) => w.startsWith(q))) return 3;
    if (label.includes(q) || t.keywords.includes(q)) return 4;
    return -1;
  }

  function slashItems(query: string): MenuItem[] {
    const q = query.toLowerCase();
    const ranked = blockEditorBlockTypes
      .map((type, order) => ({ type, order, score: slashScore(type, q) }))
      .filter((x) => x.score >= 0)
      .sort((a, b) => a.score - b.score || a.order - b.order);
    // Typed: best match first, in one list. Not typed yet: grouped, in the menu's own order.
    const grouped = !q;
    return ranked
      .map(({ type }) => type)
      .map((type) => ({
        key: type,
        label: TYPES[type].label,
        hint: TYPES[type].hint,
        icon: svg(TYPES[type].icon),
        meta: TYPES[type].markdown,
        group: grouped ? (TYPES[type].media ? "Media" : "Basic blocks") : undefined,
        run: () => applySlash(type),
      }));
  }

  function mentionItems(m: Extract<MenuState, { mode: "mention" }>): MenuItem[] {
    return m.options.map((o) => {
      let icon = "";
      if (o.avatar) {
        const image = typeof o.avatar === "string" ? safeUrl(o.avatar, "src") : "";
        icon = `<span class="${avatarClass({ size: "sm" })}" aria-hidden="true"><span class="ayy-avatar__fallback">${escapeText(avatarInitials(o.label))}</span>${image ? `<img class="ayy-avatar__image" src="${escapeHtml(image)}" alt="">` : ""}</span>`;
      }
      return { key: o.id, label: o.label, hint: o.hint, icon, group: m.source.label, run: () => applyMention(o, m.source) };
    });
  }

  function languageItems(id: string): MenuItem[] {
    const b = blocks[indexOf(id)];
    return blockEditorCodeLanguages.map((l) => ({
      key: `language-${l.id}`,
      label: l.label,
      current: (b?.language ?? "") === l.id,
      run: () => setLanguage(id, l.id),
    }));
  }

  function setLanguage(id: string, language: string): void {
    const i = indexOf(id);
    const b = blocks[i];
    if (!b || (b.language ?? "") === language) return;
    const next = { ...b };
    if (language) next.language = language;
    else delete next.language;
    commit(replaceAt(i, next), null);
  }

  /** Copy what blocks say as plain text (code as it is), for "Copy text" in block actions. */
  function copyBlocks(ids: string[]): void {
    const list = blocks.filter((b) => withKids(ids).includes(b.id));
    const text = list.length === 1 && list[0].type === "code" ? inlineText(list[0].html ?? "") : blockEditorToText(list);
    void navigator.clipboard?.writeText(text).then(
      () => announce("Copied"),
      () => undefined,
    );
  }

  function actionItems(ids: string[], sub?: string): MenuItem[] {
    const list = ids.map((id) => blocks[indexOf(id)]).filter(Boolean);
    const many = list.length > 1;
    const code = list.length === 1 && list[0].type === "code";
    const table = list.length === 1 && list[0].type === "table" ? list[0] : null;
    const items: MenuItem[] = [
      ...(list.some((b) => isText(b.type) || b.type === "table")
        ? [{ key: "copy", label: code ? "Copy code" : "Copy text", icon: svg(Copy01Icon), group: "Actions", run: () => copyBlocks(ids) }]
        : []),
      { key: "duplicate", label: table ? "Duplicate table" : "Duplicate", icon: svg(CopyPlusIcon), meta: "Mod+D", group: "Actions", run: () => duplicate(ids) },
      { key: "up", label: table ? "Move table up" : "Move up", icon: svg(ArrowUp01Icon), meta: "Mod+Shift+ArrowUp", group: "Actions", run: () => moveBlocks(ids, -1) },
      { key: "down", label: table ? "Move table down" : "Move down", icon: svg(ArrowDown01Icon), meta: "Mod+Shift+ArrowDown", group: "Actions", run: () => moveBlocks(ids, 1) },
      { key: "delete", label: many ? `Delete ${list.length} blocks` : table ? "Delete table" : "Delete", icon: svg(Delete02Icon), meta: "Delete", group: "Actions", destructive: true, run: () => removeBlocks(ids) },
    ];
    if (table) {
      const grid = gridOf(table);
      const at = lastCell?.id === table.id ? lastCell : { id: table.id, row: 0, col: 0 };
      const row = Math.min(at.row, grid.length - 1);
      const col = Math.min(at.col, grid[0].length - 1);
      const rows = grid.length;
      const cols = grid[0].length;
      const id = table.id;
      const first = table.header === false ? 0 : 1;
      const left = iconSvg(ArrowLeft01Icon, { directional: true });
      const right = iconSvg(ArrowRight01Icon, { directional: true });
      const thisRow = `Row ${row + 1}`;
      const thisCol = `Column ${col + 1}`;
      const align = table.align?.[col] ?? "start";
      const width = table.widths?.[col] || cellEl(id, 0, col)?.closest("td, th")?.getBoundingClientRect().width || 160;
      const submenus: Record<string, MenuItem[]> = {
        Insert: [
          { key: "row-above", label: "Row above", hint: thisRow, icon: svg(ArrowUp01Icon), disabled: rows >= MAX_ROWS, run: () => insertRow(id, row, col) },
          { key: "row-below", label: "Row below", hint: thisRow, icon: svg(ArrowDown01Icon), disabled: rows >= MAX_ROWS, run: () => insertRow(id, row + 1, col) },
          { key: "column-before", label: "Column before", hint: thisCol, icon: left, disabled: cols >= MAX_COLUMNS, run: () => insertColumn(id, col, row) },
          { key: "column-after", label: "Column after", hint: thisCol, icon: right, disabled: cols >= MAX_COLUMNS, run: () => insertColumn(id, col + 1, row) },
        ],
        Duplicate: [
          { key: "duplicate-row", label: "Row", hint: thisRow, icon: svg(CopyPlusIcon), disabled: rows >= MAX_ROWS, run: () => duplicateRow(id, row, col) },
          { key: "duplicate-column", label: "Column", hint: thisCol, icon: svg(CopyPlusIcon), disabled: cols >= MAX_COLUMNS, run: () => duplicateColumn(id, col, row) },
        ],
        Move: [
          { key: "row-up", label: "Row up", hint: thisRow, meta: "Mod+Shift+ArrowUp", icon: svg(ArrowUp01Icon), disabled: row <= first, run: () => moveRow(id, row, -1) },
          { key: "row-down", label: "Row down", hint: thisRow, meta: "Mod+Shift+ArrowDown", icon: svg(ArrowDown01Icon), disabled: row < first || row >= rows - 1, run: () => moveRow(id, row, 1) },
          { key: "column-earlier", label: "Column earlier", hint: thisCol, meta: "Mod+Shift+ArrowLeft", icon: left, disabled: col <= 0, run: () => moveColumn(id, col, -1) },
          { key: "column-later", label: "Column later", hint: thisCol, meta: "Mod+Shift+ArrowRight", icon: right, disabled: col >= cols - 1, run: () => moveColumn(id, col, 1) },
        ],
        Align: (["start", "center", "end"] as const).map((a) => ({ key: `align-${a}`, label: a === "start" ? "At the start" : a === "center" ? "Centered" : "At the end", hint: thisCol, current: align === a, run: () => alignColumn(id, col, a, row) })),
        Width: [
          { key: "wider", label: "Wider", hint: `${thisCol}, ${Math.round(width)} px`, icon: svg(PlusSignIcon), run: () => sizeColumn(id, col, width + 24, row) },
          { key: "narrower", label: "Narrower", hint: thisCol, icon: svg(Delete02Icon), disabled: width - 24 < MIN_COLUMN, run: () => sizeColumn(id, col, width - 24, row) },
          { key: "even", label: "Even out all columns", disabled: !table.widths?.some(Boolean), run: () => sizeColumn(id, col, 0, row) },
        ],
        Clear: [
          { key: "clear-row", label: "Row", hint: thisRow, run: () => clearCells(id, "row", row, col) },
          { key: "clear-column", label: "Column", hint: thisCol, run: () => clearCells(id, "column", row, col) },
          { key: "clear-table", label: "Every cell", run: () => clearCells(id, "table", row, col) },
        ],
        Delete: [
          { key: "delete-row", label: "Row", hint: thisRow, icon: svg(Delete02Icon), destructive: true, disabled: rows < 2, run: () => deleteRow(id, row) },
          { key: "delete-column", label: "Column", hint: thisCol, icon: svg(Delete02Icon), destructive: true, disabled: cols < 2, run: () => deleteColumn(id, col) },
        ],
      };
      if (sub && submenus[sub]) return [{ key: "back", label: "Back", icon: left, sub: null, run: () => undefined }, ...submenus[sub].filter((item) => !item.disabled).map((item) => ({ ...item, group: sub }))];
      items.unshift(
        ...Object.keys(submenus).map((name) => ({ key: `sub-${name}`, label: name, icon: svg(name === "Delete" ? Delete02Icon : name === "Duplicate" ? CopyPlusIcon : name === "Insert" ? PlusSignIcon : name === "Move" ? ArrowUp01Icon : name === "Align" ? TextIcon : name === "Width" ? ArrowRight01Icon : TextStrikethroughIcon), group: "Table", sub: name, run: () => undefined })),
        { key: "header", label: "Header row", group: "Table", current: table.header !== false, run: () => setTable(id, grid, [row, col], { header: table.header === false }) },
        { key: "header-column", label: "Header column", group: "Table", current: !!table.headerColumn, run: () => setTable(id, grid, [row, col], table.headerColumn ? { headerColumn: false } : { headerColumn: true }) },
      );
    }
    if (code) {
      items.push({ key: "language", label: `Language: ${languageLabel(list[0].language)}`, icon: svg(SourceCodeIcon), group: "Actions", run: () => openActions(ids, els.get(ids[0])?.querySelector<HTMLElement>("[data-code-language]") ?? menuEl, "language") });
    }
    if (list.length && list.every((b) => isText(b.type))) {
      for (const type of blockEditorBlockTypes) {
        if (!isText(type)) continue;
        items.push({ key: `turn-${type}`, label: TYPES[type].label, icon: svg(TYPES[type].icon), group: "Turn into", current: list.every((b) => b.type === type), run: () => turnInto(ids, type) });
      }
    }
    return items;
  }

  const menuOwner = () => (menu && menu.mode !== "actions" ? textEl(menu.id) : menu ? menuEl : null);

  function renderMenu(): void {
    if (!menu) return;
    const m = menu;
    menuItems = m.mode === "slash" ? slashItems(m.query) : m.mode === "mention" ? mentionItems(m) : m.list === "language" ? languageItems(m.ids[0]) : actionItems(m.ids, m.sub);
    if (!menuItems.length) {
      closeMenu();
      return;
    }
    m.index = Math.max(0, Math.min(m.index, menuItems.length - 1));
    menuEl.replaceChildren();
    menuEl.dataset.mode = m.mode === "actions" ? m.list : m.mode;
    menuEl.setAttribute("aria-label", m.mode === "slash" ? "Blocks" : m.mode === "mention" ? (m.source.label ?? "Mentions") : m.list === "language" ? "Code language" : m.sub ? `Block actions: ${m.sub}` : "Block actions");
    let group: string | undefined;
    menuItems.forEach((item, i) => {
      if (item.group && item.group !== group) {
        group = item.group;
        const label = make("div", C.menuLabel, { role: "presentation" });
        label.textContent = group;
        menuEl.append(label);
      }
      const option = make("div", `ayy-combobox__option ${C.option}`, { role: "option", id: `ayy-be-${uid}-option-${i}`, "aria-selected": String(i === m.index), "data-index": String(i) });
      if (item.current) option.setAttribute("data-current", "");
      if (item.destructive) option.setAttribute("data-destructive", "");
      if (item.icon) {
        const icon = make("span", C.optionIcon, { "aria-hidden": "true" });
        icon.innerHTML = item.icon;
        option.append(icon);
      }
      const text = make("span", C.optionText);
      const label = make("span");
      label.textContent = item.label;
      text.append(label);
      if (item.hint) {
        const hintEl = make("span", C.optionHint);
        hintEl.textContent = item.hint;
        text.append(hintEl);
      }
      option.append(text);
      if (item.sub) {
        const more = make("span", "ayy-combobox__meta", { "aria-hidden": "true" });
        more.innerHTML = iconSvg(ArrowRight01Icon, { directional: true });
        option.append(more);
      }
      if (item.meta) {
        const meta = make("span", "ayy-combobox__meta");
        if (m.mode === "actions") meta.innerHTML = shortcutHtml(item.meta, apple);
        else meta.textContent = item.meta;
        option.append(meta);
      }
      menuEl.append(option);
    });
    const owner = menuOwner();
    if (owner && owner !== menuEl) {
      owner.setAttribute("aria-controls", menuEl.id);
      owner.setAttribute("aria-autocomplete", "list");
    }
    owner?.setAttribute("aria-activedescendant", `ayy-be-${uid}-option-${m.index}`);
    if (native) {
      if (!menuEl.matches(":popover-open")) menuEl.showPopover();
    } else menuEl.hidden = false;
    stopMenuPlacing?.();
    const target = m.mode === "actions" ? m.anchor : placeAnchor(m.id, m.start);
    stopMenuPlacing = target ? autoPlace(menuEl, target, { side: "bottom", align: "start", offset: 4 }) : null;
    menuEl.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }

  /** Move the caret anchor over character `offset` of a block, for a menu to hang from. */
  function placeAnchor(id: string, offset: number): HTMLElement | null {
    const el = textEl(id);
    if (!el) return null;
    const range = document.createRange();
    const [n, o] = pointAt(el, offset);
    range.setStart(n, o);
    const [n2, o2] = pointAt(el, offset + 1);
    range.setEnd(n2, o2);
    const rect = range.getClientRects()[0] ?? el.getBoundingClientRect();
    const box = root.getBoundingClientRect();
    anchor.style.left = `${rect.left - box.left}px`;
    anchor.style.top = `${rect.top - box.top}px`;
    anchor.style.height = `${rect.height}px`;
    anchor.style.width = `${Math.max(1, rect.width)}px`;
    return anchor;
  }

  function closeMenu(): void {
    if (!menu) return;
    const was = menu;
    const owner = menuOwner();
    menu = null;
    menuItems = [];
    stopMenuPlacing?.();
    stopMenuPlacing = null;
    owner?.removeAttribute("aria-activedescendant");
    owner?.removeAttribute("aria-controls");
    owner?.removeAttribute("aria-autocomplete");
    if (native) {
      if (menuEl.matches(":popover-open")) menuEl.hidePopover();
    } else menuEl.hidden = true;
    if (was.mode === "actions") was.anchor.setAttribute("aria-expanded", "false");
  }
  const closeTextMenu = () => {
    if (menu && menu.mode !== "actions") closeMenu();
  };

  function moveMenu(step: number): void {
    if (!menu || !menuItems.length) return;
    menu.index = (menu.index + step + menuItems.length) % menuItems.length;
    for (const option of Array.from(menuEl.querySelectorAll<HTMLElement>('[role="option"]'))) option.setAttribute("aria-selected", String(option.dataset.index === String(menu.index)));
    menuOwner()?.setAttribute("aria-activedescendant", `ayy-be-${uid}-option-${menu.index}`);
    menuEl.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }

  function runMenu(index = menu?.index ?? 0): void {
    const item = menuItems[index];
    if (!item || !menu) return;
    if (menu.mode === "actions" && item.sub !== undefined) {
      menu.sub = item.sub ?? undefined;
      menu.index = 0;
      renderMenu();
      return;
    }
    if (menu.mode === "actions") {
      const { ids, list, anchor: from } = menu;
      closeMenu();
      if (list === "language") {
        item.run();
        els.get(ids[0])?.querySelector<HTMLElement>("button[data-code-language]")?.focus({ preventScroll: true });
        return;
      }
      if (picked && ids.length) root.focus({ preventScroll: true });
      void from;
    }
    item.run();
  }

  function openSlash(id: string, start: number, query: string): void {
    const same = menu?.mode === "slash" && menu.id === id && menu.start === start;
    menu = { mode: "slash", id, start, query, index: same && menu ? menu.index : 0 };
    hideToolbar(true);
    renderMenu();
  }

  function openMention(id: string, start: number, query: string, source: BlockEditorMentionSource): void {
    const request = ++mentionRequest;
    const done = (found: BlockEditorMentionOption[]) => {
      if (request !== mentionRequest) return;
      const options = found.slice(0, 8);
      if (!options.length) {
        closeTextMenu();
        return;
      }
      const same = menu?.mode === "mention" && menu.id === id && menu.start === start;
      menu = { mode: "mention", id, start, query, index: same && menu ? menu.index : 0, source, options };
      hideToolbar(true);
      renderMenu();
    };
    const list = source.options;
    if (typeof list === "function") {
      const result = list(query);
      if (result && typeof (result as Promise<BlockEditorMentionOption[]>).then === "function") (result as Promise<BlockEditorMentionOption[]>).then(done, () => closeTextMenu());
      else done(result as BlockEditorMentionOption[]);
    } else {
      const q = query.toLowerCase();
      done(list.filter((o) => !q || `${o.label} ${o.hint ?? ""} ${o.id}`.toLowerCase().includes(q)));
    }
  }

  function openActions(ids: string[], from: HTMLElement, list: "actions" | "language" = "actions"): void {
    closeMenu();
    if (list === "actions") pick(ids[0], ids[ids.length - 1]);
    else unpick();
    menu = { mode: "actions", ids, index: 0, anchor: from, list };
    from.setAttribute("aria-expanded", "true");
    renderMenu();
    if (list === "language") moveMenu(Math.max(0, menuItems.findIndex((item) => item.current)) - menu.index);
    menuEl.focus({ preventScroll: true });
  }

  /** What follows the caret: a mention trigger or a "/" opens its menu (never inside a word, an email address or a URL). */
  function detectMenus(el: HTMLElement): void {
    const id = idOf(el);
    const b = blocks[indexOf(id)];
    const at = selectionIn(el);
    if (!b || b.type === "code" || !at || at.start !== at.end || readOnly()) {
      closeTextMenu();
      return;
    }
    const before = textOf(el).slice(0, at.start);
    let found: { start: number; query: string; source?: BlockEditorMentionSource } | null = null;
    for (const source of opts.mentions ?? []) {
      const index = before.lastIndexOf(source.trigger);
      if (index < 0) continue;
      const prev = index > 0 ? before[index - 1] : "";
      if (prev && !/[\s([{"'«„ ]/.test(prev)) continue;
      const query = before.slice(index + source.trigger.length);
      if (/\n/.test(query) || /^\s/.test(query) || (query.match(/\s/g)?.length ?? 0) > 1 || query.length > 40) continue;
      if (!found || index > found.start) found = { start: index, query, source };
    }
    if (!found) {
      const index = before.lastIndexOf("/");
      const query = before.slice(index + 1);
      if (index >= 0 && (index === 0 || /[\s ]/.test(before[index - 1])) && !/[\s ]/.test(query) && query.length <= 24) found = { start: index, query };
    }
    if (!found) {
      dismissed = null;
      closeTextMenu();
      return;
    }
    if (dismissed && dismissed.id === id && dismissed.start === found.start) return;
    dismissed = null;
    if (found.source) openMention(id, found.start, found.query, found.source);
    else openSlash(id, found.start, found.query);
  }

  function applySlash(type: BlockEditorBlockType): void {
    if (!menu || menu.mode !== "slash") return;
    const { id, start, query } = menu;
    closeMenu();
    const i = indexOf(id);
    const b = blocks[i];
    if (!b) return;
    const html = sliceHtml(b.html ?? "", 0, start) + sliceHtml(b.html ?? "", start + 1 + query.length);
    const empty = !inlineText(html).trim() && !html.includes(C.mention);
    if (isText(type)) {
      commit(replaceAt(i, asType({ ...b, html }, type)), { id, start });
      return;
    }
    const made = blockEditorBlock(type);
    // A divider is followed by a line to write in; so is a table that would otherwise end the document.
    const after = type === "divider" || (type === "table" && i === blocks.length - 1) ? [blockEditorBlock("text")] : [];
    const kept = empty ? [] : [{ ...b, html }];
    commit(replaceAt(i, ...kept, made, ...after), type === "divider" ? { id: after[0].id, start: 0 } : { id: made.id, start: 0 });
  }

  function applyMention(option: BlockEditorMentionOption, source: BlockEditorMentionSource): void {
    if (!menu || menu.mode !== "mention") return;
    const { id, start, query } = menu;
    closeMenu();
    const i = indexOf(id);
    const b = blocks[i];
    if (!b) return;
    const after = sliceHtml(b.html ?? "", start + source.trigger.length + query.length);
    const gap = /^[\s ]/.test(inlineText(after)) ? "" : " ";
    const html = sliceHtml(b.html ?? "", 0, start) + blockEditorMentionHtml({ trigger: source.trigger, id: option.id, label: option.label }) + gap + after;
    commit(replaceAt(i, { ...b, html }), { id, start: start + source.trigger.length + option.label.length + 1 });
  }

  // ---- The formatting bar ----

  const closestLink = (node: Node | null | undefined) => {
    const a = (isElement(node) ? node : node?.parentElement)?.closest("a") ?? null;
    return a && textHost(a) ? a : null;
  };
  const inCode = (node: Node | null | undefined) => !!(isElement(node) ? node : node?.parentElement)?.closest("code");

  function scheduleToolbar(): void {
    cancelAnimationFrame(toolbarFrame);
    toolbarFrame = requestAnimationFrame(updateToolbar);
  }

  function showToolbar(rect: DOMRect, mode: "format" | "link"): void {
    const box = root.getBoundingClientRect();
    anchor.style.left = `${rect.left - box.left}px`;
    anchor.style.top = `${rect.top - box.top}px`;
    anchor.style.width = `${Math.max(1, rect.width)}px`;
    anchor.style.height = `${Math.max(1, rect.height)}px`;
    toolbar.dataset.mode = mode;
    formatGroup.hidden = mode === "link";
    linkForm.hidden = mode !== "link";
    if (native) {
      if (!toolbar.matches(":popover-open")) toolbar.showPopover();
    } else toolbar.hidden = false;
    toolbarShown = true;
    stopToolbarPlacing?.();
    stopToolbarPlacing = autoPlace(toolbar, anchor, { side: "top", align: "center", offset: 8 });
  }

  function hideToolbar(force = false): void {
    if (!toolbarShown) return;
    if (!force && toolbar.contains(document.activeElement)) return;
    toolbarShown = false;
    stopToolbarPlacing?.();
    stopToolbarPlacing = null;
    if (native) {
      if (toolbar.matches(":popover-open")) toolbar.hidePopover();
    } else toolbar.hidden = true;
  }

  function updateToolbar(): void {
    if (toolbar.contains(document.activeElement)) return;
    const sel = window.getSelection();
    if (readOnly() || pressing || picked || menu || !sel || !sel.rangeCount || !sel.anchorNode || !sel.focusNode) return hideToolbar(true);
    const a = textHost(sel.anchorNode) ?? (spanning && root.contains(sel.anchorNode) ? root : null);
    const f = textHost(sel.focusNode) ?? (spanning && root.contains(sel.focusNode) ? root : null);
    if (!a || !f) return hideToolbar(true);
    const code = [a, f].some((el) => el !== root && blocks[indexOf(idOf(el))]?.type === "code");
    if (code) return hideToolbar(true);
    const range = sel.getRangeAt(0);
    lastRange = range.cloneRange();
    if (sel.isCollapsed) {
      // A caret inside a link (not at its edge, where typing just goes on) shows the link's address.
      const link = closestLink(sel.anchorNode);
      const at = link ? offsetIn(link, sel.anchorNode, sel.anchorOffset) : 0;
      if (!link || at === 0 || at >= textOf(link).length) return hideToolbar(true);
      linkInput.value = link.getAttribute("href") ?? "";
      openLinkButton.hidden = false;
      unlinkButton.hidden = false;
      showToolbar(link.getBoundingClientRect(), "link");
      return;
    }
    for (const button of Array.from(formatGroup.querySelectorAll<HTMLElement>("[data-command]"))) {
      const command = button.dataset.command ?? "";
      const on = command === "link" ? !!closestLink(sel.anchorNode) : !!markOf(sel.anchorNode, command) && !!markOf(sel.focusNode, command);
      button.setAttribute("aria-pressed", String(on));
      button.toggleAttribute("disabled", spanning && command === "link");
    }
    showToolbar(range.getBoundingClientRect(), "format");
  }

  function openLinkForm(): void {
    const sel = window.getSelection();
    if (sel?.rangeCount && root.contains(sel.anchorNode)) lastRange = sel.getRangeAt(0).cloneRange();
    if (!lastRange) return;
    const link = closestLink(lastRange.startContainer);
    linkInput.value = link?.getAttribute("href") ?? "";
    openLinkButton.hidden = !link;
    unlinkButton.hidden = !link;
    const rect = lastRange.collapsed && link ? link.getBoundingClientRect() : (lastRange.getClientRects()[0] ?? lastRange.getBoundingClientRect());
    showToolbar(rect, "link");
    linkInput.removeAttribute("aria-invalid");
    linkInput.focus();
    linkInput.select();
  }

  /** Put the remembered selection back in its line (after the link field took focus). */
  function restoreRange(): HTMLElement | null {
    const range = lastRange;
    if (!range) return null;
    const host = textHost(range.startContainer);
    if (!host) return null;
    host.focus({ preventScroll: true });
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    return host;
  }

  function applyLink(raw: string): void {
    const host = restoreRange();
    hideToolbar(true);
    if (!host) return;
    const sel = window.getSelection();
    const link = closestLink(sel?.anchorNode);
    if (sel && link && sel.isCollapsed) {
      const range = document.createRange();
      range.selectNodeContents(link);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    const url = safeUrl(raw);
    if (url) document.execCommand("createLink", false, url);
    else document.execCommand("unlink");
    sel?.collapseToEnd();
  }

  /** The mark element of kind `tag` (strong, em, u, s, code) around `node`, inside its line. */
  function markOf(node: Node | null | undefined, tag: string): HTMLElement | null {
    const host = textHost(node);
    for (let el = isElement(node) ? node : (node?.parentElement ?? null); el && el !== host && host; el = el.parentElement) {
      if (MARKS[tag]?.includes(el.tagName)) return el;
    }
    return null;
  }

  /** Wrap `range` (inside one line) in a fresh mark, dissolving marks of the same kind inside it. */
  function wrapRange(range: Range, tag: string): HTMLElement {
    const content = range.extractContents();
    for (const inner of Array.from(content.querySelectorAll(MARKS[tag].join(",")))) inner.replaceWith(...Array.from(inner.childNodes));
    const mark = document.createElement(tag);
    mark.append(content);
    range.insertNode(mark);
    return mark;
  }

  /** Take `range` out of the mark around it, keeping the mark on the text before and after. */
  function unwrapRange(range: Range, mark: HTMLElement): void {
    const before = document.createRange();
    before.setStart(mark, 0);
    before.setEnd(range.startContainer, range.startOffset);
    const head = before.extractContents();
    const after = document.createRange();
    after.setStart(range.endContainer, range.endOffset);
    after.setEnd(mark, mark.childNodes.length);
    const tail = after.extractContents();
    if (textOf(head) || head.querySelector?.(`.${C.mention}`)) {
      const copy = mark.cloneNode(false) as HTMLElement;
      copy.append(head);
      mark.before(copy);
    }
    if (textOf(tail) || tail.querySelector?.(`.${C.mention}`)) {
      const copy = mark.cloneNode(false) as HTMLElement;
      copy.append(tail);
      mark.after(copy);
    }
    mark.replaceWith(...Array.from(mark.childNodes));
  }

  /**
   * Bold, italic, underline, strikethrough and code: on when all the selected text has the mark, off otherwise. Done on
   * the DOM rather than with execCommand, which reads the computed style (bold in a heading would turn it off) and
   * writes style attributes. Works across blocks too.
   */
  function toggleMark(tag: string): void {
    const sel = window.getSelection();
    if (!sel?.rangeCount || sel.isCollapsed) return;
    let pieces: { el: HTMLElement; range: Range }[] = [];
    let restore: [Point, Point] | null = null;
    if (spanning) {
      const span = spanOf();
      if (!span) return;
      restore = span;
      for (let index = span[0].index; index <= span[1].index; index++) {
        const b = blocks[index];
        const el = b && b.type !== "code" ? textEl(b.id) : null;
        if (!el) continue;
        const range = document.createRange();
        const [sn, so] = index === span[0].index ? pointAt(el, span[0].offset) : [el as Node, 0];
        const [en, eo] = index === span[1].index ? pointAt(el, span[1].offset) : [el as Node, el.childNodes.length];
        range.setStart(sn, so);
        range.setEnd(en, eo);
        if (!range.collapsed && range.toString().replace(ZW_RE, "")) pieces.push({ el, range });
      }
    } else {
      const el = textHost(sel.anchorNode);
      if (!el || textHost(sel.focusNode) !== el || blocks[indexOf(idOf(el))]?.type === "code") return;
      const at = selectionIn(el);
      if (at) restore = [{ index: indexOf(idOf(el)), offset: at.start }, { index: indexOf(idOf(el)), offset: at.end }];
      pieces = [{ el, range: sel.getRangeAt(0).cloneRange() }];
    }
    if (!pieces.length) return;
    const on = pieces.every(({ range }) => {
      const a = markOf(range.startContainer, tag);
      return !!a && a === markOf(range.endContainer, tag);
    });
    pushHistory();
    typing = null;
    for (const { range } of pieces) {
      if (on) unwrapRange(range, markOf(range.startContainer, tag)!);
      else wrapRange(range, tag);
    }
    for (const { el } of pieces) {
      el.normalize();
      syncText(el, "none");
    }
    if (restore) {
      const from = domPoint(restore[0]);
      const to = domPoint(restore[1]);
      if (from && to) sel.setBaseAndExtent(from[0], from[1], to[0], to[1]);
    }
    emit();
    scheduleToolbar();
  }

  /** "**bold**", "*italic*", "~~strike~~", "`code`" turn into formatting as the closing mark is typed. */
  function autoformat(el: HTMLElement): void {
    const sel = window.getSelection();
    if (!sel?.isCollapsed || !sel.anchorNode || sel.anchorNode.nodeType !== 3 || inCode(sel.anchorNode)) return;
    const node = sel.anchorNode as Text;
    const caret = sel.anchorOffset;
    const before = node.data.slice(0, caret);
    const rules: [RegExp, string, number][] = [
      [/`([^`\n]+)`$/, "code", 1],
      [/\*\*([^*\s](?:[^*\n]*[^*\s])?)\*\*$/, "strong", 2],
      [/~~([^~\s](?:[^~\n]*[^~\s])?)~~$/, "s", 2],
      [/(?:^|[^*\w])\*([^*\s](?:[^*\n]*[^*\s])?)\*$/, "em", 1],
      [/(?:^|[^_\w])_([^_\s](?:[^_\n]*[^_\s])?)_$/, "em", 1],
    ];
    for (const [re, tag, marks] of rules) {
      const m = before.match(re);
      if (!m) continue;
      const inner = m[1].replace(ZW_RE, "");
      if (!inner) continue;
      const start = caret - m[1].length - marks * 2;
      if (start < 0) continue;
      pushHistory();
      typing = null;
      node.splitText(caret);
      const token = node.splitText(start);
      const mark = document.createElement(tag);
      mark.textContent = inner;
      const after = document.createTextNode(ZW);
      token.replaceWith(mark, after);
      if (!node.data) node.remove();
      sel.collapse(after, 1);
      syncText(el, "none");
      return;
    }
  }

  // ---- Media ----

  const kindOf = (file: File): BlockEditorBlockType => (file.type.startsWith("image/") ? "image" : /^(video|audio)\//.test(file.type) ? "embed" : "file");

  async function upload(file: File): Promise<string> {
    const url = opts.upload ? await opts.upload(file) : await readFile(file);
    return safeUrl(url, "src") || safeUrl(url);
  }

  /** Upload files into new blocks after block `index` (or into `fill`, an empty text or media block). */
  function insertFiles(files: File[], index: number, fill?: string): void {
    if (!files.length) return;
    const made = files.map((file) => blockEditorBlock(kindOf(file), kindOf(file) === "file" ? { name: file.name, size: file.size } : {}));
    for (const b of made) uploading.add(b.id);
    const fillAt = fill ? indexOf(fill) : -1;
    const next = blocks.slice();
    if (fillAt >= 0) next.splice(fillAt, 1, ...made);
    else next.splice(index + 1, 0, ...made);
    if (!isText(next[next.length - 1].type)) next.push(blockEditorBlock());
    commit(next, { pick: [made[0].id, made[made.length - 1].id] });
    files.forEach((file, n) => void fillFrom(made[n].id, file));
  }

  async function fillFrom(id: string, file: File): Promise<void> {
    uploading.add(id);
    const busy = indexOf(id);
    if (busy >= 0) render();
    let src = "";
    try {
      src = await upload(file);
    } catch {
      src = "";
    }
    uploading.delete(id);
    const i = indexOf(id);
    if (i < 0) return;
    const b = blocks[i];
    if (!src) {
      announce(`Couldn't upload ${file.name}`);
      render();
      return;
    }
    const filled: BlockEditorBlock = { ...b, src, ...(b.type === "file" ? { name: b.name ?? file.name, size: b.size ?? file.size } : {}) };
    blocks = replaceAt(i, filled);
    render();
    emit();
  }

  function applyMediaLink(id: string, raw: string, input: HTMLInputElement): void {
    const i = indexOf(id);
    const b = blocks[i];
    if (!b) return;
    const url = b.type === "file" ? safeUrl(raw) : safeUrl(raw, "src") || safeUrl(raw);
    if (!url || (b.type === "embed" && !blockEditorEmbed(url))) {
      input.setAttribute("aria-invalid", "true");
      return;
    }
    const filled: BlockEditorBlock = { ...b, src: url };
    if (b.type === "file") filled.name = decodeURIComponent(url.split(/[?#]/)[0].split("/").pop() || "") || url;
    const next = replaceAt(i, filled);
    let after = next[i + 1];
    if (!after || !isText(after.type)) {
      after = blockEditorBlock();
      next.splice(i + 1, 0, after);
    }
    commit(next, { id: after.id, start: 0 });
  }

  function chooseFile(id: string): void {
    const b = blocks[indexOf(id)];
    if (!b) return;
    fileTarget = id;
    fileInput.accept = b.type === "image" ? "image/*" : b.type === "embed" ? "video/*,audio/*" : "";
    fileInput.value = "";
    fileInput.click();
  }

  let resizing: { id: string; frame: HTMLElement; start: number; column: number; rtl: boolean; width: number } | null = null;
  /** A table column being dragged to a new width: the widths of every column when it started, and the <col>s to show it live. */
  let sizing: { id: string; col: number; start: number; rtl: boolean; widths: number[]; cols: HTMLElement[]; table: HTMLElement; width: number } | null = null;

  function setWidth(id: string, width: number, history = true): void {
    const i = indexOf(id);
    const b = blocks[i];
    if (!b) return;
    const clamped = Math.max(20, Math.min(100, Math.round(width)));
    const next = { ...b };
    if (clamped < 100) next.width = clamped;
    else delete next.width;
    if (next.width === b.width) return;
    commit(replaceAt(i, next), null, history);
  }

  // ---- Keys ----

  function goTo(index: number, edge: "start" | "end", x?: number): void {
    const target = blocks[index];
    if (!target) return;
    if (target.type === "table") {
      applyFocus({ id: target.id, start: edge === "start" ? 0 : "end" });
      return;
    }
    const el = textEl(target.id);
    if (!el) {
      pick(target.id, target.id);
      return;
    }
    if (x !== undefined) {
      const box = el.getBoundingClientRect();
      const line = lineHeight(el);
      const hit = caretAt(x, edge === "start" ? box.top + line / 2 : box.bottom - line / 2);
      if (hit && el.contains(hit[0])) {
        selectText(el, offsetIn(el, hit[0], hit[1]));
        return;
      }
    }
    selectText(el, edge === "start" ? 0 : textOf(el).length);
  }

  /**
   * Put plain text at the caret of a line. Newlines go in as "\n" text: execCommand("insertText", "\n") sometimes
   * splits the line into <div>s instead (Chrome, plaintext-only), and then the break is lost.
   */
  function insertPlain(el: HTMLElement, text: string): void {
    const sel = window.getSelection();
    if (!sel?.rangeCount || !el.contains(sel.anchorNode)) return;
    beforeFocus = focusNow();
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const node = document.createTextNode(text);
    range.insertNode(node);
    const at = offsetIn(el, node, node.length);
    el.normalize();
    syncText(el);
    selectText(el, at);
    if (!root.hasAttribute("data-typing")) root.setAttribute("data-typing", "");
    emit();
  }

  function onTextKey(e: KeyboardEvent, el: HTMLElement): void {
    if (e.isComposing || e.keyCode === 229) return;
    const id = idOf(el);
    const i = indexOf(id);
    const b = blocks[i];
    if (!b) return;
    const mod = isMod(e);
    const key = e.key.toLowerCase();

    if (menu && menu.mode !== "actions" && menu.id === id) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        moveMenu(e.key === "ArrowDown" ? 1 : -1);
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        runMenu();
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        dismissed = { id, start: menu.start };
        closeMenu();
        return;
      }
    }

    if (mod && key === "z") {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
      return;
    }
    if (mod && key === "y") {
      e.preventDefault();
      redo();
      return;
    }
    if (mod && e.shiftKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      e.preventDefault();
      moveBlocks([id], e.key === "ArrowUp" ? -1 : 1);
      return;
    }
    if (mod && !e.shiftKey && key === "d") {
      e.preventDefault();
      duplicate([id]);
      return;
    }
    if (mod && key === "/") {
      e.preventDefault();
      openActions([id], els.get(id)?.querySelector<HTMLElement>(`.${C.handle}`) ?? el);
      return;
    }
    if (mod && e.altKey && /^Digit[0-8]$/.test(e.code)) {
      const type = (["text", "heading-1", "heading-2", "heading-3", "todo", "bullet", "number", "quote", "code"] as const)[Number(e.code.slice(5))];
      e.preventDefault();
      turnInto([id], type);
      return;
    }
    if (mod && e.key === "Enter" && b.type === "todo") {
      e.preventDefault();
      commit(replaceAt(i, { ...b, checked: !b.checked }), focusNow());
      return;
    }
    if (mod && e.key === "Enter" && b.type === "toggle") {
      e.preventDefault();
      setOpen(id, !b.open);
      return;
    }
    if (b.type !== "code" && mod && !e.altKey) {
      const tag = !e.shiftKey && key === "b" ? "strong" : !e.shiftKey && key === "i" ? "em" : !e.shiftKey && key === "u" ? "u" : e.shiftKey && (key === "s" || key === "x") ? "s" : !e.shiftKey && key === "e" ? "code" : "";
      if (tag) {
        e.preventDefault();
        toggleMark(tag);
        return;
      }
      if (!e.shiftKey && key === "k") {
        e.preventDefault();
        openLinkForm();
        return;
      }
    }

    const text = textOf(el);
    const sel = selectionIn(el) ?? { start: text.length, end: text.length };
    const collapsed = sel.start === sel.end;
    const rtl = getComputedStyle(el).direction === "rtl";

    // Select all: the line first, then every block (Notion).
    if (mod && key === "a" && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      if (blocks.length > 1 && sel.start === 0 && sel.end === text.length) pick(blocks[0].id, blocks[blocks.length - 1].id);
      else selectText(el, 0, text.length);
      return;
    }

    // Shift+arrows past the edge of a block carry the selection into the next one.
    if (e.shiftKey && !mod && !e.altKey && e.key.startsWith("Arrow")) {
      const s = window.getSelection();
      const a = s?.anchorNode ? pointOf(s.anchorNode, s.anchorOffset) : null;
      const h = s?.focusNode ? pointOf(s.focusNode, s.focusOffset) : null;
      if (a && h) {
        const forward = e.key === (rtl ? "ArrowLeft" : "ArrowRight");
        const back = e.key === (rtl ? "ArrowRight" : "ArrowLeft");
        const above = stepVisible(i, -1);
        const below = stepVisible(i, 1);
        const target =
          e.key === "ArrowUp" && onFirstLine(el) && above >= 0
            ? pointNear(above, "bottom")
            : e.key === "ArrowDown" && onLastLine(el) && below >= 0
              ? pointNear(below, "top")
              : back && h.offset === 0 && above >= 0
                ? { index: above, offset: lengthOf(above) }
                : forward && h.offset === text.length && below >= 0
                  ? { index: below, offset: 0 }
                  : null;
        if (target) {
          e.preventDefault();
          spanTo(a, target);
          return;
        }
      }
    }

    if (e.key === "Enter") {
      if (b.type === "code") {
        e.preventDefault();
        if (mod) {
          const after = blockEditorBlock();
          commit(replaceAt(i, b, after), { id: after.id, start: 0 });
        } else insertPlain(el, "\n");
        return;
      }
      e.preventDefault();
      if (e.shiftKey) {
        insertPlain(el, "\n");
        return;
      }
      const depth = b.indent ?? 0;
      if (!text && !el.querySelector(`.${C.mention}`)) {
        if (depth > 0 && INDENTABLE.includes(b.type)) {
          indentBlocks([id], -1);
          return;
        }
        if (b.type !== "text" && !b.type.startsWith("heading")) {
          commit(replaceAt(i, asType(b, "text")), { id, start: 0 });
          return;
        }
      }
      const nextType: BlockEditorBlockType = isList(b.type) ? b.type : "text";
      const keepDepth = depth && INDENTABLE.includes(nextType) ? { indent: depth } : {};
      if (collapsed && sel.start === 0 && text) {
        const above = blockEditorBlock(isList(b.type) ? b.type : "text", keepDepth);
        commit(replaceAt(i, above, b), { id, start: 0 });
        return;
      }
      const html = b.html ?? "";
      if (b.type === "toggle") {
        // An open toggle's new line goes inside it, first; a closed one's goes after what it hides.
        const head = { ...b, html: sliceHtml(html, 0, sel.start) };
        const tail = sliceHtml(html, sel.end);
        const next = blocks.slice();
        let at = i + 1;
        if (!b.open) while (at < next.length && (next[at].indent ?? 0) > depth) at++;
        const inside = b.open ? Math.min(MAX_INDENT, depth + 1) : depth;
        const after = blockEditorBlock("text", { html: tail, ...(inside ? { indent: inside } : {}) });
        next[i] = head;
        next.splice(at, 0, after);
        commit(next, { id: after.id, start: 0 });
        return;
      }
      const after = blockEditorBlock(nextType, { html: sliceHtml(html, sel.end), ...keepDepth });
      commit(replaceAt(i, { ...b, html: sliceHtml(html, 0, sel.start) }, after), { id: after.id, start: 0 });
      return;
    }

    if (e.key === "Backspace" && collapsed && sel.start === 0 && !mod && !e.altKey) {
      if (b.type !== "text") {
        e.preventDefault();
        commit(replaceAt(i, asType(b, "text")), { id, start: 0 });
        return;
      }
      if ((b.indent ?? 0) > 0) {
        e.preventDefault();
        indentBlocks([id], -1);
        return;
      }
      if (i === 0) return;
      e.preventDefault();
      if (hiddenIds.has(blocks[i - 1].id)) return;
      const prev = blocks[i - 1];
      if (prev.type === "divider") {
        const next = blocks.slice();
        next.splice(i - 1, 1);
        commit(next, { id, start: 0 });
      } else if (!isText(prev.type)) {
        if (!text && !el.querySelector(`.${C.mention}`)) {
          const next = blocks.slice();
          next.splice(i, 1);
          commit(next, { pick: [prev.id, prev.id] });
        } else pick(prev.id, prev.id);
      } else {
        const length = lengthOf(i - 1);
        const merged = prev.type === "code" ? escapeHtml(inlineText(prev.html ?? "") + text) : (prev.html ?? "") + (b.html ?? "");
        const next = blocks.slice();
        next.splice(i - 1, 2, { ...prev, html: merged });
        commit(next, { id: prev.id, start: length });
      }
      return;
    }

    if (e.key === "Delete" && collapsed && sel.start === text.length && i < blocks.length - 1 && !mod) {
      e.preventDefault();
      const nextBlock = blocks[i + 1];
      if (hiddenIds.has(nextBlock.id)) return;
      if (nextBlock.type === "divider") {
        const next = blocks.slice();
        next.splice(i + 1, 1);
        commit(next, { id, start: text.length });
      } else if (!isText(nextBlock.type)) pick(nextBlock.id, nextBlock.id);
      else {
        const html = b.type === "code" ? escapeHtml(text + inlineText(nextBlock.html ?? "")) : (b.html ?? "") + (nextBlock.type === "code" ? escapeText(inlineText(nextBlock.html ?? "")) : (nextBlock.html ?? ""));
        const next = blocks.slice();
        next.splice(i, 2, { ...b, html });
        commit(next, { id, start: text.length });
      }
      return;
    }

    if (e.key === "Tab" && !mod && !e.altKey) {
      e.preventDefault();
      if (b.type === "code") {
        if (!e.shiftKey) insertPlain(el, "  ");
        return;
      }
      indentBlocks([id], e.shiftKey ? -1 : 1);
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      pick(id, id);
      return;
    }

    if (e.shiftKey || mod || e.altKey) return;
    const x = caretRect()?.left;
    const forward = e.key === (rtl ? "ArrowLeft" : "ArrowRight");
    const back = e.key === (rtl ? "ArrowRight" : "ArrowLeft");
    const above = stepVisible(i, -1);
    const below = stepVisible(i, 1);
    if (e.key === "ArrowUp" && above >= 0 && onFirstLine(el)) {
      e.preventDefault();
      goTo(above, "end", x);
    } else if (e.key === "ArrowDown" && below >= 0 && onLastLine(el)) {
      e.preventDefault();
      goTo(below, "start", x);
    } else if (back && collapsed && sel.start === 0 && above >= 0) {
      e.preventDefault();
      goTo(above, "end");
    } else if (forward && collapsed && sel.end === text.length && below >= 0) {
      e.preventDefault();
      goTo(below, "start");
    }
  }

  function onPickedKey(e: KeyboardEvent): void {
    const range = pickedRange();
    if (!picked || !range) return;
    const [from, to] = range;
    const ids = pickedIds();
    const key = e.key.toLowerCase();
    const mod = isMod(e);
    const list = blocks.slice(from, to + 1);
    if (e.key === "Escape") {
      e.preventDefault();
      unpick();
    } else if (e.key === "Enter" && !mod) {
      e.preventDefault();
      const last = blocks[to];
      if (isText(last.type)) applyFocus({ id: last.id, start: "end" });
      else {
        const after = blockEditorBlock();
        const next = blocks.slice();
        next.splice(to + 1, 0, after);
        picked = null;
        commit(next, { id: after.id, start: 0 });
      }
    } else if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      removeBlocks(ids);
    } else if (mod && key === "a") {
      e.preventDefault();
      pick(blocks[0].id, blocks[blocks.length - 1].id);
    } else if (mod && (key === "c" || key === "x")) {
      // No preventDefault: the browser's copy event carries the blocks; without one (WebKit, nothing selected) the async clipboard does.
      copied = false;
      window.setTimeout(() => {
        if (!copied) void navigator.clipboard?.writeText(blockEditorToMarkdown(list)).catch(() => undefined);
        if (key === "x") removeBlocks(ids);
      }, 0);
    } else if (mod && key === "v") {
      // Swap the selection for an empty line and focus it before the paste lands, so the line's own paste handling takes it.
      const fresh = blockEditorBlock();
      const next = blocks.slice();
      next.splice(from, to - from + 1, fresh);
      picked = null;
      commit(next, { id: fresh.id, start: 0 });
    } else if (mod && (key === "z" || key === "y")) {
      e.preventDefault();
      unpick();
      if (key === "y" || e.shiftKey) redo();
      else undo();
    } else if (mod && !e.shiftKey && key === "d") {
      e.preventDefault();
      duplicate(ids);
    } else if (mod && key === "/") {
      e.preventDefault();
      openActions(ids, els.get(picked.head)?.querySelector<HTMLElement>(`.${C.handle}`) ?? els.get(picked.head)!);
    } else if (mod && e.altKey && /^Digit[0-8]$/.test(e.code)) {
      e.preventDefault();
      turnInto(ids, (["text", "heading-1", "heading-2", "heading-3", "todo", "bullet", "number", "quote", "code"] as const)[Number(e.code.slice(5))]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      indentBlocks(ids, e.shiftKey ? -1 : 1);
    } else if ((e.key === "ArrowUp" || e.key === "ArrowDown") && mod && e.shiftKey) {
      e.preventDefault();
      moveBlocks(ids, e.key === "ArrowUp" ? -1 : 1);
    } else if ((e.key === "ArrowUp" || e.key === "ArrowDown") && !mod && !e.altKey) {
      e.preventDefault();
      const head = indexOf(picked.head);
      const step = stepVisible(head, e.key === "ArrowUp" ? -1 : 1);
      const target = blocks[step < 0 ? head : step];
      if (e.shiftKey) pick(picked.anchor, target.id);
      else pick(target.id, target.id);
    } else if (e.key.length === 1 && !mod && !e.altKey && !e.isComposing && list.every((b) => isText(b.type))) {
      e.preventDefault();
      const fresh = blockEditorBlock("text", { html: escapeText(e.key) });
      const next = blocks.slice();
      next.splice(from, to - from + 1, fresh);
      picked = null;
      commit(next, { id: fresh.id, start: 1 });
    }
  }

  function onSpanKey(e: KeyboardEvent): void {
    const key = e.key.toLowerCase();
    const mod = isMod(e);
    const span = spanOf();
    if (!span) return;
    if (e.key === "Escape") {
      e.preventDefault();
      hideToolbar(true);
      const sel = window.getSelection();
      if (span[0].index === span[1].index) {
        setSpanning(false);
        pick(blocks[span[0].index].id, blocks[span[0].index].id);
        return;
      }
      if (sel?.focusNode) sel.collapse(sel.focusNode, sel.focusOffset);
      settle();
    } else if (mod && key === "a") {
      e.preventDefault();
      pick(blocks[0].id, blocks[blocks.length - 1].id);
    } else if (mod && (key === "z" || key === "y")) {
      e.preventDefault();
      setSpanning(false);
      if (key === "y" || e.shiftKey) redo();
      else undo();
    } else if (mod && !e.altKey && ["b", "i", "u", "e"].includes(key) && !e.shiftKey) {
      e.preventDefault();
      toggleMark(key === "b" ? "strong" : key === "i" ? "em" : key === "u" ? "u" : "code");
    } else if (mod && e.shiftKey && (key === "s" || key === "x")) {
      e.preventDefault();
      toggleMark("s");
    } else if (e.key === "Tab" || (mod && (key === "k" || key === "d"))) {
      e.preventDefault();
    }
  }

  // ---- Tables ----

  /** A table's cells with what belongs to each column, to change as one: widths (0: share what's left) and alignment. */
  interface Tbl {
    rows: string[][];
    widths: number[];
    align: BlockEditorTableAlign[];
  }
  const tblOf = (b: BlockEditorBlock): Tbl => {
    const rows = gridOf(b);
    return { rows, widths: rows[0].map((_, c) => b.widths?.[c] ?? 0), align: rows[0].map((_, c) => b.align?.[c] ?? "start") };
  };

  /** Change a table and put the caret in `cell` afterwards. */
  function setTable(id: string, t: Tbl | string[][], cell: [number, number], extra: Partial<BlockEditorBlock> = {}): void {
    const i = indexOf(id);
    const b = blocks[i];
    if (!b) return;
    const rows = Array.isArray(t) ? t : t.rows;
    const columns = rows[0].length;
    const widths = Array.from({ length: columns }, (_, c) => (Array.isArray(t) ? b.widths?.[c] : t.widths[c]) ?? 0);
    const align = Array.from({ length: columns }, (_, c) => (Array.isArray(t) ? b.align?.[c] : t.align[c]) ?? "start");
    const next: BlockEditorBlock = { ...b, ...extra, rows };
    if (widths.some(Boolean)) next.widths = widths;
    else delete next.widths;
    if (align.some((a) => a !== "start")) next.align = align;
    else delete next.align;
    commit(replaceAt(i, next), { id, cell, start: 0 });
  }
  function insertRow(id: string, at: number, col = 0): void {
    const b = blocks[indexOf(id)];
    const t = tblOf(b);
    if (!b || t.rows.length >= MAX_ROWS) return;
    t.rows.splice(at, 0, t.rows[0].map(() => ""));
    setTable(id, t, [at, Math.min(col, t.rows[0].length - 1)]);
    announce(`Row ${at + 1} added`);
  }
  function insertColumn(id: string, at: number, row = 0): void {
    const b = blocks[indexOf(id)];
    const t = tblOf(b);
    if (!b || t.rows[0].length >= MAX_COLUMNS) return;
    for (const r of t.rows) r.splice(at, 0, "");
    t.widths.splice(at, 0, 0);
    t.align.splice(at, 0, "start");
    setTable(id, t, [Math.min(row, t.rows.length - 1), at]);
    announce(`Column ${at + 1} added`);
  }
  function deleteRow(id: string, at: number): void {
    const t = tblOf(blocks[indexOf(id)]);
    if (t.rows.length < 2) return;
    t.rows.splice(at, 1);
    setTable(id, t, [Math.min(at, t.rows.length - 1), 0]);
    announce("Row deleted");
  }
  function deleteColumn(id: string, at: number): void {
    const t = tblOf(blocks[indexOf(id)]);
    if (t.rows[0].length < 2) return;
    for (const r of t.rows) r.splice(at, 1);
    t.widths.splice(at, 1);
    t.align.splice(at, 1);
    setTable(id, t, [0, Math.min(at, t.rows[0].length - 1)]);
    announce("Column deleted");
  }
  function duplicateRow(id: string, at: number, col = 0): void {
    const t = tblOf(blocks[indexOf(id)]);
    if (t.rows.length >= MAX_ROWS) return;
    t.rows.splice(at + 1, 0, t.rows[at].slice());
    setTable(id, t, [at + 1, col]);
    announce(`Row ${at + 1} duplicated`);
  }
  function duplicateColumn(id: string, at: number, row = 0): void {
    const t = tblOf(blocks[indexOf(id)]);
    if (t.rows[0].length >= MAX_COLUMNS) return;
    for (const r of t.rows) r.splice(at + 1, 0, r[at]);
    t.widths.splice(at + 1, 0, t.widths[at]);
    t.align.splice(at + 1, 0, t.align[at]);
    setTable(id, t, [row, at + 1]);
    announce(`Column ${at + 1} duplicated`);
  }
  /** Swap a row with its neighbour (a header row stays first). */
  function moveRow(id: string, at: number, dir: -1 | 1): void {
    const b = blocks[indexOf(id)];
    const t = tblOf(b);
    const first = b.header === false ? 0 : 1;
    const to = at + dir;
    if (at < first || to < first || to >= t.rows.length) return;
    [t.rows[at], t.rows[to]] = [t.rows[to], t.rows[at]];
    setTable(id, t, [to, lastCell?.col ?? 0]);
    announce(`Row moved to position ${to + 1} of ${t.rows.length}`);
  }
  function moveColumn(id: string, at: number, dir: -1 | 1): void {
    const t = tblOf(blocks[indexOf(id)]);
    const to = at + dir;
    if (to < 0 || to >= t.rows[0].length) return;
    for (const r of t.rows) [r[at], r[to]] = [r[to], r[at]];
    [t.widths[at], t.widths[to]] = [t.widths[to], t.widths[at]];
    [t.align[at], t.align[to]] = [t.align[to], t.align[at]];
    setTable(id, t, [lastCell?.row ?? 0, to]);
    announce(`Column moved to position ${to + 1} of ${t.rows[0].length}`);
  }
  /** Empty a row, a column or every cell (the header row's words too). */
  function clearCells(id: string, what: "row" | "column" | "table", row: number, col: number): void {
    const t = tblOf(blocks[indexOf(id)]);
    t.rows = t.rows.map((r, ri) => r.map((cell, ci) => (what === "table" || (what === "row" ? ri === row : ci === col) ? "" : cell)));
    setTable(id, t, [row, col]);
    announce(`${what === "table" ? "Table" : what === "row" ? "Row" : "Column"} cleared`);
  }
  function alignColumn(id: string, col: number, align: BlockEditorTableAlign, row = 0): void {
    const t = tblOf(blocks[indexOf(id)]);
    t.align[col] = align;
    setTable(id, t, [row, col]);
  }
  /** Set one column's width in px, or every column's back to even (0). */
  function sizeColumn(id: string, col: number, width: number, row = 0): void {
    const i = indexOf(id);
    const t = tblOf(blocks[i]);
    if (!width) t.widths = t.widths.map(() => 0);
    else {
      // The first time, every column keeps the width it has now, so only this one moves.
      if (!t.widths.some(Boolean)) t.widths = Array.from(els.get(id)?.querySelectorAll<HTMLElement>("tr:first-child > *") ?? []).map((c) => Math.round(c.offsetWidth));
      t.widths[col] = Math.max(MIN_COLUMN, Math.min(MAX_COLUMN, Math.round(width)));
    }
    setTable(id, t, [row, col]);
  }

  /** Put the caret in a cell, at `at` characters (or its end). */
  function focusCell(id: string, row: number, col: number, at: number | "end" = 0): void {
    const cell = cellEl(id, row, col);
    if (cell) selectText(cell, at === "end" ? textOf(cell).length : Math.min(at, textOf(cell).length));
  }

  /** Text pasted into a cell: a spreadsheet's rows and columns (tab and new line separated) fill the cells from there on, growing the table. */
  function pasteIntoTable(cell: HTMLElement, text: string): void {
    const lines = text.replace(/\r\n?/g, "\n").replace(/\n+$/, "").split("\n");
    const cells = lines.map((line) => line.split("\t"));
    if (cells.length === 1 && cells[0].length === 1) {
      document.execCommand("insertText", false, text.replace(/\s+/g, " "));
      return;
    }
    const id = idOf(cell);
    const b = blocks[indexOf(id)];
    const [row, col] = cellPos(cell);
    const rows = gridOf(b);
    const width = Math.min(MAX_COLUMNS, Math.max(rows[0].length, col + Math.max(...cells.map((r) => r.length))));
    const height = Math.min(MAX_ROWS, Math.max(rows.length, row + cells.length));
    const grid = Array.from({ length: height }, (_, r) => Array.from({ length: width }, (_, c) => rows[r]?.[c] ?? ""));
    cells.forEach((line, r) => line.forEach((value, c) => (row + r < height && col + c < width ? (grid[row + r][col + c] = value.replace(/\s+/g, " ").trim()) : undefined)));
    setTable(id, grid, [Math.min(height - 1, row + cells.length - 1), Math.min(width - 1, col + cells[cells.length - 1].length - 1)]);
  }

  function onCellKey(e: KeyboardEvent, cell: HTMLElement): void {
    if (e.isComposing || e.keyCode === 229) return;
    const id = idOf(cell);
    const i = indexOf(id);
    const b = blocks[i];
    if (!b) return;
    const grid = gridOf(b);
    const [row, col] = cellPos(cell);
    const rows = grid.length;
    const cols = grid[0].length;
    const mod = isMod(e);
    const key = e.key.toLowerCase();
    if (mod && (key === "z" || key === "y")) {
      e.preventDefault();
      if (key === "y" || e.shiftKey) redo();
      else undo();
      return;
    }
    if (mod && key === "/") {
      e.preventDefault();
      openActions([id], els.get(id)?.querySelector<HTMLElement>(`.${C.handle}`) ?? cell);
      return;
    }
    if (mod && e.shiftKey && e.key.startsWith("Arrow")) {
      e.preventDefault();
      lastCell = { id, row, col };
      const rtl = getComputedStyle(cell).direction === "rtl";
      if (e.key === "ArrowUp" || e.key === "ArrowDown") moveRow(id, row, e.key === "ArrowUp" ? -1 : 1);
      else moveColumn(id, col, (e.key === "ArrowLeft") !== rtl ? -1 : 1);
      return;
    }
    if (e.key === "Tab" && !mod && !e.altKey) {
      e.preventDefault();
      if (!e.shiftKey) {
        if (col < cols - 1) focusCell(id, row, col + 1);
        else if (row < rows - 1) focusCell(id, row + 1, 0);
        else insertRow(id, rows);
      } else if (col > 0) focusCell(id, row, col - 1, "end");
      else if (row > 0) focusCell(id, row - 1, cols - 1, "end");
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (mod) insertRow(id, row + 1, col);
      else if (e.shiftKey) focusCell(id, Math.max(0, row - 1), col);
      else if (row < rows - 1) focusCell(id, row + 1, col);
      else insertRow(id, rows, col);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      pick(id, id);
      return;
    }
    if (e.shiftKey || mod || e.altKey) return;
    const text = textOf(cell);
    const sel = selectionIn(cell) ?? { start: text.length, end: text.length };
    const collapsed = sel.start === sel.end;
    const rtl = getComputedStyle(cell).direction === "rtl";
    const forward = e.key === (rtl ? "ArrowLeft" : "ArrowRight");
    const back = e.key === (rtl ? "ArrowRight" : "ArrowLeft");
    const above = stepVisible(i, -1);
    const below = stepVisible(i, 1);
    const x = caretRect()?.left;
    if (e.key === "ArrowUp" && onFirstLine(cell)) {
      e.preventDefault();
      if (row > 0) focusCell(id, row - 1, col, sel.start);
      else if (above >= 0) goTo(above, "end", x);
    } else if (e.key === "ArrowDown" && onLastLine(cell)) {
      e.preventDefault();
      if (row < rows - 1) focusCell(id, row + 1, col, sel.start);
      else if (below >= 0) goTo(below, "start", x);
    } else if (back && collapsed && sel.start === 0) {
      e.preventDefault();
      if (col > 0) focusCell(id, row, col - 1, "end");
      else if (row > 0) focusCell(id, row - 1, cols - 1, "end");
      else if (above >= 0) goTo(above, "end");
    } else if (forward && collapsed && sel.end === text.length) {
      e.preventDefault();
      if (col < cols - 1) focusCell(id, row, col + 1);
      else if (row < rows - 1) focusCell(id, row + 1, 0);
      else if (below >= 0) goTo(below, "start");
    }
  }

  function onCaptionKey(e: KeyboardEvent, caption: HTMLElement): void {
    const id = idOf(caption);
    const i = indexOf(id);
    if (e.key === "Enter") {
      e.preventDefault();
      const after = blockEditorBlock();
      const next = blocks.slice();
      next.splice(i + 1, 0, after);
      commit(next, { id: after.id, start: 0 });
    } else if (e.key === "Escape") {
      e.preventDefault();
      pick(id, id);
    } else if (e.key === "ArrowDown" && i < blocks.length - 1 && onLastLine(caption)) {
      e.preventDefault();
      goTo(i + 1, "start");
    } else if (e.key === "ArrowUp" && onFirstLine(caption)) {
      e.preventDefault();
      pick(id, id);
    } else if (isMod(e) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    }
  }

  function onMediaInputKey(e: KeyboardEvent, input: HTMLInputElement): void {
    const id = idOf(input);
    const i = indexOf(id);
    input.removeAttribute("aria-invalid");
    if (e.key === "Enter") {
      e.preventDefault();
      applyMediaLink(id, input.value, input);
    } else if (e.key === "Escape") {
      e.preventDefault();
      pick(id, id);
    } else if (e.key === "Backspace" && !input.value) {
      e.preventDefault();
      const next = blocks.slice();
      next.splice(i, 1);
      const prev = next[Math.max(0, i - 1)];
      commit(next, prev && isText(prev.type) ? { id: prev.id, start: "end" } : null);
    } else if (e.key === "ArrowUp" && i > 0) {
      e.preventDefault();
      goTo(i - 1, "end");
    } else if (e.key === "ArrowDown" && i < blocks.length - 1) {
      e.preventDefault();
      goTo(i + 1, "start");
    }
  }

  function onResizeKey(e: KeyboardEvent, handle: HTMLElement): void {
    const id = idOf(handle);
    const b = blocks[indexOf(id)];
    if (!b) return;
    const current = b.width ?? 100;
    const rtl = getComputedStyle(handle).direction === "rtl";
    const grow = e.key === (rtl ? "ArrowLeft" : "ArrowRight") || e.key === "ArrowUp";
    const shrink = e.key === (rtl ? "ArrowRight" : "ArrowLeft") || e.key === "ArrowDown";
    const width = grow ? current + 5 : shrink ? current - 5 : e.key === "Home" ? 20 : e.key === "End" ? 100 : null;
    if (width === null) return;
    e.preventDefault();
    setWidth(id, width);
    els.get(id)?.querySelector<HTMLElement>(`.${C.resize}`)?.focus();
  }

  let typeahead = "";
  let typeaheadTimer = 0;

  function onMenuKey(e: KeyboardEvent): void {
    if (!menu) return;
    // Type to jump: "py" lands on Python, "d" on Duplicate.
    if (e.key.length === 1 && e.key !== " " && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      window.clearTimeout(typeaheadTimer);
      typeahead += e.key.toLowerCase();
      typeaheadTimer = window.setTimeout(() => (typeahead = ""), 700);
      const order = menuItems.map((_, i) => (menu!.index + (typeahead.length === 1 ? 1 : 0) + i) % menuItems.length);
      const hit = order.find((i) => menuItems[i].label.toLowerCase().startsWith(typeahead));
      if (hit !== undefined) moveMenu(hit - menu.index);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      moveMenu(e.key === "ArrowDown" ? 1 : -1);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      moveMenu((e.key === "Home" ? 0 : menuItems.length - 1) - menu.index);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      runMenu();
    } else if (menu.mode === "actions" && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      // A submenu opens toward the reading direction and closes back the other way.
      const rtl = getComputedStyle(menuEl).direction === "rtl";
      const into = e.key === (rtl ? "ArrowLeft" : "ArrowRight");
      if (into && menuItems[menu.index]?.sub) {
        e.preventDefault();
        runMenu();
      } else if (!into && menu.sub) {
        e.preventDefault();
        menu.sub = undefined;
        menu.index = 0;
        renderMenu();
      }
    } else if (e.key === "Escape" && menu.mode === "actions" && menu.sub) {
      e.preventDefault();
      e.stopPropagation();
      menu.sub = undefined;
      menu.index = 0;
      renderMenu();
    } else if (e.key === "Escape" || e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
      root.focus({ preventScroll: true });
    }
  }

  function onKeyDown(e: KeyboardEvent): void {
    if (readOnly()) return;
    const target = e.target as HTMLElement;
    if (menuEl.contains(target)) return onMenuKey(e);
    if (toolbar.contains(target)) {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        restoreRange();
        hideToolbar(true);
      }
      return;
    }
    if (target === root) {
      if (spanning) onSpanKey(e);
      else if (picked) onPickedKey(e);
      else if (isMod(e) && (e.key.toLowerCase() === "z" || e.key.toLowerCase() === "y")) {
        e.preventDefault();
        if (e.key.toLowerCase() === "y" || e.shiftKey) redo();
        else undo();
      }
      return;
    }
    if (target.matches("[data-media-input]")) return onMediaInputKey(e, target as HTMLInputElement);
    if (target.classList.contains(C.resize)) return onResizeKey(e, target);
    if (target.classList.contains(C.caption)) return onCaptionKey(e, target);
    if (target.classList.contains(C.cell)) return onCellKey(e, target);
    const text = textHost(target);
    if (text) onTextKey(e, text);
  }

  // ---- Input, clipboard and pointer ----

  function onBeforeInput(e: InputEvent): void {
    if (readOnly()) return;
    if (e.inputType === "historyUndo" || e.inputType === "historyRedo") {
      e.preventDefault();
      setSpanning(false);
      if (e.inputType === "historyUndo") undo();
      else redo();
      return;
    }
    if (toolbar.contains(e.target as Node) || (e.target as HTMLElement).matches?.("input")) return;
    beforeFocus = focusNow();
    if (e.inputType.startsWith("format")) typing = null;
    if (!spanning) return;
    if (e.inputType.startsWith("format")) {
      pushHistory();
      return;
    }
    e.preventDefault();
    const span = spanOf();
    if (!span) return;
    if (e.inputType === "insertText" || e.inputType === "insertReplacementText") editSpan(span, e.data ?? e.dataTransfer?.getData("text/plain") ?? "");
    else if (e.inputType === "insertParagraph" || e.inputType === "insertLineBreak") editSpan(span, "", true);
    else if (e.inputType.startsWith("delete")) editSpan(span, "");
  }

  function onInput(e: Event): void {
    if (readOnly()) return;
    const ev = e as InputEvent;
    const target = e.target as HTMLElement;
    if (toolbar.contains(target) || target.matches?.("input")) return;
    if (spanning) {
      syncAll();
      emit();
      scheduleToolbar();
      return;
    }
    const el = target.closest?.<HTMLElement>(`.${C.text}, .${C.caption}, .${C.cell}`);
    if (!el || !root.contains(el)) return;
    const composing = ev.isComposing;
    // Writing hides the gutters until the pointer moves again (Notion).
    if (!root.hasAttribute("data-typing")) root.setAttribute("data-typing", "");
    if (!composing) dropZw(el);
    syncText(el, ev.inputType?.startsWith("format") ? "step" : "burst");
    if (el.classList.contains(C.caption) || el.classList.contains(C.cell)) {
      emit();
      return;
    }
    if (!composing) {
      if (ev.inputType === "insertText" && shortcut(el)) return;
      if (ev.inputType === "insertText" && ev.data && /[*_`~]/.test(ev.data)) autoformat(el);
      detectMenus(el);
    }
    emit();
  }

  /** Markdown typed at the start of a line: "# ", "- ", "1. ", "[] ", "> ", "```", "---". */
  function shortcut(el: HTMLElement): boolean {
    const id = idOf(el);
    const i = indexOf(id);
    const b = blocks[i];
    const at = selectionIn(el);
    if (!b || !at || at.start !== at.end || (b.type !== "text" && b.type !== "bullet")) return false;
    const before = textOf(el).slice(0, at.start);
    const S = "[ \\u00A0]";
    const rules: [RegExp, BlockEditorBlockType, Partial<BlockEditorBlock>?][] = [
      [new RegExp(`^###${S}$`), "heading-3"],
      [new RegExp(`^##${S}$`), "heading-2"],
      [new RegExp(`^#${S}$`), "heading-1"],
      [new RegExp(`^\\[[xX]\\]${S}$`), "todo", { checked: true }],
      [new RegExp(`^\\[${S}?\\]${S}$`), "todo"],
      [new RegExp(`^[-*+]${S}\\[${S}?\\]${S}$`), "todo"],
      [new RegExp(`^[-*+]${S}$`), "bullet"],
      [new RegExp(`^1[.)]${S}$`), "number"],
      [new RegExp(`^>>${S}$`), "toggle"],
      [new RegExp(`^[>"]${S}$`), "quote"],
      [/^```$/, "code"],
      [/^(---|\*\*\*)$/, "divider"],
    ];
    for (const [re, type, extra] of rules) {
      if (!re.test(before)) continue;
      if (b.type === "bullet" && type !== "todo") return false;
      const html = sliceHtml(b.html ?? "", before.length);
      if (type === "divider") {
        const after = blockEditorBlock("text", { html });
        commit(replaceAt(i, blockEditorBlock("divider"), after), { id: after.id, start: 0 });
      } else commit(replaceAt(i, { ...asType({ ...b, html }, type), ...extra }), { id, start: 0 });
      return true;
    }
    return false;
  }

  function writeClipboard(data: DataTransfer, list: BlockEditorBlock[]): void {
    data.setData("text/plain", blockEditorToMarkdown(list));
    data.setData("text/html", blockEditorToHtml(list));
    try {
      data.setData(BLOCKS_MIME, JSON.stringify(list));
    } catch {
      // Some browsers only take standard types.
    }
  }

  function onCopy(e: ClipboardEvent, cut: boolean): void {
    if (!e.clipboardData) return;
    if (picked) {
      e.preventDefault();
      copied = true;
      writeClipboard(e.clipboardData, blocks.filter((b) => isPicked(b.id)));
      return;
    }
    if (!spanning) return;
    const span = spanOf();
    if (!span) return;
    e.preventDefault();
    writeClipboard(e.clipboardData, cutBlocks(blocks, span[0], span[1]));
    if (cut && !readOnly()) editSpan(span, "");
  }

  function onPaste(e: ClipboardEvent): void {
    const target = e.target as HTMLElement;
    if (readOnly()) {
      e.preventDefault();
      return;
    }
    const data = e.clipboardData;
    if (!data || target.closest?.("input, textarea") || toolbar.contains(target)) return;
    const cell = target.closest?.<HTMLElement>(`.${C.cell}`);
    if (cell) {
      e.preventDefault();
      pasteIntoTable(cell, data.getData("text/plain"));
      return;
    }
    const caption = target.closest?.<HTMLElement>(`.${C.caption}`);
    if (caption) {
      e.preventDefault();
      document.execCommand("insertText", false, data.getData("text/plain").replace(/\s+/g, " "));
      return;
    }
    const files = Array.from(data.files);
    const plain = data.getData("text/plain");
    const own = data.getData(BLOCKS_MIME);
    let incoming: BlockEditorBlock[] | null = null;
    if (own) {
      try {
        incoming = blockEditorNormalize(JSON.parse(own)).map((b) => ({ ...b, id: blockEditorId() }));
      } catch {
        incoming = null;
      }
    }
    if (spanning) {
      const span = spanOf();
      if (!span) return;
      e.preventDefault();
      const { next, caret } = deleteSpan(blocks, span[0], span[1]);
      const list = incoming ?? (data.getData("text/html") ? htmlToBlocks(data.getData("text/html")) : blockEditorFromMarkdown(plain));
      const i = next.findIndex((b) => b.id === caret.id);
      const pasted = insertInto(next, i, caret.start, caret.start, list.length ? list : [blockEditorBlock("text", { html: escapeText(plain) })]);
      setSpanning(false);
      commit(pasted.next, pasted.caret);
      return;
    }
    const el = textHost(target);
    if (!el) return;
    const id = idOf(el);
    const i = indexOf(id);
    const b = blocks[i];
    const text = textOf(el);
    const sel = selectionIn(el) ?? { start: text.length, end: text.length };
    if (files.length && !own) {
      e.preventDefault();
      insertFiles(files, i, b.type === "text" && !text ? id : undefined);
      return;
    }
    if (b.type === "code") {
      e.preventDefault();
      insertPlain(el, plain);
      return;
    }
    if (!incoming) {
      const html = data.getData("text/html");
      if (html) incoming = htmlToBlocks(html);
    }
    if (!incoming?.length) {
      if (!plain.includes("\n")) {
        e.preventDefault();
        const url = /^https?:\/\/\S+$/.test(plain.trim()) ? safeUrl(plain.trim()) : "";
        if (url && sel.start !== sel.end) document.execCommand("createLink", false, url);
        else document.execCommand("insertText", false, plain);
        return;
      }
      incoming = blockEditorFromMarkdown(plain);
    }
    e.preventDefault();
    const { next, caret } = insertInto(blocks, i, sel.start, sel.end, incoming);
    commit(next, caret);
  }

  function onPointerDown(e: PointerEvent): void {
    const target = e.target as HTMLElement;
    root.removeAttribute("data-typing");
    if (menu && !menuEl.contains(target) && !target.closest(`.${C.handle}`)) closeMenu();
    if (toolbar.contains(target) || menuEl.contains(target) || readOnly()) return;
    const resize = target.closest<HTMLElement>(`.${C.resize}`);
    if (resize && e.button === 0) {
      e.preventDefault();
      const frame = resize.closest<HTMLElement>(`.${C.frame}`)!;
      const figure = resize.closest<HTMLElement>(`.${C.media}`)!;
      const rtl = getComputedStyle(frame).direction === "rtl";
      const box = frame.getBoundingClientRect();
      resizing = { id: idOf(resize), frame, start: rtl ? box.right : box.left, column: figure.getBoundingClientRect().width, rtl, width: 0 };
      resize.setPointerCapture?.(e.pointerId);
      return;
    }
    const grip = target.closest<HTMLElement>(`.${C.colResize}`);
    if (grip && e.button === 0) {
      e.preventDefault();
      const table = grip.closest<HTMLElement>("table")!;
      const cols = Array.from(table.querySelectorAll<HTMLElement>(":scope > colgroup > col"));
      const widths = Array.from(table.querySelectorAll<HTMLElement>(":scope tr:first-child > *")).map((c) => Math.round(c.offsetWidth));
      const col = Number(grip.dataset.col);
      sizing = { id: idOf(grip), col, start: e.clientX, rtl: getComputedStyle(table).direction === "rtl", widths, cols, table, width: widths[col] };
      grip.setPointerCapture?.(e.pointerId);
      grip.setAttribute("data-active", "");
      return;
    }
    const inText = target.closest(`.${C.text}`);
    if (picked && !(e.shiftKey && e.button === 0)) unpick();
    if (picked) return;
    // Before the browser places the caret: a press that turns into a drag can then select across blocks.
    if (e.button === 0 && inText && e.pointerType !== "touch") {
      setSpanning(true);
      pressing = true;
      hideToolbar(true);
    } else if (!inText) setSpanning(false);
  }

  function onPointerMove(e: PointerEvent): void {
    if (root.hasAttribute("data-typing") && (Math.abs(e.movementX) + Math.abs(e.movementY) > 2 || e.pointerType !== "mouse")) root.removeAttribute("data-typing");
    if (sizing) {
      const dx = sizing.rtl ? sizing.start - e.clientX : e.clientX - sizing.start;
      sizing.width = Math.max(MIN_COLUMN, Math.min(MAX_COLUMN, Math.round(sizing.widths[sizing.col] + dx)));
      const widths = sizing.widths.map((w, c) => (c === sizing!.col ? sizing!.width : w));
      sizing.cols.forEach((col, c) => (col.style.inlineSize = `${widths[c]}px`));
      sizing.table.setAttribute("data-sized", "");
      sizing.table.style.inlineSize = `${widths.reduce((sum, w) => sum + w, 0)}px`;
      return;
    }
    if (!resizing) return;
    const width = resizing.rtl ? resizing.start - e.clientX : e.clientX - resizing.start;
    resizing.width = Math.max(20, Math.min(100, Math.round((width / resizing.column) * 100)));
    resizing.frame.style.inlineSize = `${resizing.width}%`;
  }

  function onPointerUp(): void {
    if (sizing) {
      const { id, col, width, widths, table } = sizing;
      sizing = null;
      table.querySelector(`.${C.colResize}[data-active]`)?.removeAttribute("data-active");
      const i = indexOf(id);
      const b = blocks[i];
      if (b && width !== widths[col]) {
        const t = tblOf(b);
        t.widths = widths.map((w, c) => (c === col ? width : w));
        setTable(id, t, [lastCell?.id === id ? lastCell.row : 0, col]);
      } else render();
      return;
    }
    if (resizing) {
      const { id, width } = resizing;
      resizing = null;
      if (width) setWidth(id, width);
      return;
    }
    if (!pressing) return;
    pressing = false;
    // Now, so the next key goes to the block; and once more after the browser's own mouseup handling.
    settle();
    window.setTimeout(() => {
      settle();
      scheduleToolbar();
    }, 0);
  }

  // Shift+click adds blocks to a block selection. Mouse, not pointer: only preventing mousedown keeps the caret where it was.
  function onMouseDown(e: MouseEvent): void {
    // The arrow doesn't take the caret from the line it was in (closing a toggle then knows where it was).
    if ((e.target as HTMLElement).closest?.(`.${C.toggle}, .${C.tableAdd}`)) {
      e.preventDefault();
      return;
    }
    // A double or triple click selects a word or the line inside one block: let the line itself do it. Switching the
    // editing host in the middle of that gesture loses the word, and the caret lands at the start of the line.
    const line = textHost(e.target as Node);
    if (e.button === 0 && e.detail >= 2 && line) {
      pressing = false;
      setSpanning(false);
      if (document.activeElement !== line) line.focus({ preventScroll: true });
      // A triple click takes the whole line, chips included (the browser's own stops at the first chip).
      if (e.detail === 3) {
        e.preventDefault();
        selectText(line, 0, textOf(line).length);
      }
      return;
    }
    if (e.button !== 0 || !e.shiftKey || !picked) return;
    const id = idOf(e.target as Node);
    if (id) {
      e.preventDefault();
      pick(picked.anchor, id);
    }
  }

  function onClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (toolbar.contains(target) || menuEl.contains(target)) return;
    const chip = target.closest<HTMLElement>(`.${C.mention}`);
    if (chip) {
      const d = chip.dataset;
      opts.onMentionClick?.({ trigger: d.trigger ?? "", id: d.id ?? "", label: d.label ?? "" }, e);
      return;
    }
    const link = target.closest<HTMLAnchorElement>("a");
    if (link && root.contains(link)) {
      if (link.classList.contains(C.file) || link.classList.contains(C.bookmark)) return;
      if (readOnly() || isMod(e)) {
        e.preventDefault();
        window.open(link.href, "_blank", "noopener,noreferrer");
      }
      return;
    }
    const copy = target.closest<HTMLElement>("[data-code-copy]");
    if (copy) {
      const code = textEl(idOf(copy));
      if (code) void copyCodeBlock(copy, { code: textOf(code) });
      return;
    }
    const arrow = target.closest<HTMLElement>(`.${C.toggle}`);
    if (arrow) {
      const id = idOf(arrow);
      setOpen(id, !blocks[indexOf(id)]?.open);
      return;
    }
    if (readOnly()) return;
    const id = idOf(target);
    const tableAdd = target.closest<HTMLElement>(`.${C.tableAdd}`);
    if (tableAdd) {
      const grid = gridOf(blocks[indexOf(id)]);
      if (tableAdd.dataset.axis === "row") insertRow(id, grid.length);
      else insertColumn(id, grid[0].length);
      return;
    }
    const language = target.closest<HTMLElement>("button[data-code-language]");
    if (language) {
      openActions([id], language, "language");
      return;
    }
    if (target.closest(`.${C.add}`)) {
      addBlock(id, e.altKey);
      return;
    }
    const handle = target.closest<HTMLElement>(`.${C.handle}`);
    if (handle) {
      openActions(isPicked(id) ? pickedIds() : [id], handle);
      return;
    }
    if (target.closest("[data-media-upload]")) {
      chooseFile(id);
      return;
    }
    if (!id) {
      if (target === root) clickBelow(e);
      return;
    }
    if (target.closest(`.${C.caption}, .${C.text}, .${C.cell}, .${C.resize}, .${C.colResize}, .${C.empty}, input, button, iframe, video, audio`)) return;
    const b = blocks[indexOf(id)];
    if (!b) return;
    if (!isText(b.type)) {
      if (e.shiftKey && picked) return;
      pick(id, id);
      return;
    }
    const el = textEl(id);
    if (el && document.activeElement !== el) {
      const hit = caretAt(e.clientX, e.clientY);
      selectText(el, hit && el.contains(hit[0]) ? offsetIn(el, hit[0], hit[1]) : textOf(el).length);
    }
  }

  /** The + in the gutter: a new line below (above with Alt) with "/" typed, so the block menu opens. */
  function addBlock(id: string, above: boolean): void {
    const i = indexOf(id);
    const b = blocks[i];
    if (!b) return;
    let target = id;
    if (b.type === "text" && !inlineText(b.html ?? "") && !(b.html ?? "").includes(C.mention)) {
      commit(replaceAt(i, { ...b, html: "/" }), { id, start: 1 });
    } else {
      const fresh = blockEditorBlock("text", { html: "/" });
      const next = blocks.slice();
      next.splice(above ? i : i + 1, 0, fresh);
      target = fresh.id;
      commit(next, { id: fresh.id, start: 1 });
    }
    const el = textEl(target);
    if (el) detectMenus(el);
  }

  /** A click under the last block writes there: in the last line when it's an empty one, else in a new line. */
  function clickBelow(e: MouseEvent): void {
    const last = blocks[blocks.length - 1];
    const lastEl = els.get(last.id);
    if (!lastEl || e.clientY < lastEl.getBoundingClientRect().bottom) return;
    if (last.type === "text" && !inlineText(last.html ?? "")) applyFocus({ id: last.id, start: 0 });
    else {
      const fresh = blockEditorBlock();
      commit([...blocks, fresh], { id: fresh.id, start: 0 });
    }
  }

  function onChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    if (target === fileInput) {
      const file = fileInput.files?.[0];
      if (file && fileTarget) void fillFrom(fileTarget, file);
      fileTarget = null;
      return;
    }
    if (!target.classList.contains(C.check)) return;
    const i = indexOf(idOf(target));
    if (i < 0) return;
    commit(replaceAt(i, { ...blocks[i], checked: target.checked }));
  }

  function onFocusIn(e: FocusEvent): void {
    const target = e.target as Node;
    if (isElement(target) && target.classList.contains(C.cell)) {
      const [row, col] = cellPos(target);
      lastCell = { id: idOf(target), row, col };
    }
    if (picked && target !== root && !menuEl.contains(target)) unpick();
  }

  function onFocusOut(e: FocusEvent): void {
    const to = e.relatedTarget as Node | null;
    if (to && root.contains(to)) {
      if (menu && menu.mode !== "actions" && !menuEl.contains(to) && textHost(to) !== textEl(menu.id)) closeMenu();
      return;
    }
    if (menu) closeMenu();
    unpick();
    setSpanning(false);
    hideToolbar(true);
  }

  // External files dragged over the editor land between blocks, with the same drop line a reorder shows.
  let fileEdge: HTMLElement | null = null;
  const clearFileEdge = () => {
    if (fileEdge) setDropEdge(fileEdge, null);
    fileEdge = null;
  };
  function dropSpot(y: number): { el: HTMLElement; before: boolean } | null {
    let last: HTMLElement | null = null;
    for (const b of blocks) {
      const el = els.get(b.id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (y < rect.top + rect.height / 2) return { el, before: true };
      last = el;
    }
    return last ? { el: last, before: false } : null;
  }
  function onDragOver(e: DragEvent): void {
    if (readOnly() || !e.dataTransfer || !Array.from(e.dataTransfer.types).includes("Files")) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    const spot = dropSpot(e.clientY);
    if (!spot) return;
    if (fileEdge !== spot.el) clearFileEdge();
    fileEdge = spot.el;
    setDropEdge(spot.el, spot.before ? "block-start" : "block-end");
  }
  function onDragLeave(e: DragEvent): void {
    if (!root.contains(e.relatedTarget as Node | null)) clearFileEdge();
  }
  function onDrop(e: DragEvent): void {
    const files = Array.from(e.dataTransfer?.files ?? []);
    if (readOnly() || !files.length) return;
    e.preventDefault();
    const spot = dropSpot(e.clientY);
    clearFileEdge();
    const emptyMedia = (e.target as HTMLElement).closest?.(`.${C.empty}`);
    const id = emptyMedia ? idOf(emptyMedia) : "";
    if (id && files.length === 1) {
      void fillFrom(id, files[0]);
      return;
    }
    const at = spot ? indexOf(spot.el.dataset.id ?? "") - (spot.before ? 1 : 0) : blocks.length - 1;
    insertFiles(files, at);
  }

  const onDocumentSelection = () => {
    if (spanning && !pressing) settle();
    scheduleToolbar();
    if (menu && menu.mode !== "actions") {
      const el = textEl(menu.id);
      const at = el ? selectionIn(el) : null;
      if (!at || at.start <= menu.start) closeMenu();
    }
  };

  const onCompositionStart = () => {
    // An input method can't be held off: clear the selection first and let it compose in the block.
    const span = spanning ? spanOf() : null;
    if (span) editSpan(span, "");
  };

  // ---- Toolbar and menu wiring ----

  const keepSelection = (e: Event) => {
    if ((e.target as HTMLElement).closest("button, [role=option]")) e.preventDefault();
  };
  toolbar.addEventListener("mousedown", keepSelection);
  menuEl.addEventListener("mousedown", keepSelection);
  toolbar.addEventListener("click", (e) => {
    const button = (e.target as HTMLElement).closest<HTMLElement>("button");
    if (!button) return;
    const command = button.dataset.command;
    if (command === "link") openLinkForm();
    else if (command) toggleMark(command);
    else if (button.dataset.link === "remove") applyLink("");
    else if (button.dataset.link === "open") {
      const url = safeUrl(linkInput.value);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    }
  });
  linkForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (linkInput.value.trim() && !safeUrl(linkInput.value)) {
      linkInput.setAttribute("aria-invalid", "true");
      return;
    }
    applyLink(linkInput.value);
  });
  linkInput.addEventListener("focus", () => {
    if (!lastRange) openLinkForm();
  });
  linkInput.addEventListener("input", () => linkInput.removeAttribute("aria-invalid"));
  menuEl.addEventListener("click", (e) => {
    const option = (e.target as HTMLElement).closest<HTMLElement>('[role="option"]');
    if (option) runMenu(Number(option.dataset.index));
  });
  menuEl.addEventListener("pointermove", (e) => {
    const option = (e.target as HTMLElement).closest<HTMLElement>('[role="option"]');
    if (option && menu && Number(option.dataset.index) !== menu.index) moveMenu(Number(option.dataset.index) - menu.index);
  });

  // ---- Drag and drop of blocks: ayywi's own, by the handle ----

  const dnd = connectDragDrop(root, {
    items: `.${C.block}`,
    handle: `.${C.handle}`,
    moveDom: false,
    ignore: `.${C.text}, .${C.caption}, .${C.cell}, input, textarea, select`,
    canDrag: () => !readOnly(),
    describe: (item) => {
      const b = blocks[indexOf(item.dataset.id ?? "")];
      if (!b) return "Block";
      const text = isText(b.type) ? inlineText(b.html ?? "").trim().slice(0, 40) : (b.caption ?? b.name ?? "");
      return text ? `${TYPES[b.type].label}: ${text}` : TYPES[b.type].label;
    },
    preview: (item) => {
      const id = item.dataset.id ?? "";
      const count = isPicked(id) ? pickedIds().length : 1;
      if (count > 1) return dragPreviewChip(`${count} blocks`);
      const rect = item.getBoundingClientRect();
      const copy = item.cloneNode(true) as HTMLElement;
      copy.removeAttribute("data-selected");
      copy.classList.add(dragPreviewClass);
      copy.style.inlineSize = `${rect.width}px`;
      return copy;
    },
    markItem: (item, on) => {
      const id = item.dataset.id ?? "";
      for (const other of withKids(isPicked(id) ? pickedIds() : [id])) els.get(other)?.toggleAttribute("data-dragging", on);
    },
    onMove: (move: DragMove) => {
      const id = move.itemId ?? move.item.dataset.id ?? "";
      const moving = withKids(isPicked(id) ? pickedIds() : [id]);
      const set = new Set(moving);
      const others = blocks.filter((b) => b.id !== id);
      let ref: BlockEditorBlock | null = others[move.toIndex] ?? null;
      while (ref && set.has(ref.id)) ref = others[others.indexOf(ref) + 1] ?? null;
      const run = blocks.filter((b) => set.has(b.id));
      const next = blocks.filter((b) => !set.has(b.id));
      next.splice(ref ? next.indexOf(ref) : next.length, 0, ...run);
      commit(next, moving.length > 1 ? { pick: [run[0].id, run[run.length - 1].id] } : null);
    },
  });

  const listeners: [EventTarget, string, EventListener, AddEventListenerOptions?][] = [
    [root, "keydown", onKeyDown as EventListener],
    [root, "beforeinput", onBeforeInput as EventListener],
    [root, "input", onInput],
    [root, "copy", ((e: ClipboardEvent) => onCopy(e, false)) as EventListener],
    [root, "cut", ((e: ClipboardEvent) => onCopy(e, true)) as EventListener],
    [root, "paste", onPaste as EventListener],
    [root, "pointerdown", onPointerDown as EventListener],
    [root, "mousedown", onMouseDown as EventListener],
    [root, "click", onClick as EventListener],
    [root, "change", onChange],
    [root, "focusin", onFocusIn as EventListener],
    [root, "focusout", onFocusOut as EventListener],
    [root, "dragstart", ((e: DragEvent) => e.preventDefault()) as EventListener],
    [root, "dragover", onDragOver as EventListener],
    [root, "dragleave", onDragLeave as EventListener],
    [root, "drop", onDrop as EventListener],
    [root, "compositionstart", onCompositionStart],
    [document, "selectionchange", onDocumentSelection],
    [window, "pointermove", onPointerMove as EventListener],
    [window, "pointerup", onPointerUp],
    [window, "pointercancel", onPointerUp],
  ];
  for (const [target, type, fn, o] of listeners) target.addEventListener(type, fn, o);
  fileInput.addEventListener("change", onChange);

  render();

  return {
    getValue: () => blocks.map(copyOf),
    setValue(value) {
      const next = blockEditorNormalize(value);
      if (JSON.stringify(next) === JSON.stringify(blocks)) return;
      closeMenu();
      hideToolbar(true);
      setSpanning(false);
      picked = null;
      undoStack = [];
      redoStack = [];
      typing = null;
      blocks = next;
      render();
    },
    setOptions(next) {
      const rebuild = "readOnly" in next && !!next.readOnly !== readOnly();
      opts = { ...opts, ...next };
      if (rebuild) {
        closeMenu();
        hideToolbar(true);
        setSpanning(false);
        picked = null;
      }
      render();
      for (const b of blocks) {
        const el = els.get(b.id);
        el?.querySelector(`:scope > .${C.text}`)?.setAttribute("data-placeholder", placeholderOf(b));
      }
    },
    focus(at = "end") {
      const list = at === "start" ? blocks : [...blocks].reverse();
      const target = list.find((b) => isText(b.type));
      if (target) applyFocus({ id: target.id, start: at === "start" ? 0 : "end" });
      else root.focus();
    },
    destroy() {
      for (const id of [...codeRanges.keys()]) unpaintCode(id);
      closeMenu();
      hideToolbar(true);
      cancelAnimationFrame(toolbarFrame);
      setSpanning(false);
      dnd.destroy();
      for (const [target, type, fn, o] of listeners) target.removeEventListener(type, fn, o);
      fileInput.removeEventListener("change", onChange);
      anchor.remove();
      menuEl.remove();
      toolbar.remove();
      fileInput.remove();
    },
  };
}
