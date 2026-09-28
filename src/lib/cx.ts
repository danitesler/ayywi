export type ClassValue = string | false | null | undefined | 0;

/** Join truthy class names. ayywi classes never conflict, so no merging logic is needed. */
export function cx(...parts: ClassValue[]): string {
  let out = "";
  for (const part of parts) if (part) out = out ? `${out} ${part}` : part;
  return out;
}
