import {Asterisk, CornerDownRight} from "lucide-react";
import React from "react";

import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

interface ProcessProps {
  className?: string;
}

const Process = ({className}: ProcessProps) => {
  const process = [
    {
      step: "01",
      title: "需求沟通与评估",
      description:
        "了解你的具体需求与店铺现状，评估资质是否符合对应服务的办理条件，明确可行方案与预期时间。",
    },
    {
      step: "02",
      title: "资料整理与提交",
      description:
        "协助整理办理所需资料，按平台最新规范逐项核对，确保一次提交、减少因材料问题导致的驳回。",
    },
    {
      step: "03",
      title: "审核跟进与处理",
      description:
        "全程跟踪审核进度，遇到问题及时补充说明或调整材料，尽量缩短整体办理周期。",
    },
    {
      step: "04",
      title: "类目报白与权限拓展",
      description:
        "入驻完成后，可根据经营需要协助办理类目报白、开通全类目权限或一品多仓布局，支持业务持续拓展。",
    },
  ];

  return (
    <section className={cn("py-14 sm:py-16 lg:py-18", className)}>
      <div className="container mx-auto items-center px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-6 lg:gap-20 xl:gap-24">
          <div className="col-span-2 h-fit w-full space-y-5 sm:space-y-6 lg:sticky lg:top-10 lg:space-y-7 lg:py-8">
            <div className="relative w-fit text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl">
              {" "}
              <h1 className="w-fit">服务流程</h1>
              <Asterisk className="absolute -right-3 -top-2 size-5 text-[#1f6feb] sm:-right-5 sm:size-7 lg:-right-14 lg:size-10" />
            </div>
            <p className="max-w-2xl text-sm leading-7 text-foreground/50 sm:text-base">
              从需求评估到权限拓展，让入驻与合规流程清晰可控，减少反复沟通与等待的时间成本。
            </p>

            <Button
              variant="ghost"
              nativeButton={false}
              className="-ml-3 flex items-center justify-start gap-2 sm:ml-0"
              render={<a href="/contact" />}
            >
              <CornerDownRight className="text-[#1f6feb] hidden lg:block" />
              立即咨询
            </Button>
          </div>
          <ul className="relative col-span-4 w-full lg:pl-10 xl:pl-22">
            {process.map((step, index) => {
              const offsets = ["lg:ml-0", "lg:ml-8", "lg:ml-3", "lg:ml-12"];
              return (
                <li
                  key={index}
                  className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-x-4 gap-y-4 border-t py-6 sm:grid-cols-[52px_minmax(0,1fr)] sm:gap-x-6 sm:py-8 lg:grid-cols-[64px_minmax(0,1fr)] lg:gap-x-8 lg:py-10"
                >
                  <div className="flex size-10 items-center justify-center bg-muted text-sm tabular-nums tracking-tighter sm:size-12 sm:text-base">
                    {step.step}
                  </div>
                  <div
                    className={cn("min-w-0", offsets[index % offsets.length])}
                  >
                    <h3 className="mb-2 text-xl font-semibold tracking-tight sm:mb-3 sm:text-2xl lg:mb-4 lg:text-3xl">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-7 text-foreground/50 sm:text-base sm:leading-8">
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Process;
