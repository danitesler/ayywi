import { forwardRef, useState, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import {
  avatarClass,
  avatarFallbackClass,
  avatarGroupClass,
  avatarImageClass,
  avatarInitials,
  type AvatarShape,
  type AvatarSize,
} from "./avatar";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Person or thing shown. Becomes the accessible name and the initials. */
  name: string;
  src?: string;
  /** Override the initials (e.g. for names where first letters don't work). */
  fallback?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
}

/** Image with initials underneath — if the image fails, the initials show. */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, fallback, size, shape, className, ...props },
  ref,
) {
  const [failed, setFailed] = useState<string | null>(null);
  return (
    <span ref={ref} role="img" aria-label={name} className={avatarClass({ size, shape, className })} {...props}>
      <span className={avatarFallbackClass} aria-hidden="true">
        {fallback ?? avatarInitials(name)}
      </span>
      {src && failed !== src ? (
        <img className={avatarImageClass} src={src} alt="" loading="lazy" decoding="async" onError={() => setFailed(src)} />
      ) : null}
    </span>
  );
});

export const AvatarGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function AvatarGroup(
  { className, ...props },
  ref,
) {
  return <div ref={ref} role="group" className={cx(avatarGroupClass, className)} {...props} />;
});
