import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import type {ServiceVariantRule} from "@/lib/types";
import type {ServiceSelection} from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// utils.ts
export function matchVariantRule(
  rules: ServiceVariantRule[],
  selection: ServiceSelection,
): ServiceVariantRule | null {
  return (
    rules.find((rule) =>
      Object.entries(rule.match).every(([key, expected]) => {
        const actual = selection[key];
        if (!actual) return false;
        return Array.isArray(expected)
          ? expected.includes(actual)
          : expected === actual;
      }),
    ) ?? null
  );
}
