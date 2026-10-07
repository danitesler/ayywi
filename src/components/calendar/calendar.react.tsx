import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../lib/cx";
import { ArrowLeft01Icon, ArrowRight01Icon, Calendar03Icon } from "../../lib/icons";
import { mergeRefs } from "../../lib/refs";
import { Icon } from "../icon/icon.react";
import { inputClass, type InputSize } from "../input/input";
import { connectPopover, popoverClass, type PopoverController } from "../popover/popover";
import {
  addMonths,
  calendarClassName,
  calendarKeyTarget,
  calendarLabels,
  calendarMonth,
  formatDate,
  localeWeekStart,
  resolveCalendarDate,
  startOfMonth,
  todayIso,
  type Weekday,
} from "./calendar";

export interface CalendarPreset {
  label: ReactNode;
  /** An ISO day, or "+N" days from today ("+0" today, "+1" tomorrow). */
  date: string;
  /** An Icon above the label. */
  icon?: ReactNode;
}

export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** The picked day, "2026-10-07". null for none. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (date: string) => void;
  /** Earliest and latest day that can be picked (ISO). Days outside are crossed out but still focusable. */
  min?: string;
  max?: string;
  /** Override today (tests, another time zone). */
  today?: string;
  /** First day of the week, 0 = Sunday. Default: the locale's. */
  weekStart?: Weekday;
  /** Names of months and days. Default: the browser's language. */
  locale?: string;
  /** Fill the container's width (a phone screen, a sheet). */
  full?: boolean;
  /** Accessible names of the month arrows. Translate them. */
  previousLabel?: string;
  nextLabel?: string;
  /** Shortcuts above the month: Today, Tomorrow, Next week. */
  presets?: CalendarPreset[];
  /** Accessible name of the presets group. Default "Quick dates". */
  presetsLabel?: string;
  /** Under the month: a time input, a Clear button. */
  footer?: ReactNode;
}

/** One month of days to pick a date from. The grid is one Tab stop; arrows move the day, PageUp/PageDown the month. */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  {
    value,
    defaultValue = null,
    onValueChange,
    min,
    max,
    today: todayProp,
    weekStart: weekStartProp,
    locale,
    full,
    previousLabel = "Previous month",
    nextLabel = "Next month",
    presets,
    presetsLabel = "Quick dates",
    footer,
    className,
    ...props
  },
  ref,
) {
  const today = todayProp ?? todayIso();
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const selected = value === undefined ? uncontrolled : value;
  const [cursor, setCursor] = useState(selected ?? today);
  const [month, setMonth] = useState(() => startOfMonth(selected ?? today));
  const grid = useRef<HTMLDivElement>(null);
  const focusCursor = useRef(false);
  const weekStart = weekStartProp ?? localeWeekStart(locale);
  const labels = useMemo(() => calendarLabels(locale), [locale]);
  const days = calendarMonth({ month, value: selected, today, min, max, weekStart });
  const titleId = useId();

  // A value set from outside shows its month.
  useEffect(() => {
    if (!selected) return;
    setCursor(selected);
    setMonth(startOfMonth(selected));
  }, [selected]);

  useEffect(() => {
    if (!focusCursor.current) return;
    focusCursor.current = false;
    grid.current?.querySelector<HTMLButtonElement>(`[data-date="${cursor}"]`)?.focus();
  }, [cursor, month]);

  // The day that takes Tab: the cursor when it's shown, else the picked day, today or the 1st.
  const tabStop = days.some((d) => d.date === cursor)
    ? cursor
    : (days.find((d) => d.selected && !d.outside) ?? days.find((d) => d.today && !d.outside) ?? days.find((d) => !d.outside))!.date;

  const moveTo = (date: string) => {
    focusCursor.current = true;
    setCursor(date);
    if (startOfMonth(date) !== month) setMonth(startOfMonth(date));
  };

  const pick = (date: string) => {
    if (value === undefined) setUncontrolled(date);
    focusCursor.current = true;
    setCursor(date);
    setMonth(startOfMonth(date));
    onValueChange?.(date);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const target = calendarKeyTarget(event.key, tabStop, { weekStart, rtl, shift: event.shiftKey });
    if (!target) return;
    event.preventDefault();
    moveTo(target);
  };

  const showMonth = (step: number) => {
    const next = addMonths(month, step);
    setMonth(next);
    setCursor(next);
  };

  return (
    <div ref={ref} className={calendarClassName({ full, className })} {...props}>
      {presets && presets.length > 0 && (
        <div className="ayy-calendar__presets" role="group" aria-label={presetsLabel}>
          {presets.map((preset) => {
            const date = resolveCalendarDate(preset.date, today);
            return (
              <button
                key={preset.date}
                type="button"
                className="ayy-calendar__preset"
                data-date={preset.date}
                aria-pressed={date === selected}
                onClick={() => pick(date)}
              >
                {preset.icon}
                {preset.label}
              </button>
            );
          })}
        </div>
      )}
      <div className="ayy-calendar__header">
        <span id={titleId} className="ayy-calendar__title" aria-live="polite">
          {labels.month(month)}
        </span>
        <button type="button" className="ayy-calendar__nav" aria-label={previousLabel} onClick={() => showMonth(-1)}>
          <Icon icon={ArrowLeft01Icon} directional />
        </button>
        <button type="button" className="ayy-calendar__nav" aria-label={nextLabel} onClick={() => showMonth(1)}>
          <Icon icon={ArrowRight01Icon} directional />
        </button>
      </div>
      <div className="ayy-calendar__weekdays" aria-hidden="true">
        {labels.weekdays(weekStart).map((name) => (
          <span key={name}>{name}</span>
        ))}
      </div>
      <div ref={grid} className="ayy-calendar__grid" role="group" aria-labelledby={titleId} onKeyDown={onKeyDown}>
        {days.map((d) => (
          <button
            key={d.date}
            type="button"
            className="ayy-calendar__day"
            data-date={d.date}
            data-outside={d.outside ? "" : undefined}
            tabIndex={d.date === tabStop ? 0 : -1}
            aria-label={labels.day(d.date)}
            aria-pressed={d.selected}
            aria-current={d.today ? "date" : undefined}
            aria-disabled={d.disabled || undefined}
            onClick={() => {
              if (!d.disabled) pick(d.date);
            }}
          >
            {d.day}
          </button>
        ))}
      </div>
      {footer && <div className="ayy-calendar__footer">{footer}</div>}
    </div>
  );
});

