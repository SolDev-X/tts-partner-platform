import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="bg-black text-white mt-30">
      <div className="mx-auto max-w-4xl px-4 py-24 text-center flex flex-col gap-3">
        <h2 className="text-3xl font-bold md:text-4xl">
          准备好开启跨境电商之旅了吗？
        </h2>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="#contact"
            className={buttonVariants({
              size: "lg",
              className:
                " border-black text-black hover:bg-neutral-200 hover:border-white",
            })}
          >
            关于我们
          </Link>
          <Link
            href="/"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className:
                "border-white text-black hover:bg-neutral-900 hover:text-white",
            })}
          >
            查看服务 →
          </Link>
        </div>

        <p className="mt-6 text-sm text-neutral-400">
          覆盖美国 · 日本 · 英国 · 欧盟 · 东南亚 · 墨西哥等市场
        </p>
      </div>
    </section>
  );
}
