import type {OptionItem, Service} from "./types";
import {FAQItem} from "./types";

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
        serviceContent: [
          "核验客户提交的主体及入驻材料",
          "协助申请 TikTok Shop 定邀入驻邀请码",
          "跟进邀请码申请进度并同步结果",
        ],
        timelineAndDelivery:
          "服务周期自客户提交完整且符合要求的材料之日起计算。邀请码下发并在交付时确认处于有效状态后，视为完成交付。",
        refundPolicy:
          "提交完整材料后超过 30 个工作日仍未通过审核，可申请全额退还本次服务费用。\n\n因客户提供的营业执照或其他材料存在异常、虚假、过期或不完整，或客户未按要求配合补充材料，导致邀请码无法申请或使用的，不适用全额退款。我们将说明具体原因，并按照已实际发生的服务和资料费用结算后退还剩余款项。",
        importantNotice:
          "本服务负责协助申请入驻邀请码，不代表 TikTok Shop 的审核承诺。最终邀请资格、邀请码有效期及入驻审核结果均由 TikTok Shop 根据其平台规则独立决定。",
      },
      {
        match: {
          onboardingType: "public", // 改成这个
        },
        requiredMaterials: [
          "主营类目",
          "手机号（未入驻过 TikTok Shop）",
          "邮箱（未入驻过 TikTok Shop）",
          "身份证正反面（法人需配合人脸验证）",
          "营业执照（四角需完整露出）",
        ],
        eligibility:
          "法人名下无封店记录，正常经营中，且未在其他区域被封禁或拒绝过入驻申请，均可申请。",
        serviceContent: [
          "核验客户提交的主体及入驻材料",
          "协助完成 TikTok Shop 普招入驻申请",
          "跟进审核进度，并提供约定范围内的补件指导",
        ],
        timelineAndDelivery:
          "服务周期自客户提交完整且符合要求的材料之日起计算，预计 10 个工作日内完成。平台审核通常需要 3–10 个工作日；审核通过并确认店铺可正常进入后，视为完成交付。",
        refundPolicy:
          "若在上述服务周期内未能通过平台审核成功开店，且并非因客户资料或配合问题导致，我们将全额退还本次服务费用，无需客户额外举证。\n\n因客户提供的材料存在异常、虚假、过期或不完整，或客户未按要求配合补充材料，导致申请无法继续或审核未通过的，不适用全额退款。我们将说明具体原因，并扣除 20 元资料费用后退还剩余款项。",
        importantNotice:
          "最终审核结果由 TikTok Shop 根据其平台规则独立决定。因平台规则调整、审核补件或其他平台原因导致办理周期变化时，我们将及时同步进度。",
      },
    ],
    faqs: [
      {
        id: "item-1",
        question: "定邀入驻大概多久能拿到邀请码？",
        answer:
          "正常情况下 7-10 个工作日内就能下码，我们会全程跟进催审进度，遇到延迟会主动同步给您，不需要您自己去问平台。",
      },
      {
        id: "item-2",
        question: "下店渠道合规吗？会不会用违规方式操作？",
        answer:
          "我们的入驻全程对接 TikTok Shop 官方 AM（Account Manager）经理，通过官方渠道提交资质、走正规审核流程完成下店，不使用任何违规操作。这样既能保证店铺后续经营的合法合规，也能降低您因渠道问题被平台二次核查、封禁的风险。",
      },
      {
        id: "item-3",
        question: "普招入驻和定邀入驻有什么区别？我该选哪个？",
        answer:
          "普招是公开招募通道，入驻后店铺会进入公共店铺池，没有专属 AM 经理对接，材料齐全的情况下随时可以申请。定邀需要先获取邀请码才能入驻，通道审核标准和资源相对更稳定，入驻后会被划入对应 AM 经理名下，店铺权重相对更高。具体选哪种，跟站点、类目、店铺资质情况都有关系，如果拿不准，可以先联系我们的顾问免费评估，我们会根据您的实际情况推荐更合适、通过率更高的方式。",
      },
      {
        id: "item-4",
        question: "入驻成功后，还会被平台二审或风控吗？",
        answer:
          "会。TikTok Shop 除了入驻时的资质审核，后续还会不定期对店铺进行二次核查（俗称 二审）,主要看店铺是否持续合规经营。我们通过官方 AM 渠道正规下店，从渠道源头上降低了因资质造假、违规操作被追溯的风险；但入驻成功后，店铺日常经营是否合规（比如是否使用违规素材、、经营行为是否符合平台规则）需要您自行注意，这部分不在我们的服务范围内，如因入驻后的经营行为导致二审不通过或店铺被限制，不属于退款情形。",
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
        serviceContent: [
          "核验报白类目对应的申请材料",
          "协助整理并提交类目报白申请",
          "跟进审核进度并提供约定范围内的补件指导",
        ],
        timelineAndDelivery:
          "服务周期自客户提交完整且符合要求的材料之日起计算，具体周期以站点、类目及平台实际审核进度为准。对应类目权限开通后，视为完成交付。",
        refundPolicy:
          "如平台审核未通过，将按照下单前确认的服务约定退还本次服务费用。因客户提供的材料异常、虚假、过期或不完整，或客户未按要求配合补充材料导致审核未通过的，不适用全额退款。",
        importantNotice:
          "类目报白仅针对所申请的站点、店铺和类目生效，不代表其他站点或类目同步获得权限。最终审核结果由 TikTok Shop 根据其平台规则独立决定。",
      },
    ],
    faqs: [
      {
        id: "item-1",
        question: "什么是类目报白？为什么需要单独申请？",
        answer:
          "类目报白本质上是类目授权。平台对美妆个护、保健品、食品饮料等部分类目设置了准入限制，商家想在店铺上架这些类目的商品，必须先针对该类目单独申请授权，这个授权过程俗称报白。不办理报白，对应类目下的商品完全没办法上架。",
      },
      {
        id: "item-2",
        question: "报白通过后，是这个类目所有站点都能卖了吗？",
        answer:
          "不是，授权范围只针对这一个类目 + 这一个站点的组合。比如美区的美妆个护报白通过，不代表日区的美妆个护、或者美区其他类目也自动开放，每个类目在每个站点都需要单独申请报白。",
      },
      {
        id: "item-3",
        question: "报白前，店铺需要先完成入驻吗？",
        answer:
          "需要。类目报白是在店铺已经入驻成功的基础上，针对特定类目单独申请的权限，如果店铺还没入驻，需要先完成入驻代办，再办理报白。",
      },
      {
        id: "item-4",
        question: "把店铺子账号给你们，安全吗？会不会影响我自己使用店铺？",
        answer:
          "子账号是平台官方支持的多人协作功能，权限可以单独设置，跟您的主账号是分开的，不会影响您自己登录使用店铺。我们只用子账号登录提交报白所需的材料，不会进行其他操作，办理完成后您也可以随时在后台收回或关闭这个子账号的权限。",
      },
      {
        id: "item-5",
        question: "类目报白大概需要多久？",
        answer:
          "根据站点和类目不同，审核周期不太一样，一般提交完整材料后当天内就会有结果(特殊类目东南亚除外)，我们会全程跟进审核进度，遇到需要补充材料的情况也会第一时间通知您。",
      },
      {
        id: "item-6",
        question: "报白失败了，会不会对店铺有影响？",
        answer:
          "不会。类目报白是针对特定类目单独申请的权限审核，审核未通过只是这个类目暂时无法上架商品，不影响店铺其他已开通类目的正常经营，也不会对店铺整体权重、评级或其他资质产生负面影响。您可以根据平台反馈的具体原因，评估是否补充材料重新申请。",
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
        match: {mode: "multiWarehouse"},
        requiredMaterials: [
          "店铺主体名称",
          "店铺主营类目",
          "店铺 code",
          "shop id",
        ],
        eligibility:
          "仅支持已是跨境直邮模式的商家升级为一品多仓（海外仓混发）；欧盟、英国站点需具备仓储国 VAT 税号方可发货，日本站点无此要求。",
        serviceContent: [
          "核验一品多仓开通条件及申请材料",
          "协助完成一品多仓权限申请与材料提交",
          "开通后提供 POP 混发双向商品管理操作指引",
        ],
        timelineAndDelivery:
          "提交完整且符合要求的材料后，预计 7 个工作日内显示审核结果。一品多仓权限开通并交付操作指引后，视为完成交付。",
        refundPolicy:
          "如平台审核未通过，且并非因客户提供材料不实、不完整或未按要求配合导致，将退还本次服务费用。",
        importantNotice:
          "最终审核结果及权限生效时间由 TikTok Shop 根据其平台规则独立决定。权限开通后的仓储、税务及店铺经营合规责任由客户自行承担。",
      },
      {
        match: {mode: "category"},
        requiredMaterials: [
          "店铺主体名称",
          "店铺主营类目",
          "店铺 code",
          "shop id",
        ],
        serviceContent: [
          "核验全类目权限申请条件及材料",
          "协助完成权限开通申请与材料提交",
          "跟进审核进度并同步平台结果",
        ],
        timelineAndDelivery:
          "服务周期自客户提交完整且符合要求的材料之日起计算，具体周期以平台实际审核进度为准。全类目权限开通后，视为完成交付。",
        refundPolicy:
          "如平台审核未通过，且并非因客户提供材料不实、不完整或未按要求配合导致，将退还本次服务费用。",
        importantNotice:
          "最终审核结果及权限范围由 TikTok Shop 根据其平台规则独立决定。权限开通不代表所有商品均可无条件上架，客户仍需遵守各站点和类目的经营要求。",
      },
    ],
    faqs: [
      {
        id: "item-1",
        question: "全类目开通和一品多仓，可以同时办理吗？",
        answer:
          "可以，两者是相互独立的权限，不冲突。您可以只开通全类目，也可以只做一品多仓布局，也可以两个都办，具体根据您店铺的实际运营需求选择。",
      },
      {
        id: "item-2",
        question: "一品多仓是什么？为什么要用直邮+海外仓混合发货？",
        answer:
          "一品多仓指同一款商品，同时布局多个仓库发货（既能从国内直邮，也能从海外仓就近发货），能有效提升物流时效，尤其适合已经有稳定销量的商品。",
      },
      {
        id: "item-3",
        question: "所有店铺都能申请一品多仓吗？",
        answer:
          "不是，一品多仓仅支持已经是跨境直邮模式的商家升级；如果您选择的站点是欧盟或英国，还需要具备仓储国的 VAT 税号才能正常发货，日本站点没有这个要求。",
      },
      {
        id: "item-4",
        question: "一品多仓开通后，会不会被平台收回？",
        answer:
          "会有持续考核。如果店铺 CCR（消费者负反馈指标）高于主营类目均值的 1.3 倍，混发模式会被平台关闭，需要重新申请。建议开通后关注自己店铺的 CCR 指标，保持在合理范围内。",
      },
      {
        id: "item-5",
        question: "开通一品多仓后，我该怎么操作双向发货？",
        answer:
          "开通成功后，我们会提供 TikTok Shop 官方的 POP 混发双向商品管理操作说明，指导您如何在后台设置商品的多仓发货规则，如果操作上有疑问也可以随时联系顾问协助。",
      },
    ],
  },
];