export interface DatePickerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "defaultValue" | "onChange"> {
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (date: string) => void;
  /** Shown while no date is picked. Default "Pick a date". */
  placeholder?: string;
  /** How the trigger writes the date. Default: "7 Oct 2026" in the locale. */
  format?: (date: string) => string;
  min?: string;
  max?: string;
  today?: string;
  weekStart?: Weekday;
  locale?: string;
  size?: InputSize;
  /** Form name: a hidden input carries the ISO date. */
  name?: string;
  /** Shortcuts and footer of the calendar inside. */
  presets?: CalendarPreset[];
  footer?: ReactNode;
}

/** A field-like button showing the date; it opens a Calendar in a popover and closes when a day is picked. */
export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(function DatePicker(
  {
    value,
    defaultValue = null,
    onValueChange,
    placeholder = "Pick a date",
    format,
    min,
    max,
    today,
    weekStart,
    locale,
    size,
    name,
    presets,
    footer,
    className,
    "aria-describedby": describedBy,
    ...props
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const selected = value === undefined ? uncontrolled : value;
  const trigger = useRef<HTMLButtonElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const controller = useRef<PopoverController | null>(null);
  const [open, setOpen] = useState(false);
  const contentId = useId();
  const valueId = useId();

  useEffect(() => {
    if (!trigger.current || !content.current) return;
    const c = connectPopover(trigger.current, content.current, { side: "bottom", align: "start", onToggle: setOpen });
    controller.current = c;
    return () => {
      c.destroy();
      controller.current = null;
    };
  }, []);

  // Opening moves focus into the month, to the picked day.
  useEffect(() => {
    if (open) content.current?.querySelector<HTMLButtonElement>('.ayy-calendar__day[tabindex="0"]')?.focus();
  }, [open]);

  const text = selected ? (format ? format(selected) : formatDate(selected, locale)) : "";
  return (
    <>
      <button
        ref={mergeRefs(ref, trigger)}
        type="button"
        aria-haspopup="dialog"
        aria-controls={contentId}
        // A <label for> names the button, so the date is read as its description.
        aria-describedby={cx(valueId, describedBy)}
        className={cx(inputClass({ size }), "ayy-date-picker", className)}
        {...props}
      >
        <Icon icon={Calendar03Icon} />
        <span id={valueId} className="ayy-date-picker__value" data-placeholder={placeholder}>
          {text}
        </span>
      </button>
      {name && <input type="hidden" name={name} value={selected ?? ""} />}
      <div ref={content} id={contentId} className={popoverClass} popover="auto" role="dialog" aria-label={placeholder}>
        {open && (
          <Calendar
            value={selected}
            min={min}
            max={max}
            today={today}
            weekStart={weekStart}
            locale={locale}
            presets={presets}
            footer={footer}
            onValueChange={(date) => {
              if (value === undefined) setUncontrolled(date);
              onValueChange?.(date);
              controller.current?.close();
            }}
          />
        )}
      </div>
    </>
  );
});
