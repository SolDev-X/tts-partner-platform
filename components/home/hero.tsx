import Link from "next/link";
import {Button} from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="py-5">
      <div className="relative z-10 mx-auto w-full max-w-2xl px-6 lg:px-0">
        <div className="relative text-center">
          <h1 className="mx-auto mt-16 max-w-xl text-balance text-3xl font-[900] md:text-5xl">
            一站式跨境电商服务平台
          </h1>

          <p className="text-muted-foreground mx-auto mb-6 mt-4 text-balance text-base md:text-xl">
            专业跨境电商服务商,助力商家合规运营、高效出海。
          </p>

          <div className="flex flex-col items-center gap-2 *:w-full sm:flex-row sm:justify-center sm:*:w-auto">
            <Button
              nativeButton={false}
              render={
                <Link href="/contact">
                  <span className="text-nowrap">立即咨询</span>
                </Link>
              }
            />

            <Button
              nativeButton={false}
              variant="ghost"
              render={
                <Link href="#services">
                  <span className="text-nowrap">查看服务</span>
                </Link>
              }
            />
          </div>
        </div>

        <div className="bg-background rounded-(--radius) relative m-4 overflow-hidden border border-transparent shadow-xl shadow-black/15 ring-1 ring-black/10 sm:m-8 md:m-12">
          <Image
            src="/hero.webp"
            alt=""
            width={1600}
            height={1598}
            sizes="(min-width: 768px) 576px, calc(100vw - 80px)"
            quality={82}
            priority
            className="object-top-left size-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
