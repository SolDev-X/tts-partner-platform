import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {ChevronDown} from "lucide-react";
import {ArrowRight} from "lucide-react";
import {services} from "@/lib/data";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export default function Hero() {
  return (
    <div className="bg-black">
      <div className="mx-auto max-w-6xl px-4 pt-1 flex flex-col min-h-[calc(100vh-68px)] relative">
        <div>
          <div className="flex flex-col items-center gap-15 mt-30">
            <h2 className="mt-2 text-2xl font-bold text-white md:text-5xl">
              TTS 跨境服务平台,一站式跨境电商解决方案
            </h2>
            {/* <div className="text-center text-base font-normal space-y-3 text-neutral-600">
              专注跨境电商领域3年，累计服务
              <span className="font-bold text-white">1000+跨境卖家</span>
              ，深谙平台规则与风控逻辑，第一时间掌握官方政策动态，确保每一步操作合规可控。
              <br />
              覆盖美国、日本、英国、欧盟、东南亚、墨西哥等站点，提供定邀码代申请、店铺代入驻、本土/跨境类目报白等服务。
              <br />
              流程规范透明，资料真实有效，审核未通过
              <span className="font-bold text-white">全额退款</span>
              保障。
              无论是初入行业的新手卖家，还是管理多店铺的运营团队，均可提供针对性协助。
            </div> */}
          </div>

          <div id="services" className="bg-black text-white mt-25">
            <h2 className="text-2xl font-bold text-[#a1a1a1] md:text-2xl text-center ">
              我们的服务
            </h2>
            <div className="mx-auto max-w-6xl px-4">
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {services.map((s) => (
                  <Link key={s.id} href={`/services/${s.id}`} className="group">
                    <Card>
                      <CardHeader>
                        <CardTitle>{s.label}</CardTitle>
                        <CardDescription className="">
                          {s.description}
                        </CardDescription>
                      </CardHeader>

                      <CardFooter>
                        <div className="flex items-center gap-1 text-sm font-medium text-black">
                          了解更多
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-neutral-400" />
        </div>
      </div>
    </div>
  );
}
