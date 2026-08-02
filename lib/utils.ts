import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import type {ServiceVariantRule} from "@/lib/types";
import type {ServiceSelection} from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function matchVariantRule(
  rules: ServiceVariantRule[],
  selection: ServiceSelection,
): ServiceVariantRule | null {
  return (
    rules.find((rule) => {
      const {sites, shopType, onboardingType, category, mode} = rule.match;

      if (sites) {
        const siteList = Array.isArray(sites) ? sites : [sites];
        if (!selection.sites || !siteList.includes(selection.sites)) {
          return false;
        }
      }
      if (shopType && shopType !== selection.shopType) return false;
      if (onboardingType && onboardingType !== selection.onboardingType) {
        return false;
      }
      if (category && category !== selection.category) return false;
      if (mode && mode !== selection.mode) return false;

      return true;
    }) ?? null
  );
}
