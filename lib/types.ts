// types.ts
export type OptionItem = {
  id: string;
  name: string;
  directMailRule?: "invite-only" | "both";
  availableSites?: string[];
};

export type OptionGroup = {
  key: string;
  title: string;
  options: OptionItem[];
};

export type Service = {
  id: string;
  href?: string;
  label: string;
  description: string;
  optionGroups?: OptionGroup[];
};
