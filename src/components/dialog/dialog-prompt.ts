import { isBackdropClick } from "./dialog";

export interface ConfirmDialogOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

export interface DialogChoice<T extends string> {
  value: T;
  label: string;
  variant?: "primary" | "secondary" | "destructive";
}

export interface ChoiceDialogOptions<T extends string> {
  title: string;
  description?: string;
  cancelLabel?: string;
  choices: DialogChoice<T>[];
}

export interface PromptDialogOptions {
  title: string;
  description?: string;
  label: string;
  value?: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  validate?: (value: string) => string | null;
  secret?: boolean;
}

let counter = 0;
let cancelCurrent: (() => void) | null = null;

type PromptOptions = { title: string; description?: string; cancelLabel?: string };
type Choice = DialogChoice<string>;

function openPrompt(options: PromptOptions, choices: Choice[], inputOptions?: PromptDialogOptions): Promise<string | null> {
  if (typeof document === "undefined") return Promise.resolve(null);
  cancelCurrent?.();
  const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const id = `ayy-prompt-${++counter}`;
  const dialog = document.createElement("dialog");
  dialog.className = "ayy-dialog ayy-dialog--sm";
  dialog.setAttribute("data-ayy-prompt", "");
  dialog.setAttribute("aria-labelledby", `${id}-title`);
  const header = document.createElement("div");
  header.className = "ayy-dialog__header";
  const title = document.createElement("h2");
  title.className = "ayy-dialog__title";
  title.id = `${id}-title`;
  title.textContent = options.title;
  header.append(title);
  if (options.description) {
    const description = document.createElement("p");
    description.className = "ayy-dialog__description";
    description.id = `${id}-desc`;
    description.textContent = options.description;
    dialog.setAttribute("aria-describedby", description.id);
    header.append(description);
  }
  dialog.append(header);
  let input: HTMLInputElement | undefined;
  let error: HTMLParagraphElement | undefined;
  if (inputOptions) {
    const body = document.createElement("div");
    body.className = "ayy-dialog__body";
    const field = document.createElement("div");
    field.className = "ayy-field";
    const label = document.createElement("label");
    label.className = "ayy-label";
    label.htmlFor = `${id}-input`;
    label.textContent = inputOptions.label;
    input = document.createElement("input");
    input.className = "ayy-input";
    input.id = label.htmlFor;
    input.type = inputOptions.secret ? "password" : "text";
    input.autocomplete = "off";
    input.value = inputOptions.value ?? "";
    if (inputOptions.placeholder) input.placeholder = inputOptions.placeholder;
    input.setAttribute("aria-describedby", `${id}-error`);
    error = document.createElement("p");
    error.className = "ayy-field__error";
    error.id = `${id}-error`;
    error.hidden = true;
    field.append(label, input, error);
    body.append(field);
    dialog.append(body);
  }
  const footer = document.createElement("div");
  footer.className = "ayy-dialog__footer";
  const button = (label: string, variant: "primary" | "secondary" | "destructive") => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = `ayy-button${variant === "primary" ? "" : ` ayy-button--${variant}`}`;
    el.textContent = label;
    footer.append(el);
    return el;
  };
  const cancel = button(options.cancelLabel ?? "Cancel", "secondary");
  const choiceButtons = choices.map((choice, index) => button(choice.label, choice.variant ?? (index === choices.length - 1 ? "primary" : "secondary")));
  dialog.append(footer);
  document.body.append(dialog);
  return new Promise((resolve) => {
    const finish = (value: string | null) => {
      if (cancelCurrent !== cancelDialog) return;
      cancelCurrent = null;
      dialog.close();
      dialog.remove();
      if (opener?.isConnected) opener.focus();
      resolve(value);
    };
    const cancelDialog = () => finish(null);
    cancelCurrent = cancelDialog;
    cancel.addEventListener("click", cancelDialog);
    dialog.addEventListener("cancel", (event) => { event.preventDefault(); cancelDialog(); });
    dialog.addEventListener("click", (event) => { if (isBackdropClick(dialog, event)) cancelDialog(); });
    choiceButtons.forEach((el, index) => el.addEventListener("click", () => {
      if (!input || !inputOptions) return finish(choices[index].value);
      const value = input.value.trim();
      if (!value) return;
      const message = inputOptions.validate?.(value);
      if (message && error) {
        error.textContent = message;
        error.hidden = false;
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }
      finish(value);
    }));
    if (input) {
      const field = input;
      const confirm = choiceButtons[0];
      const sync = () => {
        confirm.disabled = !field.value.trim();
        field.removeAttribute("aria-invalid");
        if (error) error.hidden = true;
      };
      field.addEventListener("input", sync);
      field.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.isComposing && event.keyCode !== 229) {
          event.preventDefault();
          confirm.click();
        }
      });
      sync();
    }
    dialog.showModal();
    if (input) { input.focus(); input.select(); }
    else (choiceButtons.at(-1) ?? cancel).focus();
  });
}

export async function confirmDialog(options: ConfirmDialogOptions): Promise<boolean> {
  return (await openPrompt(options, [{ value: "confirm", label: options.confirmLabel ?? "OK", variant: options.destructive ? "destructive" : "primary" }])) === "confirm";
}

export function choiceDialog<T extends string>(options: ChoiceDialogOptions<T>): Promise<T | null> {
  return openPrompt(options, options.choices) as Promise<T | null>;
}

export function promptDialog(options: PromptDialogOptions): Promise<string | null> {
  return openPrompt(options, [{ value: "submit", label: options.confirmLabel ?? "Save" }], options);
}
