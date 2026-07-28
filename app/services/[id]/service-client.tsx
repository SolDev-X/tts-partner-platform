"use client";

import {useState} from "react";
import type {Service} from "@/lib/types";
import OptionSelector from "@/components/services/OptionSelector";

export default function ServiceClient({service}: {service: Service}) {
  const [selections, setSelections] = useState<Record<string, string>>({});

  return (
    <div>
      <OptionSelector
        service={service}
        selections={selections}
        onSelect={(groupKey, optionId) =>
          setSelections((prev) => ({...prev, [groupKey]: optionId}))
        }
      />
    </div>
  );
}
