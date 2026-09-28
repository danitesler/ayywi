import { cx } from "../../lib/cx";

export const avatarSizes = ["sm", "md", "lg", "xl"] as const;
export type AvatarSize = (typeof avatarSizes)[number];
export const avatarShapes = ["circle", "square"] as const;
export type AvatarShape = (typeof avatarShapes)[number];

export interface AvatarClassOptions {
  size?: AvatarSize;
  shape?: AvatarShape;
  className?: string;
}

export function avatarClass({ size = "md", shape = "circle", className }: AvatarClassOptions = {}): string {
  return cx("ayy-avatar", size !== "md" && `ayy-avatar--${size}`, shape === "square" && "ayy-avatar--square", className);
}

export const avatarGroupClass = "ayy-avatar-group";
export const avatarImageClass = "ayy-avatar__image";
export const avatarFallbackClass = "ayy-avatar__fallback";

/** Up to two initials from a name: "Maya Chen" → "MC", "maya" → "M". */
export function avatarInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const first = Array.from(words[0])[0] ?? "";
  const last = words.length > 1 ? (Array.from(words[words.length - 1])[0] ?? "") : "";
  return (first + last).toLocaleUpperCase();
}
