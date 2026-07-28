"use client";

import {Code, Cog, PenTool} from "lucide-react";

import {cn} from "@/lib/utils";

interface ServicesProps {
  className?: string;
}

export const Services = ({className}: ServicesProps) => {
  const services = [
    {
      title: "定邀/普招代入驻",
      description:
        "协助店铺完成定向邀约邀请码入驻/普招入驻申请流程，覆盖多站点，按平台规范提交资料。",
    },
    {
      title: "本土/跨境类目报白",
      description:
        "协助本土及跨境类目报白申请，资料整理与提交流程指导，按平台审核要求规范办理。",
    },
    {
      title: "开通全类目&一品多仓",
      description:
        "协助开通全类目权限及一品多仓模式，支持直邮与海外仓混发布局，适合多市场运营卖家。",
    },
  ];

  return (
    <section className={cn("py-32", className)} id="services">
      <div className="container mx-auto items-center">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              我们的服务
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {services.map((service, index) => (
              <div
                key={index}
                className="space-y-6 rounded-lg border border-border p-8 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <h3 className="md:text-xl text-base font-semibold">
                    {service.title}
                  </h3>
                </div>
                <p className="leading-relaxed text-muted-foreground text-sm md:text-base">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