export const homeFAQs: FAQItem[] = [
  {
    id: "item-1",
    question: "我们主要提供哪些服务?",
    answer:
      "我们专注店铺层面的入驻与权限代办服务，涵盖入驻代办、类目报白、权限开通等，不涉及店铺运营、广告投放或 TikTok 橱窗等内容运营类服务。",
  },
  {
    id: "item-2",
    question: "支持哪些站点和店铺模式？",
    answer:
      "覆盖美区、日区、英区、欧盟、东南亚、墨西哥等主流站点，支持 跨境POP、跨境直邮、本土等店铺模式，具体以所选服务的可选项为准。",
  },
  {
    id: "item-3",
    question: "合作交易方式是怎样的？",
    answer:
      "合作方式为先付后办理，为解决信任问题、保障双方资金安全，交易可通过第三方担保平台完成；后续将上线线上支付系统，进一步简化付款流程。",
  },
  {
    id: "item-4",
    question: "审核不通过如何处理？",
    answer:
      "具体处理方式将按办理前双方约定的服务细则执行，包括责任范围、保障期限、退款标准等，各服务的具体条款以下单前的约定说明为准。",
  },
  {
    id: "item-5",
    question: "办理过程中如何跟进进度？",
    answer:
      "办理期间将通过微信/飞书及时同步进度，如遇异常情况会主动告知并协助处理；后续也计划上线独立的进度查询页面，方便随时查看办理状态。",
  },
];
