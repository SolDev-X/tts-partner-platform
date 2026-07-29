import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import {Mail} from "lucide-react";
import {SiGithub, SiX, SiWechat} from "@icons-pack/react-simple-icons";
import Link from "next/link";
import Image from "next/image";

const links = [
  {
    group: "服务",
    items: [
      {
        title: "代入驻",
        href: "#",
      },
      {
        title: "全类目",
        href: "#",
      },
      {
        title: "一品多仓",
        href: "#",
      },
      {
        title: "类目报白",
        href: "#",
      },
    ],
  },
  {
    group: "关于我们",
    items: [
      {
        title: "团队介绍",
        href: "#",
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
        href: "#",
      },
      {
        title: "服务条款",
        href: "#",
      },
      {
        title: "隐私政策",
        href: "#",
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-background border-b pt-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:m-4 justify-between items-center">
          <div className="md:col-span-2 flex flex-col gap-5">
            <Link
              href="/"
              aria-label="go home"
              className="block size-fit flex gap-1.5 items-center pl-3"
            >
              <span className="font-bold text-base md:text-2xl">
                跨境服务平台
              </span>
            </Link>
            <div className="flex gap-5 ml-2 ">
              <Image
                src="/wechatQRcode.jpg"
                alt="微信"
                width={78}
                height={78}
                className="p-1 border border-white-1 rounded-2xl bg-white"
              />
              <Image
                src="/feishuQRcode.jpg"
                alt="飞书"
                width={78}
                height={78}
                className="p-1 border border-white-1 rounded-2xl bg-white"
              />
            </div>
          </div>

          <div className="flex flex-row md:gap-20 gap-18 mt-5 text-[14px]">
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
          <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last items-center">
            <HoverCard>
              <HoverCardTrigger>
                <SiWechat size={20} />
              </HoverCardTrigger>
              <HoverCardContent className="w-auto p-1">
                <Image
                  src="/wechatQRcode.jpg"
                  alt="微信"
                  width={160}
                  height={160}
                />
              </HoverCardContent>
            </HoverCard>
            <HoverCard>
              <HoverCardTrigger>
                <Image
                  src="/icons/feishu.svg"
                  alt="飞书"
                  width={24}
                  height={24}
                />
              </HoverCardTrigger>
              <HoverCardContent className="w-auto p-1">
                <Image
                  src="/feishuQRcode.jpg"
                  alt="飞书"
                  width={160}
                  height={160}
                />
              </HoverCardContent>
            </HoverCard>
            <Link
              href="https://github.com/SolDevy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiGithub size={20} />
            </Link>
            <Link
              href="https://x.com/SolDevy_eth"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiX size={18} />
            </Link>
            <Link href="wenyao.dev@gmail.com">
              <Mail size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
