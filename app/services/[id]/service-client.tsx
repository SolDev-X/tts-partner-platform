import {CircleCheck} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import type {Service} from "@/lib/types";

import type {OptionGroup} from "./service-options-form";
import {ServiceOptionsForm} from "./service-options-form";
import {ServiceImageGallery} from "./service-image-gallery";

interface ServiceClientProps {
  service: Service; // 接收单个服务数据
}

/**
 * 本文件没有 "use client"：它是 Server Component。
 * 需要交互状态的部分（表单 / 图集切换）被拆到了
 * service-options-form.tsx 和 service-image-gallery.tsx，
 * 那两个文件各自单独声明了 "use client"，其余静态内容
 * （服务流程 / 服务保障）都在服务端渲染，不占客户端 JS 体积。
 */
const ServiceDetail1 = ({service}: ServiceClientProps) => {
  const optionGroups = (service.optionGroups ?? []) as OptionGroup[];
  const cases = service.cases ?? [];

  return (
    <section className={cn("py-32")}>
      <div className="container mx-auto items-center">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <ServiceImageGallery cases={cases} />
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                    {service.label}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      <CircleCheck />
                      支持多站点办理
                    </Badge>
                    {cases.length > 0 && (
                      <Badge variant="outline">{cases.length}+ 服务案例</Badge>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground">{service.description}</p>
            </div>

            <ServiceOptionsForm optionGroups={optionGroups} />

            <ServiceProcess details={service.details} />

            <ServiceGuarantee afterSalesRule={service.afterSalesRule} />
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * 服务流程：解析 details 里 "1. xxx\n2. xxx" 格式的文本，
 * 渲染成步骤条。没有 details 字段时不渲染。
 * 纯字符串处理，不需要 hooks，留在 Server Component 里就行。
 */
const ServiceProcess = ({details}: {details?: string}) => {
  if (!details) return null;

  const steps = details
    .split("\n")
    .map((line) => line.replace(/^\s*\d+[.、]\s*/, "").trim())
    .filter(Boolean);

  if (!steps.length) return null;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">服务流程</h2>
      <ol className="space-y-3">
        {steps.map((step, index) => (
          <li
            key={`service-detail-step-${index}`}
            className="flex items-start gap-3"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {index + 1}
            </span>
            <span className="pt-0.5 text-sm text-muted-foreground">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

/** 服务保障：替代原模版的库存/质保信息展示 */
const ServiceGuarantee = ({afterSalesRule}: {afterSalesRule?: string}) => {
  if (!afterSalesRule) return null;

  return (
    <div className="rounded-lg border bg-muted/40 p-4">
      <h2 className="mb-2 text-sm font-semibold">服务保障</h2>
      <p className="text-sm text-muted-foreground">{afterSalesRule}</p>
    </div>
  );
};

export {ServiceDetail1};
