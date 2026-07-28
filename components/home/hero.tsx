import Link from "next/link";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {SiTiktok} from "@icons-pack/react-simple-icons";
import {ChevronDown} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="py-20 md:h-screen">
      <div className="relative z-10 mx-auto w-full max-w-2xl px-6 lg:px-0">
        <div className="relative text-center">
          <SiTiktok className="mx-auto" />
          <h1 className="mx-auto mt-16 max-w-xl text-balance text-3xl font-[900] md:text-5xl">
            Tiktok shop跨境服务平台
          </h1>

          <p className="text-muted-foreground mx-auto mb-6 mt-4 text-balance text-base md:text-xl">
            一站式跨境电商解决方案
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

        <div className="relative mt-12 overflow-hidden rounded-3xl bg-black/10 md:mt-16">
          <div className="bg-background rounded-(--radius) relative m-4 overflow-hidden border border-transparent shadow-xl shadow-black/15 ring-1 ring-black/10 sm:m-8 md:m-12">
            <Image
              src="/public/cases/onboarding"
              alt=""
              width="2880"
              height="1842"
              className="object-top-left size-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
