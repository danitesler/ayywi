// Types for contract.mjs, so the preview (TypeScript) can import the same lists the scripts use.
export declare const PUBLIC_HOOKS: Record<string, string>;
export declare const UTILITIES: Record<string, string>;
export declare const CATEGORIES: Record<string, string>;
export declare const ORDER: string[];
export declare const ATTRIBUTES: Record<string, string>;
export declare const RULES: string[];
export interface Pattern {
  name: string;
  slug: string;
  summary: string;
  components: string[];
  example: string;
  steps: string[];
  phone: string[];
  specs: Record<string, string>;
  do: string[];
  dont: string[];
}
export declare const PATTERNS: Pattern[];
