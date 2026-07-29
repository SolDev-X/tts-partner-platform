import type {OptionItem, Service} from "./types";

/**
 * 站点名称的唯一数据源。
 * 以后新增站点、改站点名称，只需要改这一处。
 */
const SITE_LABELS = {
  us: "美区",
  jp: "日区",
  uk: "英区",
  eu: "欧盟",
  sea: "东南亚",
  mx: "墨西哥",
} as const;

/**
 * 构造一个站点 option，name 统一从 SITE_LABELS 取，
 * 每个服务只需要传 id + 该服务下这个站点特有的规则（如 directMailRule）。
 */
function siteOption(
  id: keyof typeof SITE_LABELS,
  extra?: Partial<Omit<OptionItem, "id" | "name">>,
): OptionItem {
  return {id, name: SITE_LABELS[id], ...extra};
}

export const services: Service[] = [
  {
    id: "onboarding",
    label: "定邀/普招代入驻",
    description:
      "协助店铺完成定向邀约邀请码入驻/普招入驻申请流程，覆盖多站点，按平台规范提交资料。",
    optionGroups: [
      {
        key: "sites",
        title: "站点",
        options: [
          siteOption("us", {directMailRule: "invite-only"}),
          siteOption("jp", {directMailRule: "both"}),
          siteOption("uk", {directMailRule: "invite-only"}),
          siteOption("eu", {directMailRule: "invite-only"}),
          siteOption("sea", {directMailRule: "both"}),
          siteOption("mx", {directMailRule: "invite-only"}),
        ],
      },
      {
        key: "shopType",
        title: "店铺类型",
        options: [
          {id: "pop", name: "POP"},
          {id: "direct", name: "直邮"},
        ],
      },
      {
        key: "onboardingType",
        title: "入驻方式",
        options: [
          {id: "invite", name: "定邀"},
          {id: "public", name: "普招"},
        ],
      },
    ],
    cases: [
      {
        id: "case1",
        imageUrl: "/cases/onboarding/1.jpg",
        title: "日区店铺定邀入驻成功",
        tag: "日区 · 定邀",
      },
      {
        id: "case2",
        imageUrl: "/cases/onboarding/2.jpg",
        title: "美区POP入驻案例",
        tag: "美区 · POP",
      },
    ],
    details: "1. 提交入驻申请\n2. 顾问核实资料\n3. 平台审核\n4. 完成入驻",
    afterSalesRule:
      "审核未通过全额退款；服务过程中如遇平台政策调整，将及时同步处理方案。",
  },

  {
    id: "whitelist",
    label: "本土/跨境类目报白",
    description:
      "协助本土及跨境类目报白申请，资料整理与提交流程指导，按平台审核要求规范办理。",
    optionGroups: [
      {
        key: "sites",
        title: "站点",
        options: [siteOption("us"), siteOption("jp"), siteOption("sea")],
      },
      {
        key: "shopType",
        title: "店铺类型",
        options: [
          {id: "Cross-border", name: "跨境"},
          {id: "Local", name: "本土"},
        ],
      },
      {
        key: "category",
        title: "类目",
        options: [
          {
            id: "beauty",
            name: "美妆个护",
            availableSites: ["us", "jp", "sea"],
          },
          {id: "health", name: "保健品", availableSites: ["us", "jp", "sea"]},
          {id: "food", name: "食品饮料", availableSites: ["us", "jp", "sea"]},
          {id: "baby", name: "母婴用品", availableSites: ["us", "jp"]},
          {id: "pet", name: "宠物用品", availableSites: ["us", "jp", "sea"]},
          {id: "toys", name: "玩具和爱好", availableSites: ["us"]},
          {id: "collectibles", name: "收藏品", availableSites: ["sea"]},
          {
            id: "jewelry",
            name: "珠宝与衍生品",
            availableSites: ["jp", "sea"],
          },
        ],
      },
    ],
    cases: [
      {
        id: "case1",
        imageUrl: "/cases/whitelist/1.jpg",
        title: "美区美妆个护类目报白成功",
        tag: "美区 · 美妆个护",
      },
      {
        id: "case2",
        imageUrl: "/cases/whitelist/2.jpg",
        title: "东南亚食品饮料类目报白案例",
        tag: "东南亚 · 食品饮料",
      },
    ],
    // TODO: 补充本服务的具体办理流程
    details:
      "1. 提交类目报白申请\n2. 顾问核实资质资料\n3. 平台审核\n4. 类目开通",
    // TODO: 补充本服务的售后/保障说明
    afterSalesRule:
      "审核未通过全额退款；如平台类目政策调整，将及时同步处理方案。",
  },

  {
    id: "permissions",
    label: "开通全类目&一品多仓",
    description:
      "协助开通全类目权限及一品多仓模式，支持直邮与海外仓混发布局，适合多市场运营卖家。",
    optionGroups: [
      {
        key: "sites",
        title: "站点",
        options: [siteOption("jp"), siteOption("uk"), siteOption("eu")],
      },
      {
        key: "mode",
        title: "开通模式",
        options: [
          {id: "category", name: "全类目"},
          {id: "multiWarehouse", name: "一品多仓"},
        ],
      },
    ],
    cases: [
      {
        id: "case1",
        imageUrl: "/cases/permissions/1.jpg",
        title: "日区全类目权限开通案例",
        tag: "日区 · 全类目",
      },
      {
        id: "case2",
        imageUrl: "/cases/permissions/2.jpg",
        title: "英区一品多仓布局案例",
        tag: "英区 · 一品多仓",
      },
    ],
    // TODO: 补充本服务的具体办理流程
    details:
      "1. 提交权限开通申请\n2. 顾问核实店铺资质\n3. 平台审核\n4. 完成权限开通/仓配布局",
    // TODO: 补充本服务的售后/保障说明
    afterSalesRule: "审核未通过全额退款；仓配方案调整支持一次免费重新规划。",
  },
];
