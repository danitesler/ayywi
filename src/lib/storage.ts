/** localStorage helpers shared by the theme and icon pack setters. Internal: not re-exported from any entry. */
export function store(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage can be unavailable (private mode, sandboxed iframes)
  }
}

export function read<T extends string>(key: string, allowed: readonly string[], fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored && allowed.includes(stored)) return stored as T;
  } catch {
    // ignore
  }
  return fallback;
}
