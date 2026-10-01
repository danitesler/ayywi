import { forwardRef, useState, type CSSProperties, type DragEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { CloudUploadIcon } from "../../lib/icons";
import { Icon } from "../icon/icon.react";
import { dragHasFiles, dropzoneClass, dropzoneHintClass, dropzoneTitleClass } from "./dropzone";

export interface DropzoneProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "title"> {
  /** Main line. Default "Drop files here or browse". */
  title?: ReactNode;
  /** What's accepted: "PNG or JPG, up to 5 MB". */
  hint?: ReactNode;
  /** Replaces the upload icon; null for none. */
  icon?: ReactNode;
  /** The files picked or dropped. accept isn't enforced on a drop, so check types and sizes here. */
  onFiles?: (files: File[]) => void;
  /** One line instead of a box. */
  compact?: boolean;
  /** On the <label>; every other prop goes to the file input. */
  className?: string;
  /** On the <label>. */
  style?: CSSProperties;
}

/** A drop zone that is also a file picker: a <label> around a native file input covering it. */
export const Dropzone = forwardRef<HTMLInputElement, DropzoneProps>(function Dropzone(
  { title, hint, icon, onFiles, compact, className, style, onChange, disabled, ...props },
  ref,
) {
  const [dragging, setDragging] = useState(false);
  const enter = (event: DragEvent) => {
    if (!disabled && dragHasFiles(event.nativeEvent)) setDragging(true);
  };
  const leave = (event: DragEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
  };
  return (
    <label
      className={dropzoneClass({ compact, className })}
      style={style}
      data-dragging={dragging ? "" : undefined}
      onDragEnter={enter}
      onDragLeave={leave}
      onDrop={() => setDragging(false)}
    >
      <input
        ref={ref}
        type="file"
        disabled={disabled}
        onChange={(event) => {
          onChange?.(event);
          onFiles?.(Array.from(event.currentTarget.files ?? []));
        }}
        {...props}
      />
      {icon === undefined ? <Icon icon={CloudUploadIcon} /> : icon}
      <span className={dropzoneTitleClass}>
        {title ?? (
          <>
            Drop files here or <span className="ayy-link">browse</span>
          </>
        )}
      </span>
      {hint && <span className={dropzoneHintClass}>{hint}</span>}
    </label>
  );
});
