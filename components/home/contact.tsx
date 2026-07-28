"use client";

import Image from "next/image";
import Link from "next/link";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import {Mail} from "lucide-react";
import {SiGithub, SiX, SiWechat} from "@icons-pack/react-simple-icons";
import {SiTiktok} from "@icons-pack/react-simple-icons";

export default function ContactPage() {
  return (
    <div
      id="contact"
      className="mx-auto text-center px-80 py-15 flex flex-col gap-8"
    >
      <h2 className="text-3xl font-bold md:text-4xl">
        联系我们，获取专属方案与流程指导
      </h2>
      <div className="flex flex-col gap-3 justify-center">
        <Link href="/" className="flex gap-1.5 items-center p-1">
          <SiTiktok size={20} />
          <span className="font-black  text-2xl">TTS</span>
          <span className="font-bold text-xl">跨境服务</span>
        </Link>

        <div className="flex gap-4 items-center p-1" id="social-contact">
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

        <div className="flex gap-5">
          <Image
            src="/wechatQRcode.jpg"
            alt="微信"
            width={78}
            height={78}
            className="p-1 border border-black-1 rounded-2xl"
          />
          <Image
            src="/feishuQRcode.jpg"
            alt="飞书"
            width={78}
            height={78}
            className="p-1 border border-black-1 rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}
