import Link from "next/link";
import Image from "next/image";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import {Mail} from "lucide-react";
import {SiGithub, SiX, SiWechat} from "@icons-pack/react-simple-icons";

export default function Footer() {
  return (
    <div className="flex items-center justify-between text-[14px] mx-auto max-w-6xl w-full px-4 py-8 border-t border-black">
      <p>© 2026 跨境服务. 所有资料需真实有效，结果以平台最终审核为准。</p>
      <ul className="flex gap-4 items-center">
        <HoverCard>
          <HoverCardTrigger>
            <SiWechat size={20} />
          </HoverCardTrigger>
          <HoverCardContent>{/* 微信二维码图片 */}</HoverCardContent>
        </HoverCard>
        <HoverCard>
          <HoverCardTrigger>
            <Image src="/icons/feishu.svg" alt="飞书" width={24} height={24} />
          </HoverCardTrigger>
          <HoverCardContent>{/* 飞书二维码图片 */}</HoverCardContent>
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
          <SiX size={20} />
        </Link>
        <Link href="wenyao.dev@gmail.com">
          <Mail size={20} />
        </Link>
      </ul>
    </div>
  );
}
