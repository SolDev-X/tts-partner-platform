import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import Link from "next/link";
import Image from "next/image";

const links = [
  {
    group: "服务",
    items: [
      {
        title: "入驻代办",
        href: "/services/onboarding",
      },
      {
        title: "类目报白",
        href: "/services/whitelist",
      },
      {
        title: "权限开通",
        href: "/services/permissions",
      },
    ],
  },
  {
    group: "关于我们",
    items: [
      {
        title: "团队介绍",
        href: "/about",
      },
      {
        title: "加入我们",
        href: "#",
      },
    ],
  },
  {
    group: "帮助",
    items: [
      {
        title: "常见问题",
        href: "#faqs",
      },
      {
        title: "服务条款",
        href: "#",
      },
      {
        title: "隐私政策",
        href: "/privacy",
      },
      {
        title: "退款政策",
        href: "/",
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-b pt-10 rounded-t-2xl">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:m-4 justify-between items-center">
          <div className="md:col-span-2 flex flex-col gap-5">
            <Link
              href="/"
              aria-label="go home"
              className="block size-fit flex gap-1.5 items-center pl-3"
            >
              <h2 className="hidden md:flex font-bold text-base md:text-2xl gap-1.5 items-center">
                <Image
                  src="/vercel.svg"
                  alt="跨境服务平台"
                  width="25"
                  height="25"
                />
                跨境服务平台
              </h2>
            </Link>
          </div>

          <div className="flex flex-row gap-18 mt-5 text-[14px] md:gap-20">
            {links.map((link, index) => (
              <div key={index} className="space-y-4">
                <span className="block font-medium">{link.group}</span>
                {link.items.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="text-muted-foreground hover:text-primary block duration-150"
                  >
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t py-6">
          <span className="text-muted-foreground order-last block text-center text-[12px] md:order-first">
            © {2026} 跨境服务. 所有资料需真实有效，结果以平台最终审核为准。
          </span>
          <div className="order-first flex items-center justify-center gap-3 text-sm md:order-last">
            <div className="flex items-center gap-1.5">
              <HoverCard>
                <HoverCardTrigger className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-muted">
                  <Image
                    src="/icons/WeCom.svg"
                    alt="企业微信"
                    width={20}
                    height={20}
                    className="size-5 object-contain grayscale opacity-90"
                  />
                </HoverCardTrigger>
                <HoverCardContent className="w-auto p-1">
                  <Image
                    src="/QRcode/wechatQRcode.jpg"
                    alt="微信"
                    width={160}
                    height={160}
                  />
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-muted">
                  <Image
                    src="/icons/Feishu.svg"
                    alt="飞书"
                    width={20}
                    height={20}
                    className="size-5 object-contain grayscale opacity-90"
                  />
                </HoverCardTrigger>
                <HoverCardContent className="w-auto p-1">
                  <Image
                    src="/QRcode/feishuQRcode.jpg"
                    alt="飞书"
                    width={160}
                    height={160}
                  />
                </HoverCardContent>
              </HoverCard>
              <a
                href="https://m.tb.cn/h.8STM0HG?tk=y9twTZcE8jl"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="前往闲鱼主页"
                title="闲鱼"
                className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-muted grayscale opacity-90"
              >
                <Image
                  src="/icons/xianyu.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="size-[18px] object-contain rounded-[4px]"
                />
              </a>
              <span
                aria-label="小红书"
                title="小红书"
                className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-muted grayscale opacity-90"
              >
                <Image
                  src="/icons/xiaohongshu.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="size-[18px] object-contain rounded-[4px]"
                />
              </span>
              <span
                aria-label="抖音"
                title="抖音"
                className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-muted grayscale opacity-90"
              >
                <Image
                  src="/icons/douyin.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="size-[18px] object-contain rounded-[4px]"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
