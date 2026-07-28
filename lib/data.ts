import {Service} from "./types";

export const navLinks = [
  {href: "/about", label: "关于我们"},
  {href: "/contact", label: "联系我们"},
];

export const faqs = [
  {
    question: "审核不通过怎么办？",
    answer: "审核未通过将全额退款，无需承担额外费用。",
  },
  {
    question: "需要提供哪些资料？",
    answer:
      "根据服务类型不同，可能需要店铺主体名称、ShopID、邀请码等信息，具体会在提交申请时说明。",
  },
  {
    question: "大概多久能出审核结果？",
    answer: "提交后一般约7个工作日显示结果，具体以平台审核为准。",
  },
  {
    question: "支持哪些国家/站点？",
    answer: "覆盖美国、日本、英国、欧盟十二国、东南亚、墨西哥等站点。",
  },
  {
    question: "已有店铺可以升级为混发模式吗？",
    answer:
      "仅支持跨境直邮商家升级为海外仓混发模式，欧盟/英国站点需具备仓储国VAT，日本站点无此要求。",
  },
];

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
          {id: "us", name: "美区", directMailRule: "invite-only"},
          {id: "jp", name: "日区", directMailRule: "both"},
          {id: "uk", name: "英区", directMailRule: "invite-only"},
          {id: "eu", name: "欧盟", directMailRule: "invite-only"},
          {id: "sea", name: "东南亚", directMailRule: "both"},
          {id: "mx", name: "墨西哥", directMailRule: "invite-only"},
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
        imageUrl: "/cases/onboarding/1.jpg",
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
        options: [
          {id: "us", name: "美区", directMailRule: "invite-only"},
          {id: "jp", name: "日区", directMailRule: "both"},
          {id: "sea", name: "东南亚", directMailRule: "both"},
        ],
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
          {
            id: "collectibles",
            name: "收藏品",
            availableSites: ["sea"],
          },
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
        imageUrl: "/cases/onboarding/1.jpg",
        title: "日区店铺定邀入驻成功",
        tag: "日区 · 定邀",
      },
      {
        id: "case2",
        imageUrl: "/cases/onboarding/1.jpg",
        title: "美区POP入驻案例",
        tag: "美区 · POP",
      },
    ],
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
        options: [
          {id: "jp", name: "日区"},
          {id: "uk", name: "英区"},
          {id: "eu", name: "欧盟"},
        ],
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
        imageUrl: "/cases/onboarding/1.jpg",
        title: "日区店铺定邀入驻成功",
        tag: "日区 · 定邀",
      },
      {
        id: "case2",
        imageUrl: "/cases/onboarding/1.jpg",
        title: "美区POP入驻案例",
        tag: "美区 · POP",
      },
    ],
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
        options: [
          {id: "jp", name: "日区"},
          {id: "uk", name: "英区"},
          {id: "eu", name: "欧盟"},
        ],
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
        imageUrl: "/cases/onboarding/1.jpg",
        title: "日区店铺定邀入驻成功",
        tag: "日区 · 定邀",
      },
      {
        id: "case2",
        imageUrl: "/cases/onboarding/1.jpg",
        title: "美区POP入驻案例",
        tag: "美区 · POP",
      },
    ],
  },
];
