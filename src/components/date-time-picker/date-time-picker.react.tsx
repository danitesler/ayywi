import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../lib/cx";
import { ArrowLeft01Icon, ArrowRight01Icon, Calendar03Icon, Clock01Icon } from "../../lib/icons";
import { mergeRefs } from "../../lib/refs";
import { Icon } from "../icon/icon.react";
import { Button } from "../button/button.react";
import { inputClass, type InputSize } from "../input/input";
import { connectPopover, popoverClass, type PopoverController } from "../popover/popover";
import {
  addMonths,
  centerTimePickerSelection,
  datePickerCellKeyTarget,
  datePickerClassName,
  datePickerKeyTarget,
  datePickerLabels,
  datePickerMonth,
  datePickerMonths,
  datePickerYearPageStart,
  datePickerYears,
  dateRangeClassName,
  dateRangeKeyTarget,
  dateRangeLabels,
  dateRangeMonth,
  dateTimePickerClassName,
  dateTimePickerTriggerClassName,
  formatDate,
  formatDateRange,
  formatDateTime,
  formatTime,
  formatTimeString,
  generateHours,
  generateMinutes,
  localeWeekStart,
  pad2,
  parseTime,
  resolveDatePickerDate,
  startOfMonth,
  timePeriods,
  timePickerClassName,
  timePickerColClass,
  timePickerColumnsClass,
  timePickerHeaderClass,
  timePickerInputsClass,
  timePickerInputClass,
  timePickerItemClass,
  timePickerItemSelectedClass,
  timePickerPeriodBtnClass,
  timePickerSeparatorClass,
  timePickerTriggerClassName,
  todayIso,
  to12Hour,
  to24Hour,
  toTime24,
  type DatePickerView,
  type TimePeriod,
  type TimePickerFormat,
  type Weekday,
} from "./date-time-picker";

export interface DatePickerPreset {
  label: string;
  /** ISO date "2026-10-09" or a relative offset like "+0" (today), "+1" (tomorrow), "+7" (a week from today). */
  date: string;
  icon?: ReactNode;
}

// ============================================================================
// 1. DatePickerGrid (Inline Month Grid)
// ============================================================================

export interface DatePickerGridProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
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
  presets?: DatePickerPreset[];
  /** Accessible name of the presets group. Default "Quick dates". */
  presetsLabel?: string;
  /** Whether to show Clear and Today action buttons in a footer. Default false. */
  showActions?: boolean;
  /** Label for the Clear button. Default "Clear". */
  clearLabel?: string;
  /** Label for the Today button. Default "Today". */
  todayLabel?: string;
  /** Callback fired when Clear is clicked. */
  onClear?: () => void;
  /** Callback fired when Today is clicked. */
  onToday?: () => void;
  /** Under the month: action buttons like Clear, Today, or Done. */
  footer?: ReactNode;
}

