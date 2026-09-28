import type { MutableRefObject, Ref, RefCallback } from "react";

/** Combine several refs (callback or object) into one callback ref. */
export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(value);
      else if (ref) (ref as MutableRefObject<T | null>).current = value;
    }
  };
}
