import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import type {ServiceVariantRule} from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ServiceSelection = {
  sites?: string; // 单选就是 string,如果站点是多选就改成 string[]
  shopType?: string;
  onboardingType?: string;
};

export function matchVariantRule(
  rules: ServiceVariantRule[],
  selection: ServiceSelection,
): ServiceVariantRule | null {
  return (
    rules.find((rule) => {
      const {sites, shopType, onboardingType} = rule.match;
      if (sites && (!selection.sites || !sites.includes(selection.sites))) {
        return false;
      }
      if (shopType && shopType !== selection.shopType) return false;
      if (onboardingType && onboardingType !== selection.onboardingType) {
        return false;
      }
      return true;
    }) ?? null
  );
}
