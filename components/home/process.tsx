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
    <section className={cn("py-18", className)}>
      <div className="container mx-auto items-center">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-6 lg:gap-20 ">
          <div className="top-10 col-span-2 h-fit w-fit gap-3 space-y-7 py-8 lg:sticky">
            <div className="relative w-fit text-5xl font-semibold tracking-tight lg:text-7xl">
              {" "}
              <h1 className="w-fit">服务流程</h1>
              <Asterisk className="absolute -top-2 -right-2 size-5 text-[#1f6feb] md:size-10 lg:-right-14" />
            </div>
            <p className="text-base text-foreground/50">
              从需求评估到权限拓展，让入驻与合规流程清晰可控，减少反复沟通与等待的时间成本。
            </p>

            <Button
              variant="ghost"
              nativeButton={false}
              className="flex items-center justify-start gap-2"
              render={<a href="/contact" />}
            >
              <CornerDownRight className="text-[#1f6feb]" />
              立即咨询
            </Button>
          </div>
          <ul className="relative col-span-4 w-full lg:pl-22">
            {process.map((step, index) => {
              const offsets = ["md:ml-0", "md:ml-8", "md:ml-3", "md:ml-12"];
              return (
                <li
                  key={index}
                  className="relative flex flex-col justify-between gap-10 border-t py-8 md:flex-row lg:py-10"
                >
                  <div className="flex size-12 items-center justify-center bg-muted px-4 py-1 tracking-tighter">
                    0{index + 1}
                  </div>
                  <div
                    className={cn("flex-1", offsets[index % offsets.length])}
                  >
                    <h3 className="mb-4 text-2xl font-semibold tracking-tighter lg:text-3xl">
                      {step.title}
                    </h3>
                    <p className="text-foreground/50">{step.description}</p>
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
