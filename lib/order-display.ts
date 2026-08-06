import {services} from "@/lib/data";

function isStringSelection(value: unknown): value is Record<string, string> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((item) => typeof item === "string")
  );
}

export function getOrderDisplayTitle(
  serviceId: string,
  fallbackLabel: string,
  selectionValue: unknown,
) {
  const service = services.find((item) => item.id === serviceId);
  const selection = isStringSelection(selectionValue) ? selectionValue : {};

  if (!service) return fallbackLabel;

  const preferredKeys = ["sites", "category", "onboardingType", "mode"];
  const labels = preferredKeys.flatMap((key) => {
    const group = service.optionGroups?.find((item) => item.key === key);
    const option = group?.options.find((item) => item.id === selection[key]);
    return option ? [option.name] : [];
  });

  return labels.length > 0 ? labels.slice(0, 3).join(" · ") : fallbackLabel;
}

export {isStringSelection};
