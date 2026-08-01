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
        title: "您计划入驻哪个市场？",
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
        title: "您的主营类目是？",
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
          {id: "health", name: "保健"},
          {id: "books", name: "图书、杂志和音频"},
          {id: "kidswear", name: "儿童时尚"},
          {id: "menswear", name: "男装与男士内衣"},
          {id: "bags", name: "箱包"},
          {id: "virtual", name: "虚拟商品"},
          {id: "collectibles", name: "收藏品"},
          {id: "jewelry", name: "珠宝与衍生品"},
          {id: "ticketing", name: "票务与代金券"},
        ],
      },
      {
        key: "shopType",
        title: "您计划使用的物流模式是？",
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
        title: "希望以哪种方式入驻？",
        options: [
          {id: "public", name: "普招入驻"},
          {id: "invite", name: "邀请码入驻"},
        ],
      },
    ],
    combinationRules: [
      {
        // 美区不支持直邮(暂时)，只能 POP
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
        id: "case6",
        imageUrl: "/cases/onboarding/6.png",
        title: "日本普招入驻",
      },
      {
        id: "case1",
        imageUrl: "/cases/onboarding/1.jpg",
        title: "欧盟直邮下码",
      },
      {
        id: "case2",
        imageUrl: "/cases/onboarding/2.jpg",
        title: "欧盟直邮下码",
      },
      {
        id: "case3",
        imageUrl: "/cases/onboarding/3.jpg",
        title: "欧盟直邮下码",
      },
      {
        id: "case4",
        imageUrl: "/cases/onboarding/4.jpg",
        title: "欧盟直邮下码",
      },
      {
        id: "case5",
        imageUrl: "/cases/onboarding/5.jpg",
        title: "英国直邮下码",
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
          "本服务承诺协助客户获取定邀入驻邀请码，交付物为可正常使用的入驻邀请码。下码周期一般为 7-10 个工作日（具体以平台审核进度为准）。\n\n如客户隐瞒执照存在的问题，导致邀请码下发后无法正常使用，本服务不承担责任。\n\n本服务仅负责协助获取入驻邀请码，保证邀请码在有效期内可正常使用；因平台规则或客户自身原因导致的使用问题，需自行处理。\n\n超过 30 个工作日未通过审核，可申请全额退款。",
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
          "本服务承诺协助客户完成普招入驻。服务周期为提交完整材料后 10 个工作日内（平台预计审核时长为 3-10 个工作日，一般情况审核通过当天即可下店，交付的是可正常使用的店铺）。\n\n若在此期限内未能通过平台审核成功开店，只要不是因客户自身资料问题导致，我们将全额退还服务费用，无需客户额外说明或举证。\n\n唯一的例外情况是：客户提供的营业执照本身存在问题（如经营异常、已注销、被列入经营异常名录等），且这一情况在委托前未如实告知我们。这种情况下，由于问题源于执照本身、而非我们的服务过程，我们会协助说明原因，并从服务费中扣除 20 元资料费用后，退还剩余款项。",
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
        title: "您计划报白的站点是？",
        options: [siteOption("us"), siteOption("jp"), siteOption("sea")],
      },
      {
        key: "shopType",
        title: "您的店铺类型是？",
        options: [
          {id: "Cross-border", name: "跨境"},
          {id: "Local", name: "本土"},
        ],
      },
      {
        key: "category",
        title: "您要报白的类目是？",
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

    combinationRules: [
      {
        when: {sites: "sea"},
        disable: {shopType: ["Local"]},
      },
      {
        when: {sites: "us"},
        disable: {shopType: ["Local"]},
      },
    ],
    cases: [
      {
        id: "case1",
        imageUrl: "/cases/whitelist/1.jpg",
        title: "日本除玩具全类目可报",
      },
      {
        id: "case2",
        imageUrl: "/cases/whitelist/2.jpg",
        title: "美区跨境玩具",
      },
      {
        id: "case3",
        imageUrl: "/cases/whitelist/3.jpg",
        title: "东南亚珠宝",
      },
      {
        id: "case4",
        imageUrl: "/cases/whitelist/4.jpg",
        title: "美国跨境美妆",
      },
      {
        id: "case5",
        imageUrl: "/cases/whitelist/5.jpg",
        title: "日本本土美妆",
      },
      {
        id: "case6",
        imageUrl: "/cases/whitelist/6.jpg",
        title: "美区跨境类目",
      },
      {
        id: "case7",
        imageUrl: "/cases/whitelist/7.jpg",
        title: "东南亚所有可报类目",
      },
    ],
    variantRules: [
      {
        match: {sites: ["us", "jp", "sea"]},
        requiredMaterials: [
          "营业执照（四角需完整露出）",
          "店铺子账号（需联系人工客服开通，用于协助登录后台提交材料）",
        ],
        disclaimer:
          "本服务承诺类目报白包过，无论什么原因未通过审核，将全额退还服务费用。",
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
          {id: "multiWarehouse", name: "一品多仓(直邮+海外仓混发)"},
        ],
      },
    ],
    cases: [
      {
        id: "case1",
        imageUrl: "/cases/permissions/1.jpg",
        title: "全类目",
      },
      {
        id: "case2",
        imageUrl: "/cases/permissions/2.jpg",
        title: "一品多仓",
      },
    ],
    variantRules: [
      {
        match: {},
        requiredMaterials: [
          "店铺主体名称",
          "店铺主营类目",
          "店铺 code",
          "shop id",
        ],
        disclaimer:
          "本服务承诺包过，无论什么原因未通过审核，将全额退还服务费用。",
      },
    ],
  },
];
