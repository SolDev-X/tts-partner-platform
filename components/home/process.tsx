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
        "了解你的店铺现状、目标市场与入驻需求,评估资质情况,确定合适的入驻方式(定邀/普招)与服务方案。",
    },
    {
      step: "02",
      title: "资料准备与提交",
      description:
        "协助整理入驻/报白所需资料,按平台最新规范逐项核对,确保一次提交、减少因材料问题导致的驳回。",
    },
    {
      step: "03",
      title: "审核跟进与处理",
      description:
        "全程跟踪审核进度,遇到问题及时补充说明或调整材料,加快审核通过速度。",
    },
    {
      step: "04",
      title: "开通上线与售后",
      description:
        "完成入驻/类目开通后协助店铺正式上线,如需开通全类目或一品多仓模式,也可持续提供支持。",
    },
  ];

  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto items-center">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-6 lg:gap-20 ">
          <div className="top-10 col-span-2 h-fit w-fit gap-3 space-y-7 py-8 lg:sticky">
            <div className="relative w-fit text-5xl font-semibold tracking-tight lg:text-7xl">
              {" "}
              <h1 className="w-fit">服务流程</h1>
              <Asterisk className="absolute -top-2 -right-2 size-5 text-orange-500 md:size-10 lg:-right-14" />
            </div>
            <p className="text-base text-foreground/50">
              从需求沟通到店铺上线,我们全程陪伴,让入驻与合规流程清晰可控,减少反复沟通与等待的时间成本。
            </p>

            <Button
              variant="ghost"
              nativeButton={false}
              className="flex items-center justify-start gap-2"
              render={<a href="/contact" />}
            >
              <CornerDownRight className="text-orange-500" />
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
                  <Illustration className="absolute top-4 right-0" />

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

const Illustration = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="22"
      height="20"
      viewBox="0 0 22 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <line
        x1="0.607422"
        y1="2.57422"
        x2="21.5762"
        y2="2.57422"
        stroke="#FF0000"
        strokeWidth="4"
      />
      <line
        x1="19.5762"
        y1="19.624"
        x2="19.5762"
        y2="4.57422"
        stroke="#FF0000"
        strokeWidth="4"
      />
    </svg>
  );
};
