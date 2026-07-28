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

export type ServiceCase = {
  id: string;
  imageUrl: string;
  title: string;
  tag?: string;
};

export type Service = {
  id: string;
  label: string;
  description: string;
  optionGroups?: OptionGroup[];
  cases?: ServiceCase[];
  details?: string; // 新增：服务详细说明
  afterSalesRule?: string; // 新增：售后规则说明
};
