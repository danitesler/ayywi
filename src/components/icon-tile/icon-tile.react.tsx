import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import { iconTileClass, type IconTileSize } from "./icon-tile";

export interface IconTileProps extends HTMLAttributes<HTMLSpanElement> {
  size?: IconTileSize;
  /** Accent for the glow and glyph. Any CSS colour or token, e.g. "var(--ayy-accent-system)". Else --ayy-spot is inherited. */
  spotColor?: string;
}

/** Decorative unless you give it an aria-label (then it's an image). */
export const IconTile = forwardRef<HTMLSpanElement, IconTileProps>(function IconTile(
  { size, spotColor, className, style, ...props },
  ref,
) {
  const labelled = Boolean(props["aria-label"] || props["aria-labelledby"]);
  return (
    <span
      ref={ref}
      className={iconTileClass({ size, className })}
      role={labelled ? "img" : undefined}
      aria-hidden={labelled ? undefined : true}
      style={spotColor ? ({ "--ayy-spot": spotColor, ...style } as CSSProperties) : style}
      {...props}
    />
  );
});
