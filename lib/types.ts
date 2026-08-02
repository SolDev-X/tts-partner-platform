export interface OptionItem {
  id: string;
  name: string;
  /** 该选项仅在这些站点下显示；不填表示所有站点都显示 */
  availableSites?: string[];
}

export type OptionGroup = {
  key: string;
  title: string;
  options: OptionItem[];
};

export type ServiceCase = {
  id: string;
  imageUrl: string;
  title?: string;
};

/** 用户当前的选择状态：optionGroup.key -> 选中的 option id */
export type ServiceSelection = Record<string, string>;

export type CombinationRule = {
  /**
   * 触发条件：key 是 optionGroup 的 key，value 是要匹配的 option id。
   * value 可以是单个 id，也可以是数组（表示"命中数组里任意一个即可"）。
   * 一条规则里的多个 key 是"且"的关系，必须同时满足。
   */
  when: Record<string, string | string[]>;
  /**
   * 命中 when 条件后，需要禁用的选项：
   * key 是 optionGroup 的 key，value 是该组里需要变灰禁用的 option id 列表。
   */
  disable: Record<string, string[]>;
};

export type ServiceVariantMatch = {
  sites?: string | string[];
  shopType?: string;
  onboardingType?: string;
  category?: string;
  mode?: string;
};

export type ServiceVariantRule = {
  match: ServiceVariantMatch;
  requiredMaterials?: string[];
  eligibility?: string;
  disclaimer?: string;
  price?: string;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export type Service = {
  id: string;
  label: string;
  description: string;
  optionGroups?: OptionGroup[];
  combinationRules?: CombinationRule[];
  cases?: ServiceCase[];
  variantRules?: ServiceVariantRule[];
  faqs?: FAQItem[];
};
