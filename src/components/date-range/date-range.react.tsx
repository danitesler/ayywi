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
} from "react";
import { cx } from "../../lib/cx";
import { ArrowLeft01Icon, ArrowRight01Icon, Calendar03Icon } from "../../lib/icons";
import { mergeRefs } from "../../lib/refs";
import { Icon } from "../icon/icon.react";
import { inputClass } from "../input/input";
import { connectPopover, popoverClass, type PopoverController } from "../popover/popover";
import { addMonths, localeWeekStart, startOfMonth, todayIso } from "../calendar/calendar";
import {
  dateRangeClassName,
  dateRangeKeyTarget,
  dateRangeLabels,
  dateRangeMonth,
  formatDateRange,
  type DateRangePickerSize,
  type Weekday,
} from "./date-range";

export interface DateRangeProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** The picked range: ["2026-10-12", "2026-10-18"], or null. */
  value?: [string, string] | null;
  defaultValue?: [string, string] | null;
  onValueChange?: (range: [string, string]) => void;
  /** Number of months shown side-by-side. Default 2. */
  months?: number;
  /** Earliest and latest day that can be picked (ISO). Days outside are disabled. */
  min?: string;
  max?: string;
  /** Override today (tests, another time zone). */
  today?: string;
  /** First day of the week, 0 = Sunday. Default: the locale's. */
  weekStart?: Weekday;
  /** Names of months and days. Default: the browser's language. */
  locale?: string;
  /** Accessible names of the month arrows. Translate them. */
  previousLabel?: string;
  nextLabel?: string;
}

