"use client";

import {useState} from "react";
import {cn} from "@/lib/utils";
import type {Service, ServiceVariantRule, FAQItem} from "@/lib/types";
import {matchVariantRule} from "@/lib/utils";
import type {ServiceSelection} from "@/lib/types";
import type {OptionGroup} from "@/lib/types";
import {ServiceOptionsForm} from "./service-options-form";
import {ServiceImageGallery} from "./service-image-gallery";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

            <ServiceVariantInfo rule={matchedRule} faqs={service.faqs} />
          </div>
        </div>
      </div>
    </section>
  );
};

const ServiceVariantInfo = ({
  rule,
  faqs,
}: {
  rule: ServiceVariantRule | null;
  faqs?: FAQItem[];
}) => {
  return (
    <div className="space-y-6">
      {!rule && (
        <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
          请完善以上信息，查看对应的材料要求与服务说明。
        </div>
      )}

      {rule?.requiredMaterials && rule.requiredMaterials.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">需提供材料</h2>
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
      )}

      {rule?.eligibility && (
        <div className="rounded-lg border bg-muted/40 p-4">
          <h2 className="mb-2 text-sm font-semibold">准入条件</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {rule.eligibility}
          </p>
        </div>
      )}

      {rule?.disclaimer && (
        <div className="rounded-lg border bg-muted/40 p-4">
          <h2 className="mb-2 text-sm font-semibold">服务承诺与责任说明</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {rule.disclaimer}
          </p>
        </div>
      )}

      {faqs && faqs.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">常见问题</h2>
          <Accordion type="single" collapsible>
            {faqs.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="text-sm">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export {ServiceDetail1};
