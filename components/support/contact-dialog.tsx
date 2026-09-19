"use client";

import Image from "next/image";
import type {ReactNode} from "react";
import {ExternalLink} from "lucide-react";

import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const wechatContactHref = "https://work.weixin.qq.com/ca/cawcde664a5ec7953c";
const xianyuProfileHref = "https://m.tb.cn/h.8GGpxq2?tk=yfbyT9q7Zx6 CZ321";

type ContactDialogProps = {
  label?: string;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
};

export function ContactDialog({
  label = "联系我们",
  icon,
  className,
  onClick,
}: ContactDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="ghost" className={className} onClick={onClick} />
        }
      >
        {icon}
        {label}
      </DialogTrigger>

      <DialogContent className="border-white/40 bg-background/75 shadow-2xl backdrop-blur-xl sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>联系我们</DialogTitle>
          <DialogDescription>
            扫码添加服务顾问，或通过闲鱼查看主页。
          </DialogDescription>
        </DialogHeader>

        <div className="mx-auto w-48 rounded-xl border bg-white p-2 shadow-sm">
          <Image
            src="/QRcode/wechatQRcode.jpg"
            alt="企业微信咨询二维码"
            width={192}
            height={192}
            className="aspect-square w-full object-contain"
          />
        </div>

        <div className="space-y-1 text-center">
          <p className="text-sm font-medium">企业微信咨询</p>
          <p className="text-xs leading-5 text-muted-foreground">
            添加时可备注服务类型，方便快速确认需求。
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            nativeButton={false}
            render={
              <a
                href={wechatContactHref}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            添加企业微信
            <ExternalLink />
          </Button>

          <Button
            variant="outline"
            nativeButton={false}
            render={
              <a
                href={xianyuProfileHref}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            闲鱼主页
            <ExternalLink />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