/** One month of days to pick a date from. The grid is one Tab stop; arrows move the day, PageUp/PageDown the month. */
export const DatePickerGrid = forwardRef<HTMLDivElement, DatePickerGridProps>(function DatePickerGrid(
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
    showActions = false,
    clearLabel = "Clear",
    todayLabel = "Today",
    onClear,
    onToday,
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
  const [view, setView] = useState<DatePickerView>("days");
  const [yearPageStart, setYearPageStart] = useState(() => datePickerYearPageStart(Number((selected ?? today).slice(0, 4))));
  const rootRef = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const focusTarget = useRef<{ type: "cursor" | "cell" | "period"; view?: DatePickerView; cellIndex?: number } | null>(null);
  const weekStart = weekStartProp ?? localeWeekStart(locale);
  const labels = useMemo(() => datePickerLabels(locale), [locale]);
  const days = datePickerMonth({ month, value: selected, today, min, max, weekStart });
  const currentYear = Number(month.slice(0, 4));
  const currentMonthIndex = Number(month.slice(5, 7)) - 1;
  const monthItems = useMemo(
    () => datePickerMonths({ year: currentYear, selectedMonth: month, today, min, max, locale }),
    [currentYear, month, today, min, max, locale],
  );
  const yearItems = useMemo(
    () => datePickerYears({ startYear: yearPageStart, selectedYear: currentYear, today, min, max, locale }),
    [yearPageStart, currentYear, today, min, max, locale],
  );
  const activeYearIdx = yearItems.some((y) => y.selected) ? yearItems.findIndex((y) => y.selected) : 0;
  const titleId = useId();
  const parts = useMemo(() => labels.monthYearParts(month), [labels, month]);

  // A value set from outside shows its month.
  useEffect(() => {
    if (!selected) return;
    setCursor(selected);
    setMonth(startOfMonth(selected));
    setView("days");
  }, [selected]);

  useEffect(() => {
    const target = focusTarget.current;
    if (!target) return;
    focusTarget.current = null;
    if (target.type === "cursor") {
      grid.current?.querySelector<HTMLButtonElement>(`[data-date="${cursor}"]`)?.focus();
    } else if (target.type === "cell") {
      const sel = target.cellIndex !== undefined ? `[data-cell-index="${target.cellIndex}"]` : '[tabindex="0"]';
      (grid.current?.querySelector<HTMLButtonElement>(sel) ?? grid.current?.querySelector<HTMLButtonElement>("button"))?.focus();
    } else if (target.type === "period" && target.view) {
      rootRef.current?.querySelector<HTMLButtonElement>(`.ayy-date-picker-grid__period[data-view="${target.view}"]`)?.focus();
    }
  }, [cursor, month, view, yearPageStart]);

  const tabStop = days.some((d) => d.date === cursor)
    ? cursor
    : (days.find((d) => d.selected && !d.outside) ?? days.find((d) => d.today && !d.outside) ?? days.find((d) => !d.outside))?.date ?? today;

  const moveTo = (date: string) => {
    focusTarget.current = { type: "cursor" };
    setCursor(date);
    if (startOfMonth(date) !== month) setMonth(startOfMonth(date));
  };

  const pick = (date: string) => {
    if (value === undefined) setUncontrolled(date);
    focusTarget.current = { type: "cursor" };
    setCursor(date);
    setMonth(startOfMonth(date));
    setView("days");
    onValueChange?.(date);
  };

  const onDayKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const target = datePickerKeyTarget(event.key, tabStop, { weekStart, rtl, shift: event.shiftKey });
    if (!target) return;
    event.preventDefault();
    moveTo(target);
  };

  const onCellKeyDown = (event: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      const prevView = view;
      focusTarget.current = { type: "period", view: prevView };
      setView("days");
      return;
    }
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const nextIdx = datePickerCellKeyTarget(event.key, idx, { rtl });
    if (nextIdx === null) return;
    event.preventDefault();
    if (view === "months") {
      if (nextIdx < 0) {
        const wrapped = (nextIdx + 12) % 12;
        focusTarget.current = { type: "cell", cellIndex: wrapped };
        setMonth(`${String(currentYear - 1).padStart(4, "0")}-${pad2(wrapped + 1)}-01`);
      } else if (nextIdx >= 12) {
        const wrapped = nextIdx % 12;
        focusTarget.current = { type: "cell", cellIndex: wrapped };
        setMonth(`${String(currentYear + 1).padStart(4, "0")}-${pad2(wrapped + 1)}-01`);
      } else {
        focusTarget.current = { type: "cell", cellIndex: nextIdx };
        setMonth(`${month.slice(0, 4)}-${pad2(nextIdx + 1)}-01`);
      }
    } else {
      if (nextIdx < 0) {
        const wrapped = (nextIdx + 12) % 12;
        focusTarget.current = { type: "cell", cellIndex: wrapped };
        setYearPageStart((y) => y - 12);
      } else if (nextIdx >= 12) {
        const wrapped = nextIdx % 12;
        focusTarget.current = { type: "cell", cellIndex: wrapped };
        setYearPageStart((y) => y + 12);
      } else {
        grid.current?.querySelector<HTMLButtonElement>(`[data-cell-index="${nextIdx}"]`)?.focus();
      }
    }
  };

  const showStep = (step: number) => {
    if (view === "days") {
      const next = addMonths(month, step);
      setMonth(next);
      setCursor(next);
    } else if (view === "months") {
      const next = addMonths(month, step * 12);
      setMonth(next);
      setCursor(next);
    } else {
      setYearPageStart((y) => y + step * 12);
    }
  };

  const toggleView = (targetView: "months" | "years") => {
    if (view === targetView) {
      focusTarget.current = { type: "period", view: targetView };
      setView("days");
    } else {
      if (targetView === "years") setYearPageStart(datePickerYearPageStart(currentYear));
      focusTarget.current = { type: "cell" };
      setView(targetView);
    }
  };

  const prevAriaLabel = view === "years" ? "Previous years" : view === "months" ? "Previous year" : previousLabel;
  const nextAriaLabel = view === "years" ? "Next years" : view === "months" ? "Next year" : nextLabel;

  return (
    <div ref={mergeRefs(ref, rootRef)} className={datePickerClassName({ full, className })} {...props}>
      {presets && presets.length > 0 && (
        <div className="ayy-date-picker-grid__presets" role="group" aria-label={presetsLabel}>
          {presets.map((preset) => {
            const date = resolveDatePickerDate(preset.date, today);
            return (
              <button
                key={preset.date}
                type="button"
                className="ayy-date-picker-grid__preset"
                data-date={preset.date}
                aria-pressed={date === selected}
                onClick={() => pick(date)}
              >
                {preset.icon}
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      )}
      <div className="ayy-date-picker-grid__header">
        <h2 id={titleId} className="ayy-date-picker-grid__title" aria-live="polite">
          {view === "years" ? (
            <span>
              <button
                type="button"
                className="ayy-date-picker-grid__period"
                data-view="years"
                aria-pressed="true"
                onClick={() => toggleView("years")}
              >
                {`${yearPageStart}–${yearPageStart + 11}`}
              </button>
            </span>
          ) : (
            parts.map((p, i) => {
              const targetView = p.type === "month" ? "months" : "years";
              return (
                <span key={p.type}>
                  <button
                    type="button"
                    className="ayy-date-picker-grid__period"
                    data-view={targetView}
                    aria-pressed={view === targetView}
                    onClick={() => toggleView(targetView)}
                  >
                    {p.value}
                  </button>
                  {i < parts.length - 1 ? " " : null}
                </span>
              );
            })
          )}
        </h2>
        <button
          type="button"
          className="ayy-date-picker-grid__nav"
          aria-label={prevAriaLabel}
          onClick={() => showStep(-1)}
        >
          <Icon icon={ArrowLeft01Icon} />
        </button>
        <button
          type="button"
          className="ayy-date-picker-grid__nav"
          aria-label={nextAriaLabel}
          onClick={() => showStep(1)}
        >
          <Icon icon={ArrowRight01Icon} />
        </button>
      </div>
      {view === "days" ? (
        <>
          <div className="ayy-date-picker-grid__weekdays" aria-hidden="true">
            {labels.weekdays(weekStart).map((name, i) => (
              <span key={i}>{name}</span>
            ))}
          </div>
          <div
            ref={grid}
            className="ayy-date-picker-grid__grid"
            role="group"
            aria-labelledby={titleId}
            onKeyDown={onDayKeyDown}
          >
            {days.map((d) => (
              <button
                key={d.date}
                type="button"
                className="ayy-date-picker-grid__day"
                data-date={d.date}
                data-outside={d.outside || undefined}
                tabIndex={d.date === tabStop ? 0 : -1}
                aria-pressed={d.selected}
                aria-current={d.today ? "date" : undefined}
                aria-disabled={d.disabled || undefined}
                aria-label={labels.day(d.date)}
                onClick={() => !d.disabled && pick(d.date)}
              >
                {d.day}
              </button>
            ))}
          </div>
        </>
      ) : view === "months" ? (
        <div ref={grid} className="ayy-date-picker-grid__months" role="group" aria-label={labels.yearOnly(month)}>
          {monthItems.map((m) => (
            <button
              key={m.month}
              type="button"
              className="ayy-date-picker-grid__cell"
              data-month={m.month}
              data-cell-index={m.index}
              tabIndex={m.index === currentMonthIndex ? 0 : -1}
              aria-pressed={m.selected}
              aria-current={m.current ? "date" : undefined}
              aria-disabled={m.disabled || undefined}
              aria-label={m.fullLabel}
              onKeyDown={(e) => onCellKeyDown(e, m.index)}
              onClick={() => {
                if (m.disabled) return;
                focusTarget.current = { type: "cursor" };
                setMonth(m.month);
                setCursor(m.month);
                setView("days");
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      ) : (
        <div ref={grid} className="ayy-date-picker-grid__years" role="group" aria-label={`${yearPageStart}–${yearPageStart + 11}`}>
          {yearItems.map((y, idx) => (
            <button
              key={y.year}
              type="button"
              className="ayy-date-picker-grid__cell"
              data-year={y.year}
              data-cell-index={idx}
              tabIndex={idx === activeYearIdx ? 0 : -1}
              aria-pressed={y.selected}
              aria-current={y.current ? "date" : undefined}
              aria-disabled={y.disabled || undefined}
              aria-label={y.label}
              onKeyDown={(e) => onCellKeyDown(e, idx)}
              onClick={() => {
                if (y.disabled) return;
                const nextMonth = `${String(y.year).padStart(4, "0")}-${month.slice(5, 7)}-01`;
                focusTarget.current = { type: "cursor" };
                setMonth(nextMonth);
                setCursor(nextMonth);
                setView("days");
              }}
            >
              {y.label}
            </button>
          ))}
        </div>
      )}
      {(footer || showActions) && (
        <div className="ayy-date-picker-grid__footer">
          {footer ? (
            footer
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => {
                  if (value === undefined) setUncontrolled(null);
                  onValueChange?.("");
                  onClear?.();
                }}
              >
                {clearLabel}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                type="button"
                disabled={Boolean((min && today < min) || (max && today > max))}
                onClick={() => {
                  pick(today);
                  onToday?.();
                }}
              >
                {todayLabel}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
});

// ============================================================================
// 2. DatePicker (Popover Trigger Button)
// ============================================================================

export interface DatePickerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "defaultValue" | "value"> {
  /** The picked day, "2026-10-07". null for none. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (date: string) => void;
  /** Shown while no day is picked. Default "Pick a date". */
  placeholder?: string;
  /** Format function for the trigger's label. Default uses the locale. */
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
  presets?: DatePickerPreset[];
  footer?: ReactNode;
  /** Whether to show Clear and Today action buttons in the popover footer. Default true. */
  showActions?: boolean;
  clearLabel?: string;
  todayLabel?: string;
  onClear?: () => void;
  onToday?: () => void;
}

/** A field-like button showing the date; opens DatePickerGrid in a popover and closes when picked. */
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
    showActions = true,
    clearLabel,
    todayLabel,
    onClear,
    onToday,
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

  useEffect(() => {
    if (open) content.current?.querySelector<HTMLButtonElement>('.ayy-date-picker-grid__day[tabindex="0"]')?.focus();
  }, [open]);

  const text = selected ? (format ? format(selected) : formatDate(selected, locale)) : "";
  return (
    <>
      <button
        ref={mergeRefs(ref, trigger)}
        type="button"
        aria-haspopup="dialog"
        aria-controls={contentId}
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
        <DatePickerGrid
          value={selected}
          min={min}
          max={max}
          today={today}
          weekStart={weekStart}
          locale={locale}
          presets={presets}
          footer={footer}
          showActions={showActions}
          clearLabel={clearLabel}
          todayLabel={todayLabel}
          onClear={() => {
            // The picker's Clear has already reported the empty value through onValueChange.
            onClear?.();
            controller.current?.close();
          }}
          onToday={() => {
            onToday?.();
            controller.current?.close();
          }}
          onValueChange={(date) => {
            if (value === undefined) setUncontrolled(date);
            onValueChange?.(date);
            controller.current?.close();
          }}
        />
      </div>
    </>
  );
});

// ============================================================================
// 3. DateRange (Inline Multi-Month Grid)
// ============================================================================

export interface DateRangeProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** The picked range: ["2026-10-12", "2026-10-18"], or null. */
  value?: [string, string] | null;
  defaultValue?: [string, string] | null;
  /** Called with the picked range, and with null when Clear empties it. */
  onValueChange?: (range: [string, string] | null) => void;
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
  /** Under the range months: action buttons or custom footer. */
  footer?: ReactNode;
  /** Whether to show Clear and Today action buttons in a footer. Default false. */
  showActions?: boolean;
  clearLabel?: string;
  todayLabel?: string;
  onClear?: () => void;
  onToday?: () => void;
}

/** Two (or more) months of day buttons side-by-side to pick a start and end date range. */
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
    footer,
    showActions = false,
    clearLabel = "Clear",
    todayLabel = "Today",
    onClear,
    onToday,
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
  const [activePicker, setActivePicker] = useState<{ monthIdx: number; view: "months" | "years"; yearPageStart: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const focusTarget = useRef<{ type: "cursor" | "cell" | "period"; monthIdx?: number; view?: "months" | "years"; cellIndex?: number } | null>(null);
  const weekStart = weekStartProp ?? localeWeekStart(locale);
  const labels = useMemo(() => dateRangeLabels(locale), [locale]);
  const baseTitleId = useId();

  useEffect(() => {
    if (selected && selected[0]) {
      setCursor(selected[0]);
      setStartMonth(startOfMonth(selected[0]));
      setActivePicker(null);
    }
  }, [selected]);

  useEffect(() => {
    const target = focusTarget.current;
    if (!target) return;
    focusTarget.current = null;
    if (target.type === "cursor") {
      containerRef.current?.querySelector<HTMLButtonElement>(`.ayy-date-range__day[data-date="${cursor}"]`)?.focus();
    } else if (target.type === "cell" && target.monthIdx !== undefined) {
      const col = containerRef.current?.querySelector<HTMLElement>(`[data-month-idx="${target.monthIdx}"]`);
      const sel = target.cellIndex !== undefined ? `[data-cell-index="${target.cellIndex}"]` : '[tabindex="0"]';
      (col?.querySelector<HTMLButtonElement>(`.ayy-date-range__cell${sel}`) ?? col?.querySelector<HTMLButtonElement>(".ayy-date-range__cell"))?.focus();
    } else if (target.type === "period" && target.monthIdx !== undefined && target.view) {
      containerRef.current?.querySelector<HTMLButtonElement>(`.ayy-date-range__period[data-month-idx="${target.monthIdx}"][data-view="${target.view}"]`)?.focus();
    }
  }, [cursor, startMonth, activePicker]);

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

  const allDays = monthGrids.flatMap((g) => g.days);
  const tabStop = allDays.some((d) => d.date === cursor)
    ? cursor
    : (allDays.find((d) => d.isStart && !d.outside) ?? allDays.find((d) => d.today && !d.outside) ?? allDays.find((d) => !d.outside))?.date ?? "";

  const showStep = (step: number) => {
    if (activePicker?.view === "years") {
      setActivePicker((prev) => (prev ? { ...prev, yearPageStart: prev.yearPageStart + step * 12 } : null));
    } else if (activePicker?.view === "months") {
      setStartMonth((m) => addMonths(m, step * 12));
    } else {
      setStartMonth((m) => addMonths(m, step));
    }
  };

  const pick = (date: string) => {
    focusTarget.current = { type: "cursor" };
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

  const onDayKeyDown = (event: KeyboardEvent<HTMLButtonElement>, fromDate: string) => {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const target = dateRangeKeyTarget(event.key, fromDate, { weekStart, rtl, shift: event.shiftKey });
    if (!target) return;
    event.preventDefault();
    focusTarget.current = { type: "cursor" };
    setCursor(target);

    const targetMonth = startOfMonth(target);
    const firstMonth = displayedMonths[0];
    const lastMonth = displayedMonths[displayedMonths.length - 1];
    if (targetMonth < firstMonth) {
      setStartMonth(targetMonth);
    } else if (targetMonth > lastMonth) {
      setStartMonth(addMonths(targetMonth, -(displayedMonths.length - 1)));
    }
  };

  const onCellKeyDown = (event: KeyboardEvent<HTMLButtonElement>, monthIdx: number, idx: number) => {
    if (!activePicker) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      const prevView = activePicker.view;
      focusTarget.current = { type: "period", monthIdx, view: prevView };
      setActivePicker(null);
      return;
    }
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const nextIdx = datePickerCellKeyTarget(event.key, idx, { rtl });
    if (nextIdx === null) return;
    event.preventDefault();
    if (activePicker.view === "months") {
      if (nextIdx < 0) {
        focusTarget.current = { type: "cell", monthIdx, cellIndex: (nextIdx + 12) % 12 };
        setStartMonth((m) => addMonths(m, -12));
      } else if (nextIdx >= 12) {
        focusTarget.current = { type: "cell", monthIdx, cellIndex: nextIdx % 12 };
        setStartMonth((m) => addMonths(m, 12));
      } else {
        containerRef.current?.querySelector<HTMLButtonElement>(`[data-month-idx="${monthIdx}"] .ayy-date-range__cell[data-cell-index="${nextIdx}"]`)?.focus();
      }
    } else {
      if (nextIdx < 0) {
        focusTarget.current = { type: "cell", monthIdx, cellIndex: (nextIdx + 12) % 12 };
        setActivePicker((prev) => (prev ? { ...prev, yearPageStart: prev.yearPageStart - 12 } : null));
      } else if (nextIdx >= 12) {
        focusTarget.current = { type: "cell", monthIdx, cellIndex: nextIdx % 12 };
        setActivePicker((prev) => (prev ? { ...prev, yearPageStart: prev.yearPageStart + 12 } : null));
      } else {
        containerRef.current?.querySelector<HTMLButtonElement>(`[data-month-idx="${monthIdx}"] .ayy-date-range__cell[data-cell-index="${nextIdx}"]`)?.focus();
      }
    }
  };

  const toggleColView = (monthIdx: number, colMonth: string, targetView: "months" | "years") => {
    if (activePicker?.monthIdx === monthIdx && activePicker.view === targetView) {
      focusTarget.current = { type: "period", monthIdx, view: targetView };
      setActivePicker(null);
    } else {
      focusTarget.current = { type: "cell", monthIdx };
      setActivePicker({
        monthIdx,
        view: targetView,
        yearPageStart: datePickerYearPageStart(Number(colMonth.slice(0, 4))),
      });
    }
  };

  const prevAriaLabel = activePicker?.view === "years" ? "Previous years" : activePicker?.view === "months" ? "Previous year" : previousLabel;
  const nextAriaLabel = activePicker?.view === "years" ? "Next years" : activePicker?.view === "months" ? "Next year" : nextLabel;

  return (
    <div
      ref={mergeRefs(ref, containerRef)}
      className={dateRangeClassName({ className })}
      role="group"
      aria-label="Date range"
      onPointerLeave={() => setHoverDate(null)}
      style={{
        ...(months && months !== 2 ? ({ "--_months": months } as CSSProperties) : {}),
        ...props.style,
      }}
      {...props}
    >
      {monthGrids.map((g, monthIdx) => {
        const titleId = `${baseTitleId}-${monthIdx}`;
        const isFirst = monthIdx === 0;
        const isLast = monthIdx === monthGrids.length - 1;
        const colView: DatePickerView = activePicker?.monthIdx === monthIdx ? activePicker.view : "days";
        const currentYear = Number(g.month.slice(0, 4));
        const currentMonthIndex = Number(g.month.slice(5, 7)) - 1;
        const yearStart = activePicker?.monthIdx === monthIdx ? activePicker.yearPageStart : datePickerYearPageStart(currentYear);
        const parts = labels.monthYearParts(g.month);
        const monthItems = colView === "months" ? datePickerMonths({ year: currentYear, selectedMonth: g.month, today, min, max, locale }) : [];
        const yearItems = colView === "years" ? datePickerYears({ startYear: yearStart, selectedYear: currentYear, today, min, max, locale }) : [];
        const activeYearIdx = yearItems.some((y) => y.selected) ? yearItems.findIndex((y) => y.selected) : 0;

        return (
          <div key={g.month} className="ayy-date-range__month" data-month-idx={monthIdx}>
            <div className="ayy-date-range__header">
              {isFirst ? (
                <button
                  type="button"
                  className="ayy-date-range__nav"
                  aria-label={prevAriaLabel}
                  onClick={() => showStep(-1)}
                >
                  <Icon icon={ArrowLeft01Icon} />
                </button>
              ) : (
                <span className="ayy-date-range__nav" aria-hidden="true" style={{ visibility: "hidden" }} />
              )}
              <h2 id={titleId} className="ayy-date-range__title" aria-live="polite">
                {colView === "years" ? (
                  <span>
                    <button
                      type="button"
                      className="ayy-date-range__period"
                      data-view="years"
                      data-month-idx={monthIdx}
                      aria-pressed="true"
                      onClick={() => toggleColView(monthIdx, g.month, "years")}
                    >
                      {`${yearStart}–${yearStart + 11}`}
                    </button>
                  </span>
                ) : (
                  parts.map((p, i) => {
                    const targetView = p.type === "month" ? "months" : "years";
                    return (
                      <span key={p.type}>
                        <button
                          type="button"
                          className="ayy-date-range__period"
                          data-view={targetView}
                          data-month-idx={monthIdx}
                          aria-pressed={colView === targetView}
                          onClick={() => toggleColView(monthIdx, g.month, targetView)}
                        >
                          {p.value}
                        </button>
                        {i < parts.length - 1 ? " " : null}
                      </span>
                    );
                  })
                )}
              </h2>
              {isLast ? (
                <button
                  type="button"
                  className="ayy-date-range__nav"
                  aria-label={nextAriaLabel}
                  onClick={() => showStep(1)}
                >
                  <Icon icon={ArrowRight01Icon} />
                </button>
              ) : (
                <span className="ayy-date-range__nav" aria-hidden="true" style={{ visibility: "hidden" }} />
              )}
            </div>
            {colView === "days" ? (
              <>
                <div className="ayy-date-range__weekdays" aria-hidden="true">
                  {labels.weekdays(weekStart).map((name, i) => (
                    <span key={i}>{name}</span>
                  ))}
                </div>
                <div className="ayy-date-range__grid" role="group" aria-labelledby={titleId}>
                  {g.days.map((d) => {
                    const dayClasses = cx(
                      "ayy-date-range__day",
                      d.isStart && "ayy-date-range__day--range-start",
                      d.isEnd && "ayy-date-range__day--range-end",
                      d.inRange && "ayy-date-range__day--in-range",
                    );

                    return (
                      <button
                        key={d.date}
                        type="button"
                        className={dayClasses}
                        data-date={d.date}
                        data-outside={d.outside || undefined}
                        tabIndex={d.date === tabStop ? 0 : -1}
                        aria-pressed={d.isStart || d.isEnd}
                        aria-current={d.today ? "date" : undefined}
                        aria-disabled={d.disabled || undefined}
                        aria-label={labels.day(d.date)}
                        onClick={() => !d.disabled && pick(d.date)}
                        onKeyDown={(e) => onDayKeyDown(e, d.date)}
                        onPointerEnter={() => pendingStart && !d.outside && !d.disabled && setHoverDate(d.date)}
                      >
                        {d.day}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : colView === "months" ? (
              <div className="ayy-date-range__months" role="group" aria-label={labels.yearOnly(g.month)}>
                {monthItems.map((m) => (
                  <button
                    key={m.month}
                    type="button"
                    className="ayy-date-range__cell"
                    data-month={m.month}
                    data-month-idx={monthIdx}
                    data-cell-index={m.index}
                    tabIndex={m.index === currentMonthIndex ? 0 : -1}
                    aria-pressed={m.selected}
                    aria-current={m.current ? "date" : undefined}
                    aria-disabled={m.disabled || undefined}
                    aria-label={m.fullLabel}
                    onKeyDown={(e) => onCellKeyDown(e, monthIdx, m.index)}
                    onClick={() => {
                      if (m.disabled) return;
                      focusTarget.current = { type: "cursor" };
                      setStartMonth(addMonths(m.month, -monthIdx));
                      setCursor(m.month);
                      setActivePicker(null);
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="ayy-date-range__years" role="group" aria-label={`${yearStart}–${yearStart + 11}`}>
                {yearItems.map((y, cellIdx) => (
                  <button
                    key={y.year}
                    type="button"
                    className="ayy-date-range__cell"
                    data-year={y.year}
                    data-month-idx={monthIdx}
                    data-cell-index={cellIdx}
                    tabIndex={cellIdx === activeYearIdx ? 0 : -1}
                    aria-pressed={y.selected}
                    aria-current={y.current ? "date" : undefined}
                    aria-disabled={y.disabled || undefined}
                    aria-label={y.label}
                    onKeyDown={(e) => onCellKeyDown(e, monthIdx, cellIdx)}
                    onClick={() => {
                      if (y.disabled) return;
                      const pickedMonth = `${String(y.year).padStart(4, "0")}-${g.month.slice(5, 7)}-01`;
                      focusTarget.current = { type: "cursor" };
                      setStartMonth(addMonths(pickedMonth, -monthIdx));
                      setCursor(pickedMonth);
                      setActivePicker(null);
                    }}
                  >
                    {y.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {(footer || showActions) && (
        <div className="ayy-date-range__footer">
          {footer ? (
            footer
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => {
                  if (value === undefined) setUncontrolled(null);
                  setPendingStart(null);
                  setHoverDate(null);
                  onValueChange?.(null);
                  onClear?.();
                }}
              >
                {clearLabel}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                type="button"
                disabled={Boolean((min && today < min) || (max && today > max))}
                onClick={() => {
                  const todayRange: [string, string] = [today, today];
                  if (value === undefined) setUncontrolled(todayRange);
                  setPendingStart(null);
                  setHoverDate(null);
                  setStartMonth(startOfMonth(today));
                  setCursor(today);
                  setActivePicker(null);
                  onValueChange?.(todayRange);
                  onToday?.();
                }}
              >
                {todayLabel}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
});

// ============================================================================
// 4. DateRangePicker (Popover Trigger Button)
// ============================================================================

export interface DateRangePickerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "defaultValue" | "value"> {
  /** The picked range: ["2026-10-12", "2026-10-18"], or null. */
  value?: [string, string] | null;
  defaultValue?: [string, string] | null;
  /** Called with the picked range, and with null when Clear empties it. */
  onValueChange?: (range: [string, string] | null) => void;
  /** Shown while no range is picked. Default "Pick date range". */
  placeholder?: string;
  /** Format function for the trigger's label. Default uses the locale. */
  format?: (range: [string, string]) => string;
  /** Number of months shown side-by-side. Default 2. */
  months?: number;
  min?: string;
  max?: string;
  today?: string;
  weekStart?: Weekday;
  locale?: string;
  size?: InputSize;
  /** Form name: hidden inputs carry the start and end dates. */
  name?: string;
  /** Custom footer under the range months inside the popover. */
  footer?: ReactNode;
  /** Whether to show Clear and Today action buttons in the popover footer. Default true. */
  showActions?: boolean;
  clearLabel?: string;
  todayLabel?: string;
  onClear?: () => void;
  onToday?: () => void;
}

/** Field-like button that opens DateRange in a popover. */
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
    footer,
    showActions = true,
    clearLabel,
    todayLabel,
    onClear,
    onToday,
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
        <DateRange
          value={selected}
          months={months}
          min={min}
          max={max}
          today={today}
          weekStart={weekStart}
          locale={locale}
          footer={footer}
          showActions={showActions}
          clearLabel={clearLabel}
          todayLabel={todayLabel}
          onClear={() => {
            // The picker's Clear has already reported the empty value through onValueChange.
            onClear?.();
            controller.current?.close();
          }}
          onToday={() => {
            onToday?.();
            controller.current?.close();
          }}
          onValueChange={(range) => {
            if (value === undefined) setUncontrolled(range);
            onValueChange?.(range);
            controller.current?.close();
          }}
        />
      </div>
    </>
  );
});

// ============================================================================
// 5. TimePicker (Inline Columns)
// ============================================================================

export interface TimePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "value" | "defaultValue" | "onChange"> {
  /** The picked time string ("14:30" or "02:30 PM"). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (time: string) => void;
  /** Clock format: "12h" or "24h". Default "24h". */
  format?: TimePickerFormat;
  /** Minute step between options (e.g. 1, 5, 15, 30). Default 5. */
  step?: number;
  /** Whether to show manual numeric inputs at the top. Default true. */
  manualInput?: boolean;
}

/** TimePicker renders scrollable columns of hours, minutes, and optional period. */
export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(function TimePicker(
  {
    value,
    defaultValue,
    onValueChange,
    format = "24h",
    step = 5,
    manualInput = true,
    className,
    ...props
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? "");
  const selected = value === undefined ? uncontrolled : (value ?? "");
  const rootRef = useRef<HTMLDivElement>(null);
  const hourInputRef = useRef<HTMLInputElement>(null);
  const minuteInputRef = useRef<HTMLInputElement>(null);

  const parsed = useMemo(() => parseTime(selected), [selected]);

  let selectedHour: string | null = null;
  let selectedMinute: string | null = null;
  let selectedPeriod: TimePeriod = "AM";

  if (parsed) {
    // parsed.hours is 0–23 whichever clock the value was written in.
    const { hours: h12, period } = to12Hour(parsed.hours);
    selectedHour = pad2(format === "12h" ? h12 : parsed.hours);
    selectedMinute = pad2(parsed.minutes);
    selectedPeriod = period;
  }

  const [inputHour, setInputHour] = useState(selectedHour ?? "");
  const [inputMinute, setInputMinute] = useState(selectedMinute ?? "");

  useEffect(() => {
    if (document.activeElement !== hourInputRef.current) {
      setInputHour(selectedHour ?? "");
    }
  }, [selectedHour]);

  useEffect(() => {
    if (document.activeElement !== minuteInputRef.current) {
      setInputMinute(selectedMinute ?? "");
    }
  }, [selectedMinute]);

  const hours = useMemo(() => generateHours(format), [format]);
  const minutes = useMemo(() => generateMinutes(step), [step]);

  const handleSelectHour = (h: string) => {
    const hourNum = parseInt(h, 10);
    const minuteNum = selectedMinute ? parseInt(selectedMinute, 10) : 0;
    const hours24 = format === "12h" ? to24Hour(hourNum, selectedPeriod) : hourNum;
    const nextTime = formatTime(hours24, minuteNum, format);
    if (value === undefined) setUncontrolled(nextTime);
    onValueChange?.(nextTime);
  };

  const handleSelectMinute = (m: string) => {
    const minuteNum = parseInt(m, 10);
    let hourNum = 12;
    if (selectedHour) hourNum = parseInt(selectedHour, 10);
    const hours24 = format === "12h" ? to24Hour(hourNum, selectedPeriod) : hourNum;
    const nextTime = formatTime(hours24, minuteNum, format);
    if (value === undefined) setUncontrolled(nextTime);
    onValueChange?.(nextTime);
  };

  const handleSelectPeriod = (p: TimePeriod) => {
    const hourNum = selectedHour ? parseInt(selectedHour, 10) : 12;
    const minuteNum = selectedMinute ? parseInt(selectedMinute, 10) : 0;
    const hours24 = to24Hour(hourNum, p);
    const nextTime = formatTime(hours24, minuteNum, format);
    if (value === undefined) setUncontrolled(nextTime);
    onValueChange?.(nextTime);
  };

  const onHourInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
    setInputHour(raw);
    if (!raw) return;
    const num = parseInt(raw, 10);
    const maxH = format === "12h" ? 12 : 23;
    const minH = format === "12h" ? 1 : 0;
    if (!isNaN(num) && num >= minH && num <= maxH) {
      const formatted = pad2(num);
      handleSelectHour(formatted);
      if (raw.length === 2 || (format === "12h" && num >= 2) || (format === "24h" && num >= 3)) {
        minuteInputRef.current?.focus();
        minuteInputRef.current?.select();
      }
    }
  };

  const onMinuteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
    setInputMinute(raw);
    if (!raw) return;
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num >= 0 && num <= 59) {
      const formatted = pad2(num);
      handleSelectMinute(formatted);
    }
  };

  const onHourInputBlur = () => {
    if (selectedHour) setInputHour(selectedHour);
    else if (inputHour) {
      const num = parseInt(inputHour, 10);
      const maxH = format === "12h" ? 12 : 23;
      const minH = format === "12h" ? 1 : 0;
      if (!isNaN(num) && num >= minH && num <= maxH) {
        setInputHour(pad2(num));
      }
    }
  };

  const onMinuteInputBlur = () => {
    if (selectedMinute) setInputMinute(selectedMinute);
    else if (inputMinute) {
      const num = parseInt(inputMinute, 10);
      if (!isNaN(num) && num >= 0 && num <= 59) {
        setInputMinute(pad2(num));
      }
    }
  };

  const onHourKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ":" || e.key === "ArrowRight") {
      if (e.key === ":" || e.currentTarget.selectionStart === e.currentTarget.value.length) {
        e.preventDefault();
        minuteInputRef.current?.focus();
        minuteInputRef.current?.select();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const current = selectedHour ? parseInt(selectedHour, 10) : (format === "12h" ? 12 : 0);
      const maxH = format === "12h" ? 12 : 23;
      const minH = format === "12h" ? 1 : 0;
      const nextH = current >= maxH ? minH : current + 1;
      handleSelectHour(pad2(nextH));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const current = selectedHour ? parseInt(selectedHour, 10) : (format === "12h" ? 12 : 0);
      const maxH = format === "12h" ? 12 : 23;
      const minH = format === "12h" ? 1 : 0;
      const nextH = current <= minH ? maxH : current - 1;
      handleSelectHour(pad2(nextH));
    }
  };

  const onMinuteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Backspace" && inputMinute === "") || (e.key === "ArrowLeft" && e.currentTarget.selectionStart === 0)) {
      e.preventDefault();
      hourInputRef.current?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const current = selectedMinute ? parseInt(selectedMinute, 10) : 0;
      const nextM = (current + step) % 60;
      handleSelectMinute(pad2(nextM));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const current = selectedMinute ? parseInt(selectedMinute, 10) : 0;
      const nextM = (current - step + 60) % 60;
      handleSelectMinute(pad2(nextM));
    }
  };

  useEffect(() => {
    if (rootRef.current) {
      for (const sel of rootRef.current.querySelectorAll<HTMLElement>('.ayy-time-picker__item[aria-selected="true"]')) {
        centerTimePickerSelection(sel);
      }
    }
  }, [selectedHour, selectedMinute, selectedPeriod]);

  return (
    <div
      ref={mergeRefs(ref, rootRef)}
      className={timePickerClassName({ className })}
      role="group"
      aria-label="Time picker"
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
        if (event.defaultPrevented) return;
        const btn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`.${timePickerItemClass}`);
        if (!btn) return;
        const col = btn.closest<HTMLElement>(`.${timePickerColClass}`);
        if (!col) return;
        const items = Array.from(col.querySelectorAll<HTMLButtonElement>(`.${timePickerItemClass}`));
        const idx = items.indexOf(btn);
        if (idx < 0) return;
        let nextIdx = -1;
        if (event.key === "ArrowDown") nextIdx = Math.min(items.length - 1, idx + 1);
        else if (event.key === "ArrowUp") nextIdx = Math.max(0, idx - 1);
        else if (event.key === "Home") nextIdx = 0;
        else if (event.key === "End") nextIdx = items.length - 1;
        if (nextIdx >= 0) {
          event.preventDefault();
          items[nextIdx]?.focus();
        }
      }}
      {...props}
    >
      {manualInput && (
        <div className={timePickerHeaderClass}>
          <div className={timePickerInputsClass}>
            <input
              ref={hourInputRef}
              type="text"
              inputMode="numeric"
              maxLength={2}
              className={timePickerInputClass}
              aria-label="Hours"
              value={inputHour}
              onChange={onHourInputChange}
              onBlur={onHourInputBlur}
              onKeyDown={onHourKeyDown}
            />
            <span className={timePickerSeparatorClass} aria-hidden="true">:</span>
            <input
              ref={minuteInputRef}
              type="text"
              inputMode="numeric"
              maxLength={2}
              className={timePickerInputClass}
              aria-label="Minutes"
              value={inputMinute}
              onChange={onMinuteInputChange}
              onBlur={onMinuteInputBlur}
              onKeyDown={onMinuteKeyDown}
            />
            {format === "12h" && (
              <button
                type="button"
                className={timePickerPeriodBtnClass}
                aria-label="Toggle AM/PM"
                onClick={() => handleSelectPeriod(selectedPeriod === "AM" ? "PM" : "AM")}
              >
                {selectedPeriod}
              </button>
            )}
          </div>
        </div>
      )}
      <div className={timePickerColumnsClass}>
        <div className={timePickerColClass} role="listbox" aria-label="Hours">
          {(() => {
            const hasSelected = hours.some((h) => selectedHour === h);
            return hours.map((h, i) => {
              const isSelected = selectedHour === h;
              const isFocusable = isSelected || (!hasSelected && i === 0);
              return (
                <button
                  key={h}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={isFocusable ? 0 : -1}
                  className={cx(timePickerItemClass, isSelected && timePickerItemSelectedClass)}
                  onClick={() => handleSelectHour(h)}
                >
                  {h}
                </button>
              );
            });
          })()}
        </div>
        <div className={timePickerColClass} role="listbox" aria-label="Minutes">
          {(() => {
            const hasSelected = minutes.some((m) => selectedMinute === m);
            return minutes.map((m, i) => {
              const isSelected = selectedMinute === m;
              const isFocusable = isSelected || (!hasSelected && i === 0);
              return (
                <button
                  key={m}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={isFocusable ? 0 : -1}
                  className={cx(timePickerItemClass, isSelected && timePickerItemSelectedClass)}
                  onClick={() => handleSelectMinute(m)}
                >
                  {m}
                </button>
              );
            });
          })()}
        </div>
        {format === "12h" && (
          <div className={timePickerColClass} role="listbox" aria-label="Period">
            {(() => {
              const hasSelected = timePeriods.some((p) => selectedPeriod === p);
              return timePeriods.map((p, i) => {
                const isSelected = selectedPeriod === p;
                const isFocusable = isSelected || (!hasSelected && i === 0);
                return (
                  <button
                    key={p}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={isFocusable ? 0 : -1}
                    className={cx(timePickerItemClass, isSelected && timePickerItemSelectedClass)}
                    onClick={() => handleSelectPeriod(p)}
                  >
                    {p}
                  </button>
                );
              });
            })()}
          </div>
        )}
      </div>
    </div>
  );
});

// ============================================================================
// 6. TimePickerTrigger (Popover Trigger Button)
// ============================================================================

export interface TimePickerTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "defaultValue" | "onChange"> {
  /** The picked time string ("14:30" or "02:30 PM"). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (time: string) => void;
  /** Shown while no time is picked. Default "Pick a time". */
  placeholder?: string;
  /** Clock format: "12h" or "24h". Default "24h". */
  format?: TimePickerFormat;
  /** Minute step between options. Default 5. */
  step?: number;
  size?: InputSize;
  /** Form name: a hidden input carries the time string. */
  name?: string;
}

/** TimePickerTrigger renders a field-like button that opens a TimePicker in a popover. */
export const TimePickerTrigger = forwardRef<HTMLButtonElement, TimePickerTriggerProps>(function TimePickerTrigger(
  {
    value,
    defaultValue,
    onValueChange,
    placeholder = "Pick a time",
    format = "24h",
    step = 5,
    size,
    name,
    className,
    "aria-describedby": describedBy,
    ...props
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? "");
  const selected = value === undefined ? uncontrolled : (value ?? "");
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

  useEffect(() => {
    if (open && content.current) {
      for (const sel of content.current.querySelectorAll<HTMLElement>('.ayy-time-picker__item[aria-selected="true"]')) {
        centerTimePickerSelection(sel);
      }
      const items = content.current;
      (items.querySelector<HTMLButtonElement>(".ayy-time-picker__item--selected") ?? items.querySelector<HTMLButtonElement>(".ayy-time-picker__item"))?.focus({ preventScroll: true });
    }
  }, [open]);

  const displayText = selected ? formatTimeString(selected, format) : "";

  return (
    <>
      <button
        ref={mergeRefs(ref, trigger)}
        type="button"
        aria-haspopup="dialog"
        aria-controls={contentId}
        aria-describedby={cx(valueId, describedBy)}
        className={timePickerTriggerClassName({ size, className })}
        {...props}
      >
        <Icon icon={Clock01Icon} />
        <span id={valueId} className="ayy-time-picker-trigger__value" data-placeholder={placeholder}>
          {displayText}
        </span>
      </button>
      {name && <input type="hidden" name={name} value={selected} />}
      <div ref={content} id={contentId} className={popoverClass} popover="auto" role="dialog" aria-label={placeholder}>
        <TimePicker
          value={selected}
          format={format}
          step={step}
          onValueChange={(time) => {
            if (value === undefined) setUncontrolled(time);
            onValueChange?.(time);
          }}
        />
      </div>
    </>
  );
});

// ============================================================================
// 7. DateTimePicker (Inline Combined Grid + Time)
// ============================================================================

export interface DateTimePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "value" | "defaultValue" | "onChange"> {
  /** Combined date and time ISO string ("2026-10-14T14:30"). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (dateTime: string) => void;
  format?: TimePickerFormat;
  step?: number;
  min?: string;
  max?: string;
  today?: string;
  weekStart?: Weekday;
  locale?: string;
  /** Custom footer under the combined date and time picker. */
  footer?: ReactNode;
  /** Whether to show Clear and Today action buttons in a footer. Default false. */
  showActions?: boolean;
  clearLabel?: string;
  todayLabel?: string;
  onClear?: () => void;
  onToday?: () => void;
}

/** DateTimePicker renders side-by-side DatePickerGrid and TimePicker for picking date and time together. */
export const DateTimePicker = forwardRef<HTMLDivElement, DateTimePickerProps>(function DateTimePicker(
  {
    value,
    defaultValue,
    onValueChange,
    format = "24h",
    step = 5,
    min,
    max,
    today,
    weekStart,
    locale,
    footer,
    showActions = false,
    clearLabel = "Clear",
    todayLabel = "Today",
    onClear,
    onToday,
    className,
    ...props
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? "");
  const selected = value === undefined ? uncontrolled : (value ?? "");

  const [datePart, timePart] = useMemo(() => {
    if (!selected) return ["", ""];
    const parts = selected.split("T");
    return [parts[0] || "", parts[1] || ""];
  }, [selected]);

  const handleDateChange = (newDate: string) => {
    const time = timePart || "12:00";
    const combined = `${newDate}T${time}`;
    if (value === undefined) setUncontrolled(combined);
    onValueChange?.(combined);
  };

  const handleTimeChange = (newTime: string) => {
    const date = datePart || (today ?? todayIso());
    // ISO date-time: the time part is always 24-hour, whatever the clock shows.
    const combined = `${date}T${toTime24(newTime)}`;
    if (value === undefined) setUncontrolled(combined);
    onValueChange?.(combined);
  };

  return (
    <div ref={ref} className={dateTimePickerClassName({ className })} role="group" aria-label="Date and time picker" {...props}>
      <div className="ayy-date-time-picker__date">
        <DatePickerGrid
          value={datePart || null}
          min={min}
          max={max}
          today={today}
          weekStart={weekStart}
          locale={locale}
          showActions={false}
          onValueChange={handleDateChange}
        />
      </div>
      <div className="ayy-date-time-picker__divider" aria-hidden="true" />
      <div className="ayy-date-time-picker__time">
        <TimePicker
          value={timePart}
          format={format}
          step={step}
          onValueChange={handleTimeChange}
        />
      </div>
      {(footer || showActions) && (
        <div className="ayy-date-time-picker__footer">
          {footer ? (
            footer
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => {
                  if (value === undefined) setUncontrolled("");
                  onValueChange?.("");
                  onClear?.();
                }}
              >
                {clearLabel}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                type="button"
                disabled={Boolean((min && (today ?? todayIso()) < min) || (max && (today ?? todayIso()) > max))}
                onClick={() => {
                  const t = today ?? todayIso();
                  const time = timePart || "12:00";
                  const combined = `${t}T${time}`;
                  if (value === undefined) setUncontrolled(combined);
                  onValueChange?.(combined);
                  onToday?.();
                }}
              >
                {todayLabel}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
});

// ============================================================================
// 8. DateTimePickerTrigger (Popover Combined Trigger Button)
// ============================================================================

export interface DateTimePickerTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "defaultValue" | "onChange"> {
  /** Combined date and time ISO string ("2026-10-14T14:30"). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (dateTime: string) => void;
  placeholder?: string;
  format?: TimePickerFormat;
  step?: number;
  min?: string;
  max?: string;
  today?: string;
  weekStart?: Weekday;
  locale?: string;
  size?: InputSize;
  name?: string;
  /** Custom footer under the combined picker inside the popover. */
  footer?: ReactNode;
  /** Whether to show Clear and Today action buttons in the popover footer. Default true. */
  showActions?: boolean;
  clearLabel?: string;
  todayLabel?: string;
  onClear?: () => void;
  onToday?: () => void;
}

/** Field-like button that opens DateTimePicker in a popover. */
export const DateTimePickerTrigger = forwardRef<HTMLButtonElement, DateTimePickerTriggerProps>(function DateTimePickerTrigger(
  {
    value,
    defaultValue,
    onValueChange,
    placeholder = "Pick date & time",
    format = "24h",
    step = 5,
    min,
    max,
    today,
    weekStart,
    locale,
    size,
    name,
    footer,
    showActions = true,
    clearLabel,
    todayLabel,
    onClear,
    onToday,
    className,
    "aria-describedby": describedBy,
    ...props
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? "");
  const selected = value === undefined ? uncontrolled : (value ?? "");
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

  useEffect(() => {
    if (open && content.current) {
      for (const sel of content.current.querySelectorAll<HTMLElement>('.ayy-time-picker__item[aria-selected="true"]')) {
        centerTimePickerSelection(sel);
      }
      content.current.querySelector<HTMLButtonElement>('.ayy-date-picker-grid__day[tabindex="0"]')?.focus();
    }
  }, [open]);

  const [datePart, timePart] = useMemo(() => {
    if (!selected) return ["", ""];
    const parts = selected.split("T");
    return [parts[0] || "", parts[1] || ""];
  }, [selected]);

  const displayText = datePart && timePart ? formatDateTime(datePart, timePart, locale, format) : "";

  return (
    <>
      <button
        ref={mergeRefs(ref, trigger)}
        type="button"
        aria-haspopup="dialog"
        aria-controls={contentId}
        aria-describedby={cx(valueId, describedBy)}
        className={dateTimePickerTriggerClassName({ size, className })}
        {...props}
      >
        <Icon icon={Calendar03Icon} />
        <span id={valueId} className="ayy-date-time-picker-trigger__value" data-placeholder={placeholder}>
          {displayText}
        </span>
      </button>
      {name && <input type="hidden" name={name} value={selected} />}
      <div ref={content} id={contentId} className={popoverClass} popover="auto" role="dialog" aria-label={placeholder}>
        <DateTimePicker
          value={selected}
          format={format}
          step={step}
          min={min}
          max={max}
          today={today}
          weekStart={weekStart}
          locale={locale}
          footer={footer}
          showActions={showActions}
          clearLabel={clearLabel}
          todayLabel={todayLabel}
          onClear={() => {
            // The picker's Clear has already reported the empty value through onValueChange.
            onClear?.();
            controller.current?.close();
          }}
          onToday={() => {
            onToday?.();
            controller.current?.close();
          }}
          onValueChange={(dt) => {
            if (value === undefined) setUncontrolled(dt);
            onValueChange?.(dt);
          }}
        />
      </div>
    </>
  );
});
