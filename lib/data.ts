import type {OptionItem, Service} from "./types";

const SITE_LABELS = {
  us: "美国",
  sea: "东南亚（5 国）",
  eu: "欧盟（12国）",
  uk: "英国",
  jp: "日本",
  mx: "墨西哥",
} as const;

function siteOption(
  id: keyof typeof SITE_LABELS,
  extra?: Partial<Omit<OptionItem, "id" | "name">>,
): OptionItem {
  return {id, name: SITE_LABELS[id], ...extra};
}

export const services: Service[] = [
  {
    id: "onboarding",
    label: "定邀/普招入驻代办",
    description:
      "为卖家提供定向邀约与公开招募两类入驻申请代办服务,覆盖多站点资质审核与材料提交,全程按平台规范执行。",
    optionGroups: [
      {
        key: "sites",
        title: "您在哪个市场售卖？",
        options: [
          siteOption("us"),
          siteOption("sea"),
          siteOption("eu"),
          siteOption("uk"),
          siteOption("jp"),
          siteOption("mx"),
        ],
      },

      {
        key: "category",
        title: "主营类目",
        options: [
          {id: "home", name: "家居用品"},
          {id: "kitchen", name: "厨房用品"},
          {id: "textile", name: "家纺布艺"},
          {id: "appliance", name: "家电"},
          {id: "womenswear", name: "女装与女士内衣"},
          {id: "muslim", name: "穆斯林时尚"},
          {id: "shoes", name: "鞋靴"},
          {id: "beauty", name: "美妆个护"},
          {id: "mobile", name: "手机与数码"},
          {id: "office", name: "电脑办公"},
          {id: "pet", name: "宠物用品"},
          {id: "baby", name: "母婴用品"},
          {id: "sports", name: "运动与户外"},
          {id: "toys", name: "玩具和爱好"},
          {id: "furniture", name: "家具"},
          {id: "hardware", name: "五金工具"},
          {id: "homeImprovement", name: "家装建材"},
          {id: "auto", name: "汽车与摩托车"},
          {id: "fashionAccessories", name: "时尚配件"},
          {id: "food", name: "食品饮料"},
          // 保健：墨西哥不开放
          {
            id: "health",
            name: "保健",
          },
          {id: "books", name: "图书、杂志和音频"},
          {id: "kidswear", name: "儿童时尚"},
          {id: "menswear", name: "男装与男士内衣"},
          {id: "bags", name: "箱包"},
          {id: "virtual", name: "虚拟商品"},
          {id: "collectibles", name: "收藏品"},

          {
            id: "jewelry",
            name: "珠宝与衍生品",
          },
          {id: "ticketing", name: "票务与代金券"},
        ],
      },
      {
        key: "shopType",
        title: "你在该市场使用的物流模式是？",
        options: [
          {id: "pop", name: "本地仓发货（客户下单后，从海外当地仓库直接发货）"},
          {
            id: "direct",
            name: "跨境直邮（客户下单后，从国内仓库直接发货到海外）",
          },
        ],
      },

      {
        key: "onboardingType",
        title: "选择入驻该市场方式？",
        options: [
          {id: "invite", name: "邀请码入驻"},
          {id: "public", name: "普招入驻"},
        ],
      },
    ],
    combinationRules: [
      {
        // 美区不支持直邮，只能 POP
        when: {sites: "us"},
        disable: {shopType: ["direct"]},
      },
      {
        // 墨西哥的保健类目：完全不支持入驻（POP、直邮都不行）
        when: {sites: "mx", category: "health"},
        disable: {shopType: ["pop", "direct"]},
      },
      {
        // 珠宝在英区/欧盟/墨西哥：完全不支持入驻
        when: {sites: ["uk", "eu", "mx"], category: "jewelry"},
        disable: {shopType: ["pop", "direct"]},
      },
      {
        // 英区/欧盟/墨西哥的直邮，仅支持定邀，普招不可选
        when: {sites: ["uk", "eu", "mx"], shopType: "direct"},
        disable: {onboardingType: ["public"]},
      },
      {
        // 珠宝在美区/日区：仅支持"直邮 + 定邀"
        when: {sites: ["us", "jp"], category: "jewelry"},
        disable: {shopType: ["pop"], onboardingType: ["public"]},
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
    variantRules: [
      {
        match: {
          onboardingType: "invite", // 邀请码入驻
        },
        requiredMaterials: [
          "手机号（未入驻过 TikTok Shop）",
          "营业执照（四角需完整露出）",
        ],
        eligibility:
          "法人名下无封店记录，正常经营中，且未在其他区域被封禁或拒绝过入驻申请，均可申请。",
        disclaimer:
          "如客户隐瞒执照存在的问题，导致邀请码下发后无法正常使用，本服务不承担责任。本服务仅负责协助获取入驻邀请码，保证邀请码在有效期内可正常使用；因平台规则或客户自身原因导致的使用问题，需自行处理。超过 30 个工作日未通过审核，可申请全额退款。",
      },
      {
        match: {
          onboardingType: "public", // 改成这个
        },
        requiredMaterials: [
          "主营类目",
          "手机号（未入驻过 TikTok Shop）",
          "邮箱（未入驻过 TikTok Shop）",
          "身份证正反(法人需要配合扫脸)",
          "营业执照（四角需完整露出）",
        ],
        eligibility:
          "法人名下无封店记录，正常经营中，且未在其他区域被封禁或拒绝过入驻申请，均可申请。",
        disclaimer:
          "本服务承诺协助客户完成普招入驻，若最终未能成功开店，可申请全额退款。如客户隐瞒执照存在的问题，导致入驻申请未通过，需承担 50 元资料审核费，不再退还其余款项。",
      },
    ],
  },
  {
    id: "whitelist",
    label: "本土/跨境类目报白",
    description:
      "面向本土与跨境两种经营模式,提供类目报白资质审核、材料整理及提交全流程代办服务,确保申请材料符合平台审核标准。",
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
          {id: "beauty", name: "美妆个护", availableSites: ["us", "jp", "sea"]},
          {id: "health", name: "保健品", availableSites: ["us", "jp", "sea"]},
          {id: "food", name: "食品饮料", availableSites: ["us", "jp", "sea"]},
          {id: "baby", name: "母婴用品", availableSites: ["us", "jp"]},
          {id: "pet", name: "宠物用品", availableSites: ["us", "jp", "sea"]},
          {id: "toys", name: "玩具和爱好", availableSites: ["us"]},
          {id: "collectibles", name: "收藏品", availableSites: ["sea"]},
          {id: "jewelry", name: "珠宝与衍生品", availableSites: ["jp", "sea"]},
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
  },
  {
    id: "permissions",
    label: "全类目开通与一品多仓布局",
    description:
      "提供全类目经营权限开通及一品多仓布局代办服务,支持直邮与海外仓混合发货模式,适配多市场运营需求。",
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
  },
];
