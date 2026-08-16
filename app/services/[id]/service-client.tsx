"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {LoaderCircle} from "lucide-react";
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
import {Button} from "@/components/ui/button";

interface ServiceClientProps {
  service: Service;
}

const ServiceDetail1 = ({service}: ServiceClientProps) => {
  const optionGroups = (service.optionGroups ?? []) as OptionGroup[];
  const cases = service.cases ?? [];

  const [submittedSelection, setSubmittedSelection] =
    useState<ServiceSelection | null>(null);
  const planRef = useRef<HTMLDivElement>(null);

  const matchedRule = submittedSelection
    ? matchVariantRule(service.variantRules ?? [], submittedSelection)
    : null;

  useEffect(() => {
    if (!submittedSelection) return;

    planRef.current?.scrollIntoView({behavior: "smooth", block: "start"});
  }, [submittedSelection]);

  const handleSelectionChange = useCallback(() => {
    setSubmittedSelection(null);
  }, []);

  const handlePlanSubmit = useCallback((values: ServiceSelection) => {
    setSubmittedSelection(values);
  }, []);

  return (
    <section className={cn("py-32")}>
      <div className="container mx-auto items-center">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-8">
            <ServiceImageGallery cases={cases} />
            <div className="hidden lg:block">
              <ServiceFaqs faqs={service.faqs} />
            </div>
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
              onChange={handleSelectionChange}
              onSubmitValues={handlePlanSubmit}
            />

            <div ref={planRef} className="scroll-mt-24">
              <ServiceVariantInfo
                rule={matchedRule}
                planGenerated={Boolean(submittedSelection)}
                service={service}
                selection={submittedSelection}
              />
            </div>

            <div className="lg:hidden">
              <ServiceFaqs faqs={service.faqs} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ServiceFaqs = ({faqs}: {faqs?: FAQItem[]}) => {
  if (!faqs || faqs.length === 0) return null;

  return (
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
  );
};

const ServiceVariantInfo = ({
  rule,
  planGenerated,
  service,
  selection,
}: {
  rule: ServiceVariantRule | null;
  planGenerated: boolean;
  service: Service;
  selection: ServiceSelection | null;
}) => {
  return (
    <div className="space-y-6">
      {!planGenerated && (
        <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
          请完善以上信息并查看服务方案。
        </div>
      )}

      {planGenerated && !rule && (
        <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
          当前配置需要平台进一步确认，您可以调整规格后重新查看方案。
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

      {rule?.serviceContent && rule.serviceContent.length > 0 && (
        <div className="rounded-lg border bg-muted/40 p-4">
          <h2 className="mb-3 text-sm font-semibold">服务内容</h2>
          <ul className="space-y-2">
            {rule.serviceContent.map((item, index) => (
              <li
                key={`service-content-${index}`}
                className="flex items-start gap-3 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {rule?.timelineAndDelivery && (
        <div className="rounded-lg border bg-muted/40 p-4">
          <h2 className="mb-2 text-sm font-semibold">办理周期与交付</h2>
          <p className="text-sm whitespace-pre-line text-muted-foreground">
            {rule.timelineAndDelivery}
          </p>
        </div>
      )}

      {rule?.refundPolicy && (
        <div className="rounded-lg border bg-muted/40 p-4">
          <h2 className="mb-2 text-sm font-semibold">退款规则</h2>
          <p className="text-sm whitespace-pre-line text-muted-foreground">
            {rule.refundPolicy}
          </p>
        </div>
      )}

      {rule?.importantNotice && (
        <div className="rounded-lg border bg-muted/40 p-4">
          <h2 className="mb-2 text-sm font-semibold">重要说明</h2>
          <p className="text-sm whitespace-pre-line text-muted-foreground">
            {rule.importantNotice}
          </p>
        </div>
      )}

      {rule && selection && (
        <CreateOrderCard service={service} selection={selection} />
      )}
    </div>
  );
};

const CreateOrderCard = ({
  service,
  selection,
}: {
  service: Service;
  selection: ServiceSelection;
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  async function createOrder() {
    setError(undefined);
    setIsSubmitting(true);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({serviceId: service.id, selection}),
    });

    if (response.status === 401) {
      router.push("/login");
      return;
    }

    if (!response.ok) {
      setIsSubmitting(false);
      setError("创建订单失败，请检查方案后重试。");
      return;
    }

    router.push("/dashboard/orders");
    router.refresh();
  }

  return (
    <div className="rounded-lg border bg-muted/40 p-4">
      <h2 className="text-sm font-semibold">确认方案</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        创建订单后，顾问将确认材料并与您沟通最终报价。
      </p>
      {error && (
        <p className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <Button
        type="button"
        size="lg"
        className="mt-4 w-full"
        disabled={isSubmitting}
        onClick={createOrder}
      >
        {isSubmitting && (
          <LoaderCircle className="animate-spin" aria-hidden="true" />
        )}
        {isSubmitting ? "正在创建订单" : "确认方案并创建订单"}
      </Button>
    </div>
  );
};

export {ServiceDetail1};
