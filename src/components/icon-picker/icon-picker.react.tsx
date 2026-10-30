import { forwardRef, isValidElement, useEffect, useId, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { mergeRefs } from "../../lib/refs";
import { buttonClass } from "../button/button";
import type { IconName } from "../../icon-packs";
import type { IconData } from "../icon/icon";
import { Icon } from "../icon/icon.react";
import { inputClass } from "../input/input";
import {
  connectIconPicker,
  iconPickerBodyClass,
  iconPickerClass,
  iconPickerEmojis,
  iconPickerEmptyClass,
  iconPickerGridClass,
  iconPickerHeaderClass,
  iconPickerLabelClass,
  iconPickerOptionClass,
  iconPickerRemoveClass,
  iconPickerSearchClass,
  iconPickerSectionClass,
  type IconPickerChange,
  type IconPickerController,
  type IconPickerEmoji,
} from "./icon-picker";

export interface IconPickerIcon {
  /** The picked value ("star"). */
  value: string;
  /** Accessible name ("Star"), also searched. */
  label: string;
  /** Hugeicons data (`StarIcon`) or any rendered icon. */
  icon: IconData | ReactNode;
  /** The glyph's name, when `icon` is one ayywi draws (`"star"`), so an icon pack can replace it. Ignored for a rendered icon. */
  name?: IconName;
  /** Extra search words. */
  keywords?: string[];
}

export interface IconPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** The picked icon value or emoji; "" for none. */
  value?: string;
  defaultValue?: string;
  /** Called with the new value ("" when removed) and what was picked. */
  onValueChange?: (value: string, change: IconPickerChange) => void;
  /** The icons section. Omit or pass [] for emoji only. */
  icons?: IconPickerIcon[];
  /** The emoji section: iconPickerEmojis by default; [] hides it. */
  emojis?: IconPickerEmoji[];
  /** Show the search field (default true). */
  searchable?: boolean;
  /** Show the remove button (default true). */
  removable?: boolean;
  iconsLabel?: string;
  emojisLabel?: string;
  searchLabel?: string;
  removeLabel?: string;
  emptyLabel?: string;
}

/** A searchable grid of icons and emoji with a remove button. Put it in a Popover, or in a DropdownMenuSubContent with role="dialog". */
export const IconPicker = /* @__PURE__ */ forwardRef<HTMLDivElement, IconPickerProps>(function IconPicker(
  {
    value: controlled,
    defaultValue = "",
    onValueChange,
    icons = [],
    emojis = iconPickerEmojis,
    searchable = true,
    removable = true,
    iconsLabel = "Icons",
    emojisLabel = "Emoji",
    searchLabel = "Search icons",
    removeLabel = "Remove",
    emptyLabel = "No icons found",
    className,
    ...props
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlled ?? uncontrolled;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<IconPickerController | null>(null);
  const changeRef = useRef(onValueChange);
  changeRef.current = onValueChange;
  const controlledRef = useRef(controlled !== undefined);
  controlledRef.current = controlled !== undefined;
  const id = useId();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const controller = connectIconPicker(root, {
      manageSelection: false,
      onChange: (change) => {
        if (!controlledRef.current) setUncontrolled(change.value);
        changeRef.current?.(change.value, change);
      },
    });
    controllerRef.current = controller;
    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, []);

  // New options or a new value: filter them by the current query and move the tab stop.
  useEffect(() => {
    controllerRef.current?.refresh();
  });

  const option = (key: string, optionValue: string, label: string, keywords: string[] | undefined, content: ReactNode) => (
    <button
      key={key}
      type="button"
      className={iconPickerOptionClass}
      data-value={optionValue}
      data-keywords={keywords?.join(" ")}
      aria-label={label}
      aria-pressed={value === optionValue}
      title={label}
    >
      {content}
    </button>
  );

  return (
    <div ref={mergeRefs(ref, rootRef)} className={iconPickerClass({ className })} {...props}>
      {searchable || removable ? (
        <div className={iconPickerHeaderClass}>
          {searchable ? (
            <input
              type="search"
              className={inputClass({ size: "sm", className: iconPickerSearchClass })}
              aria-label={searchLabel}
              placeholder={searchLabel}
              autoComplete="off"
              spellCheck={false}
            />
          ) : null}
          {removable ? (
            <button type="button" className={buttonClass({ variant: "ghost", size: "sm", className: iconPickerRemoveClass })}>
              {removeLabel}
            </button>
          ) : null}
        </div>
      ) : null}
      <div className={iconPickerBodyClass}>
        {icons.length ? (
          <div className={iconPickerSectionClass} role="group" aria-labelledby={`${id}-icons`}>
            <p id={`${id}-icons`} className={iconPickerLabelClass}>{iconsLabel}</p>
            <div className={iconPickerGridClass}>
              {icons.map((item) =>
                option(item.value, item.value, item.label, item.keywords, isValidElement(item.icon) ? item.icon : <Icon icon={item.icon as IconData} name={item.name} />),
              )}
            </div>
          </div>
        ) : null}
        {emojis.length ? (
          <div className={iconPickerSectionClass} role="group" aria-labelledby={`${id}-emoji`}>
            <p id={`${id}-emoji`} className={iconPickerLabelClass}>{emojisLabel}</p>
            <div className={iconPickerGridClass}>
              {emojis.map((item) => option(item.value, item.value, item.label, item.keywords, item.value))}
            </div>
          </div>
        ) : null}
        <p className={iconPickerEmptyClass} role="status" hidden>{emptyLabel}</p>
      </div>
    </div>
  );
});
