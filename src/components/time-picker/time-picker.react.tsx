import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import { cx } from "../../lib/cx";
import { mergeRefs } from "../../lib/refs";
import { Icon } from "../icon/icon.react";
import { connectPopover, popoverClass, type PopoverController } from "../popover/popover";
import {
  formatTime,
  formatTimeString,
  generateHours,
  generateMinutes,
  pad2,
  parseTimeString,
  timePeriods,
  timePickerClass,
  timePickerClockIconData,
  timePickerColClass,
  timePickerColumnsClass,
  timePickerItemClass,
  timePickerItemSelectedClass,
  timePickerTriggerClass,
  timePickerTriggerValueClass,
  to12Hour,
  to24Hour,
  type TimePeriod,
  type TimePickerFormat,
} from "./time-picker";

export interface TimePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "value" | "defaultValue" | "onChange"> {
  /** The picked time string ("14:30" or "02:30 PM"). */
  value?: string;
  /** Initial time value for uncontrolled usage. */
  defaultValue?: string;
  /** Callback fired when a time is selected. */
  onValueChange?: (time: string) => void;
  /** Clock format: "12h" or "24h". Default "24h". */
  format?: TimePickerFormat;
  /** Minute step between options (e.g. 1, 5, 15, 30). Default 5. */
  step?: number;
}

/** TimePicker renders scrollable columns of hours, minutes, and optional period. */
export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(function TimePicker(
  {
    value,
    defaultValue,
    onValueChange,
    format = "24h",
    step = 5,
    className,
    ...props
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? "");
  const selected = value === undefined ? uncontrolled : (value ?? "");
  const rootRef = useRef<HTMLDivElement>(null);

  const parsed = useMemo(() => parseTimeString(selected), [selected]);

  let selectedHour: string | null = null;
  let selectedMinute: string | null = null;
  let selectedPeriod: TimePeriod = "AM";

  if (parsed) {
    if (format === "12h") {
      const { hours: h12, period } = to12Hour(parsed.hours);
      selectedHour = pad2(h12);
      selectedMinute = pad2(parsed.minutes);
      selectedPeriod = period;
    } else {
      selectedHour = pad2(parsed.hours);
      selectedMinute = pad2(parsed.minutes);
      selectedPeriod = parsed.period;
    }
  }

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
    if (selectedHour) {
      hourNum = parseInt(selectedHour, 10);
    }
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

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cols = root.querySelectorAll<HTMLElement>(".ayy-time-picker__col");
    cols.forEach((col) => {
      const active = col.querySelector<HTMLElement>(".ayy-time-picker__item--selected");
      if (active) {
        col.scrollTop = active.offsetTop - col.offsetTop - (col.clientHeight - active.clientHeight) / 2;
      }
    });
  }, [selectedHour, selectedMinute, selectedPeriod]);

    return (
    <div
      ref={mergeRefs(ref, rootRef)}
      className={cx(timePickerClass(), className)}
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
      <div className={timePickerColumnsClass}>
        <div className={timePickerColClass} role="listbox" aria-label="Hours">
          {hours.map((h) => {
            const isSelected = selectedHour === h;
            return (
              <button
                key={h}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={cx(timePickerItemClass, isSelected && timePickerItemSelectedClass)}
                onClick={() => handleSelectHour(h)}
              >
                {h}
              </button>
            );
          })}
        </div>
        <div className={timePickerColClass} role="listbox" aria-label="Minutes">
          {minutes.map((m) => {
            const isSelected = selectedMinute === m;
            return (
              <button
                key={m}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={cx(timePickerItemClass, isSelected && timePickerItemSelectedClass)}
                onClick={() => handleSelectMinute(m)}
              >
                {m}
              </button>
            );
          })}
        </div>
        {format === "12h" && (
          <div className={timePickerColClass} role="listbox" aria-label="Period">
            {timePeriods.map((p) => {
              const isSelected = selectedPeriod === p;
              return (
                <button
                  key={p}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={cx(timePickerItemClass, isSelected && timePickerItemSelectedClass)}
                  onClick={() => handleSelectPeriod(p)}
                >
                  {p}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

export interface TimePickerTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "defaultValue" | "onChange"> {
  /** The picked time string ("14:30" or "02:30 PM"). */
  value?: string;
  /** Initial time value for uncontrolled usage. */
  defaultValue?: string;
  /** Callback fired when a time is selected. */
  onValueChange?: (time: string) => void;
  /** Shown while no time is picked. Default "Pick a time". */
  placeholder?: string;
  /** Clock format: "12h" or "24h". Default "24h". */
  format?: TimePickerFormat;
  /** Minute step between options. Default 5. */
  step?: number;
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
    if (open) {
      const selectedItem = content.current?.querySelector<HTMLButtonElement>(".ayy-time-picker__item--selected, .ayy-time-picker__item");
      selectedItem?.focus();
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
        className={cx(timePickerTriggerClass(), className)}
        {...props}
      >
        <Icon icon={timePickerClockIconData} />
        <span id={valueId} className={timePickerTriggerValueClass} data-placeholder={placeholder}>
          {displayText}
        </span>
      </button>
      {name && <input type="hidden" name={name} value={selected} />}
      <div ref={content} id={contentId} className={popoverClass} popover="auto" role="dialog" aria-label={placeholder}>
        {open && (
          <TimePicker
            value={selected}
            format={format}
            step={step}
            onValueChange={(time) => {
              if (value === undefined) setUncontrolled(time);
              onValueChange?.(time);
            }}
          />
        )}
      </div>
    </>
  );
});