/** Two (or more) months of day buttons to pick a start and end date range. */
export const DateRange = forwardRef<HTMLDivElement, DateRangeProps>(function DateRange(
  {
    value,
    defaultValue = null,
    onValueChange,
    months = 2,
    min,
    max,
    today: todayProp,
    weekStart: weekStartProp,
    locale,
    previousLabel = "Previous month",
    nextLabel = "Next month",
    className,
    ...props
  },
  ref,
) {
  const today = todayProp ?? todayIso();
  const [uncontrolled, setUncontrolled] = useState<[string, string] | null>(defaultValue);
  const selected = value === undefined ? uncontrolled : value;
  const [pendingStart, setPendingStart] = useState<string | null>(null);
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string>(selected?.[0] ?? today);
  const [startMonth, setStartMonth] = useState<string>(() => startOfMonth(selected?.[0] ?? today));

  const containerRef = useRef<HTMLDivElement>(null);
  const focusCursor = useRef(false);
  const weekStart = weekStartProp ?? localeWeekStart(locale);
  const labels = useMemo(() => dateRangeLabels(locale), [locale]);
  const baseTitleId = useId();

  // A value set from outside updates the view
  useEffect(() => {
    if (selected && selected[0]) {
      setCursor(selected[0]);
      setStartMonth(startOfMonth(selected[0]));
    }
  }, [selected]);

  useEffect(() => {
    if (!focusCursor.current) return;
    focusCursor.current = false;
    containerRef.current?.querySelector<HTMLButtonElement>(`[data-date="${cursor}"]`)?.focus();
  }, [cursor, startMonth]);

  const displayedMonths = useMemo(() => {
    return Array.from({ length: Math.max(1, months) }, (_, i) => addMonths(startMonth, i));
  }, [startMonth, months]);

  const monthGrids = useMemo(() => {
    return displayedMonths.map((m) => ({
      month: m,
      days: dateRangeMonth({
        month: m,
        range: selected,
        hoverDate,
        pendingStart,
        today,
        min,
        max,
        weekStart,
      }),
    }));
  }, [displayedMonths, selected, hoverDate, pendingStart, today, min, max, weekStart]);

  // Tab stop: cursor if visible, else start of range, else today, else first non-outside day
  const allDays = monthGrids.flatMap((g) => g.days);
  const tabStop = allDays.some((d) => d.date === cursor)
    ? cursor
    : (allDays.find((d) => d.isStart && !d.outside) ?? allDays.find((d) => d.today && !d.outside) ?? allDays.find((d) => !d.outside))?.date ?? "";

  const showMonth = (step: number) => {
    setStartMonth((m) => addMonths(m, step));
  };

  const pick = (date: string) => {
    focusCursor.current = true;
    setCursor(date);
    if (pendingStart === null) {
      setPendingStart(date);
      setHoverDate(null);
    } else {
      const range: [string, string] = date < pendingStart ? [date, pendingStart] : [pendingStart, date];
      setPendingStart(null);
      setHoverDate(null);
      if (value === undefined) setUncontrolled(range);
      onValueChange?.(range);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, fromDate: string) => {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const target = dateRangeKeyTarget(event.key, fromDate, { weekStart, rtl, shift: event.shiftKey });
    if (!target) return;
    event.preventDefault();
    focusCursor.current = true;
    setCursor(target);

    const targetMonth = startOfMonth(target);
    if (!displayedMonths.includes(targetMonth)) {
      if (target < displayedMonths[0]) {
        setStartMonth(targetMonth);
      } else {
        setStartMonth(addMonths(targetMonth, -(months - 1)));
      }
    }
  };

  return (
    <div
      ref={mergeRefs(ref, containerRef)}
      className={dateRangeClassName({ className })}
      onMouseLeave={() => setHoverDate(null)}
      {...props}
    >
      {monthGrids.map((g, idx) => {
        const monthTitleId = `${baseTitleId}-${idx}`;
        const isFirst = idx === 0;
        const isLast = idx === monthGrids.length - 1;

        return (
          <div key={g.month} className="ayy-date-range__month">
            <div className="ayy-date-range__header">
              {isFirst ? (
                <button type="button" className="ayy-date-range__nav" aria-label={previousLabel} onClick={() => showMonth(-1)}>
                  <Icon icon={ArrowLeft01Icon} directional />
                </button>
              ) : (
                <span style={{ inlineSize: "var(--ayy-size-control-sm)" }} aria-hidden="true" />
              )}
              <span id={monthTitleId} className="ayy-date-range__title" aria-live="polite">
                {labels.month(g.month)}
              </span>
              {isLast ? (
                <button type="button" className="ayy-date-range__nav" aria-label={nextLabel} onClick={() => showMonth(1)}>
                  <Icon icon={ArrowRight01Icon} directional />
                </button>
              ) : (
                <span style={{ inlineSize: "var(--ayy-size-control-sm)" }} aria-hidden="true" />
              )}
            </div>
            <div className="ayy-date-range__weekdays" aria-hidden="true">
              {labels.weekdays(weekStart).map((name) => (
                <span key={name}>{name}</span>
              ))}
            </div>
            <div className="ayy-date-range__grid" role="group" aria-labelledby={monthTitleId}>
              {g.days.map((d) => (
                <button
                  key={d.date}
                  type="button"
                  className={cx(
                    "ayy-date-range__day",
                    d.isStart && "ayy-date-range__day--range-start",
                    d.isEnd && "ayy-date-range__day--range-end",
                    d.inRange && "ayy-date-range__day--in-range",
                  )}
                  data-date={d.date}
                  data-outside={d.outside ? "" : undefined}
                  tabIndex={d.date === tabStop ? 0 : -1}
                  aria-label={labels.day(d.date)}
                  aria-pressed={d.isStart || d.isEnd}
                  aria-current={d.today ? "date" : undefined}
                  aria-disabled={d.disabled || undefined}
                  onClick={() => {
                    if (!d.disabled) pick(d.date);
                  }}
                  onMouseEnter={() => {
                    if (pendingStart && !d.disabled) setHoverDate(d.date);
                  }}
                  onKeyDown={(e) => onKeyDown(e, d.date)}
                >
                  {d.day}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export interface DateRangePickerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "defaultValue" | "onChange"> {
  /** The picked range: ["2026-10-12", "2026-10-18"], or null. */
  value?: [string, string] | null;
  defaultValue?: [string, string] | null;
  onValueChange?: (range: [string, string]) => void;
  /** Shown while no range is picked. Default "Pick date range". */
  placeholder?: string;
  /** Custom range formatter. Default: "Oct 12 – Oct 18, 2026" in the locale. */
  format?: (range: [string, string]) => string;
  /** Number of months shown in the popover. Default 2. */
  months?: number;
  /** Earliest and latest day that can be picked (ISO). Days outside are disabled. */
  min?: string;
  max?: string;
  /** Override today. */
  today?: string;
  /** First day of the week, 0 = Sunday. Default: the locale's. */
  weekStart?: Weekday;
  /** Names of months and days. Default: the browser's language. */
  locale?: string;
  size?: DateRangePickerSize;
  /** Form name: hidden inputs carry start and end dates. */
  name?: string;
}

/** An input-like button displaying the picked range that opens a DateRange in a popover. */
export const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>(function DateRangePicker(
  {
    value,
    defaultValue = null,
    onValueChange,
    placeholder = "Pick date range",
    format,
    months = 2,
    min,
    max,
    today,
    weekStart,
    locale,
    size,
    name,
    className,
    "aria-describedby": describedBy,
    ...props
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState<[string, string] | null>(defaultValue);
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

  // Opening moves focus into the calendar, to the focused/picked day.
  useEffect(() => {
    if (open) content.current?.querySelector<HTMLButtonElement>('.ayy-date-range__day[tabindex="0"]')?.focus();
  }, [open]);

  const text = selected && selected[0] && selected[1] ? (format ? format(selected) : formatDateRange(selected[0], selected[1], locale)) : "";

  return (
    <>
      <button
        ref={mergeRefs(ref, trigger)}
        type="button"
        aria-haspopup="dialog"
        aria-controls={contentId}
        aria-describedby={cx(valueId, describedBy)}
        className={cx(inputClass({ size }), "ayy-date-range-picker", className)}
        {...props}
      >
        <Icon icon={Calendar03Icon} />
        <span id={valueId} className="ayy-date-range-picker__value" data-placeholder={placeholder}>
          {text}
        </span>
      </button>
      {name && (
        <>
          <input type="hidden" name={`${name}_start`} value={selected?.[0] ?? ""} />
          <input type="hidden" name={`${name}_end`} value={selected?.[1] ?? ""} />
        </>
      )}
      <div ref={content} id={contentId} className={popoverClass} popover="auto" role="dialog" aria-label={placeholder}>
        {open && (
          <DateRange
            value={selected}
            months={months}
            min={min}
            max={max}
            today={today}
            weekStart={weekStart}
            locale={locale}
            onValueChange={(range) => {
              if (value === undefined) setUncontrolled(range);
              onValueChange?.(range);
              controller.current?.close();
            }}
          />
        )}
      </div>
    </>
  );
});
