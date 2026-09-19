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
          <div className="md:col-span-2 flex w-fit flex-col items-center gap-3">
            <Link
              href="#"
              aria-label="go home"
              className="flex size-fit items-center gap-1.5"
            >
              <h2 className="flex items-center gap-1.5 text-base font-bold md:text-2xl">
                <Image
                  src="/vercel.svg"
                  alt="跨境服务平台"
                  width="25"
                  height="25"
                />
                跨境服务平台
              </h2>
            </Link>
            <div className="group relative w-fit rounded-lg border bg-white p-2">
              <Image
                src="/QRcode/wechatQRcode.jpg"
                alt="企业微信咨询二维码"
                width={148}
                height={148}
                className="size-32 md:size-37"
              />
              <div className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                扫码添加企业微信咨询
              </div>
            </div>
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
        </div>
      </div>
    </footer>
  );
}
