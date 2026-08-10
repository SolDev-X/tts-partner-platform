import {Check, Circle} from "lucide-react";

import {cn} from "@/lib/utils";
import type {TimelineStep} from "@/lib/order-progress";

export function OrderProgressTimeline({
  steps,
  compact = false,
}: {
  steps: TimelineStep[];
  compact?: boolean;
}) {
  return (
    <ol className={cn("relative", compact ? "space-y-0" : "space-y-0")}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isCompleted = step.state === "completed";
        const isCurrent = step.state === "current";

        return (
          <li key={step.step} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[11px] top-6 h-[calc(100%-12px)] w-px",
                  isCompleted ? "bg-emerald-300" : "bg-border",
                )}
              />
            )}

            <span
              className={cn(
                "relative z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                isCompleted && "border-emerald-500 bg-emerald-500 text-white",
                isCurrent && "border-primary bg-primary/10 text-primary",
                !isCompleted &&
                  !isCurrent &&
                  "border-muted-foreground/25 bg-background text-muted-foreground/40",
              )}
            >
              {isCompleted ? (
                <Check className="size-3.5" strokeWidth={3} />
              ) : (
                <Circle className="size-2 fill-current" />
              )}
            </span>

            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isCompleted && "text-foreground",
                    isCurrent && "text-primary",
                    !isCompleted && !isCurrent && "text-muted-foreground",
                  )}
                >
                  {step.label}
                </p>
                {step.timestamp && (
                  <time
                    dateTime={step.timestamp.toISOString()}
                    className="text-xs text-muted-foreground"
                  >
                    {step.timestamp.toLocaleString("zh-CN")}
                  </time>
                )}
                {isCurrent && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    当前阶段
                  </span>
                )}
              </div>

              {step.description && (
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground whitespace-pre-line">
                  {step.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
