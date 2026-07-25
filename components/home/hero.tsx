import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {ChevronDown} from "lucide-react";

export default function Hero() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-1 flex flex-col gap-20 min-h-screen  relative">
      <div className="flex flex-col items-center gap-5 mt-20">
        <h2 className="mt-2 text-2xl font-bold text-black md:text-3xl">
          Tiktok shop跨境电商服务平台
        </h2>
        <div className="text-center text-base font-normal space-y-3 text-neutral-600">
          专注跨境电商领域3年，累计服务
          <span className="font-bold text-black">1000+跨境卖家</span>
          ，深谙平台规则与风控逻辑，第一时间掌握官方政策动态，确保每一步操作合规可控。
          <br />
          覆盖美国、日本、英国、欧盟、东南亚、墨西哥等站点，提供定邀码代申请、店铺代入驻、本土/跨境类目报白等服务。
          <br />
          流程规范透明，资料真实有效，审核未通过
          <span className="font-bold text-black">全额退款</span>
          保障。
          无论是初入行业的新手卖家，还是管理多店铺的运营团队，均可提供针对性协助。
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-10 sm:flex-row">
        <Link
          href="/contact"
          className={buttonVariants({
            size: "lg",
            className: "bg-black text-white hover:bg-neutral-800",
          })}
        >
          立即咨询
        </Link>
        <Link
          href="#services"
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className: "border-black text-black hover:bg-neutral-100",
          })}
        >
          查看服务
        </Link>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 mb-20 animate-bounce">
        <ChevronDown className="h-6 w-6 text-neutral-400" />
      </div>
    </div>
  );
}
