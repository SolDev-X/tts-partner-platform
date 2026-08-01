"use client";

import {useState} from "react";
import {cn} from "@/lib/utils";
import type {Service} from "@/lib/types";
import {matchVariantRule, type ServiceSelection} from "@/lib/utils";

import type {OptionGroup} from "./service-options-form";
import {ServiceOptionsForm} from "./service-options-form";
import {ServiceImageGallery} from "./service-image-gallery";

interface ServiceClientProps {
  service: Service;
}

const ServiceDetail1 = ({service}: ServiceClientProps) => {
  const optionGroups = (service.optionGroups ?? []) as OptionGroup[];
  const cases = service.cases ?? [];

  const [selection, setSelection] = useState<ServiceSelection>({});

  const matchedRule = matchVariantRule(service.variantRules ?? [], selection);

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
                </div>
              </div>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
            <ServiceOptionsForm
              optionGroups={optionGroups}
              combinationRules={service.combinationRules}
              onChange={setSelection}
            />

            <ServiceVariantInfo rule={matchedRule} />
          </div>
        </div>
      </div>
    </section>
  );
};

const ServiceVariantInfo = ({
  rule,
}: {
  rule: Service["variantRules"][number] | null;
}) => {
  if (!rule) {
    return (
      <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
        请选择完整的站点 / 店铺类型 / 入驻方式，查看对应的材料要求与服务说明。
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-lg font-semibold">所需材料</h2>
        <ul className="space-y-2">
          {rule.requiredMaterials.map((item, index) => (
            <li
              key={`material-${index}`}
              className="flex items-start gap-3 text-sm text-muted-foreground"
            >
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border bg-muted/40 p-4">
        <h2 className="mb-2 text-sm font-semibold">准入条件</h2>
        <p className="text-sm text-muted-foreground">{rule.eligibility}</p>
      </div>

      <div className="rounded-lg border bg-muted/40 p-4">
        <h2 className="mb-2 text-sm font-semibold">服务说明</h2>
        <p className="text-sm text-muted-foreground">{rule.disclaimer}</p>
      </div>
    </div>
  );
};

export {ServiceDetail1};
