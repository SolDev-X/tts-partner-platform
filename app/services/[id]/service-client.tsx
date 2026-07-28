"use client";

import {useState} from "react";
import type {Service} from "@/lib/types";
import OptionSelector from "@/components/services/OptionSelector";
import CaseShowcase from "@/components/services/CaseShowcase";

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

        <div className="flex gap-4 items-center">
          {service.cases && <CaseShowcase cases={service.cases} />}
          <div className="w-3xl mx-auto px-6 py-10">
            <OptionSelector
              service={service}
              selections={selections}
              onSelect={(groupKey, optionId) =>
                setSelections((prev) => ({...prev, [groupKey]: optionId}))
              }
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <div>
          <h3>服务详细</h3>
          <div>xxxx</div>
        </div>
        <div>
          <h3>售后规则</h3>
          <div>xxxx</div>
        </div>
      </div>
    </div>
  );
}
