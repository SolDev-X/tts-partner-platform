"use client";

import {useState} from "react";
import type {Service} from "@/lib/types";
import OptionSelector from "@/components/services/OptionSelector";
import CaseShowcase from "@/components/services/CaseShowcase";
import ServiceInfo from "@/components/services/ServiceInfo";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";

export default function ServiceClient({service}: {service: Service}) {
  const [selections, setSelections] = useState<Record<string, string>>({});

  return (
    <div>
      <div className="mx-auto items-center container text-center mt-20">
        {/* 页面标题区 */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {service.label}
          </h1>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            {service.description}
          </p>
        </div>

        <div>
          <div className="flex gap-4 items-center">
            <div className="w-3xl mx-auto px-6 py-10">
              <OptionSelector
                service={service}
                selections={selections}
                onSelect={(groupKey, optionId) =>
                  setSelections((prev) => ({...prev, [groupKey]: optionId}))
                }
              />
            </div>
            <div className="w-3xl mx-auto px-6">
              <ServiceInfo
                details={service.details ?? ""}
                afterSalesRule={service.afterSalesRule ?? ""}
              />
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="#contact"
              className={buttonVariants({
                size: "lg",
                className:
                  " border-black text-black hover:bg-neutral-200 hover:border-white",
              })}
            >
              立即咨询
            </Link>
            <Link
              href="#services"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "border-white text-black hover:bg-neutral-900 hover:text-white",
              })}
            >
              查看服务 →
            </Link>
          </div>
        </div>
      </div>

      <div className="w-4xl mx-auto my-20">
        {service.cases && <CaseShowcase cases={service.cases} />}
      </div>
    </div>
  );
}
