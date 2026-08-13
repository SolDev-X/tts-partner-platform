import type {
  MaterialStatus,
  OrderStatus,
  PaymentStatus,
  ProgressStep,
} from "@/lib/generated/prisma";

const progressStepMeta: Record<
  ProgressStep,
  {label: string; order: number}
> = {
  ORDER_CREATED: {label: "订单创建", order: 0},
  PAYMENT_SUCCESS: {label: "支付成功", order: 1},
  MATERIALS_READY: {label: "材料齐全", order: 2},
  PROCESSING: {label: "办理中", order: 3},
  COMPLETED: {label: "已完成", order: 4},
};

const progressStepOrder: ProgressStep[] = [
  "ORDER_CREATED",
  "PAYMENT_SUCCESS",
  "MATERIALS_READY",
  "PROCESSING",
  "COMPLETED",
];

type TimelineStepState = "completed" | "current" | "pending";

export type TimelineStep = {
  step: ProgressStep;
  label: string;
  state: TimelineStepState;
  timestamp: Date | null;
  description: string | null;
};

type ProgressEvent = {
  step: ProgressStep;
  description: string | null;
  createdAt: Date;
};

type OrderTimelineInput = {
  status: OrderStatus;
  createdAt: Date;
  paidAt: Date | null;
  paymentStatus: PaymentStatus;
  deliveryCompletedAt: Date | null;
  materials: Array<{status: MaterialStatus; reviewedAt: Date | null}>;
  requiredMaterialCount: number;
  progressEvents: ProgressEvent[];
};

function latestEventByStep(events: ProgressEvent[]) {
  const map = new Map<ProgressStep, ProgressEvent>();
  for (const event of events) {
    map.set(event.step, event);
  }
  return map;
}

function allMaterialsApproved(
  materials: Array<{status: MaterialStatus; reviewedAt: Date | null}>,
  requiredCount: number,
) {
  if (requiredCount === 0) return true;
  const approved = materials.filter((item) => item.status === "APPROVED");
  return approved.length >= requiredCount;
}

function materialsReadyAt(
  materials: Array<{status: MaterialStatus; reviewedAt: Date | null}>,
  requiredCount: number,
) {
  if (requiredCount === 0) return null;
  const approvedTimes = materials
    .filter((item) => item.status === "APPROVED" && item.reviewedAt)
    .map((item) => item.reviewedAt as Date);
  if (approvedTimes.length < requiredCount) return null;
  return new Date(Math.max(...approvedTimes.map((time) => time.getTime())));
}

export function statusToProgressStep(status: OrderStatus): ProgressStep | null {
  switch (status) {
    case "PENDING_PAYMENT":
      return "ORDER_CREATED";
    case "PENDING_CONFIRMATION":
      return "PAYMENT_SUCCESS";
    case "WAITING_FOR_CUSTOMER":
      return "MATERIALS_READY";
    case "PROCESSING":
      return "PROCESSING";
    case "COMPLETED":
      return "COMPLETED";
    default:
      return null;
  }
}

export function buildOrderTimeline(input: OrderTimelineInput): TimelineStep[] {
  const eventsByStep = latestEventByStep(input.progressEvents);
  const materialsReady = allMaterialsApproved(
    input.materials,
    input.requiredMaterialCount,
  );
  const materialsReadyTime = materialsReadyAt(
    input.materials,
    input.requiredMaterialCount,
  );
  const noMaterialsRequired = input.requiredMaterialCount === 0;

  const stepTimestamps: Record<ProgressStep, Date | null> = {
    ORDER_CREATED: input.createdAt,
    PAYMENT_SUCCESS:
      input.paymentStatus === "PAID"
        ? (input.paidAt ??
          eventsByStep.get("PAYMENT_SUCCESS")?.createdAt ??
          null)
        : null,
    MATERIALS_READY:
      noMaterialsRequired || materialsReady
        ? (materialsReadyTime ??
          eventsByStep.get("MATERIALS_READY")?.createdAt ??
          (noMaterialsRequired ? input.createdAt : null))
        : null,
    PROCESSING:
      input.status === "COMPLETED"
        ? (eventsByStep.get("PROCESSING")?.createdAt ??
          input.deliveryCompletedAt ??
          eventsByStep.get("COMPLETED")?.createdAt ??
          null)
        : input.status === "PROCESSING"
          ? (eventsByStep.get("PROCESSING")?.createdAt ?? null)
          : null,
    COMPLETED:
      input.status === "COMPLETED"
        ? (input.deliveryCompletedAt ??
          eventsByStep.get("COMPLETED")?.createdAt ??
          null)
        : null,
  };

  const stepDescriptions: Record<ProgressStep, string | null> = {
    ORDER_CREATED: eventsByStep.get("ORDER_CREATED")?.description ?? null,
    PAYMENT_SUCCESS: eventsByStep.get("PAYMENT_SUCCESS")?.description ?? null,
    MATERIALS_READY: eventsByStep.get("MATERIALS_READY")?.description ?? null,
    PROCESSING: eventsByStep.get("PROCESSING")?.description ?? null,
    COMPLETED: eventsByStep.get("COMPLETED")?.description ?? null,
  };

  const stepCompleted = (step: ProgressStep) => Boolean(stepTimestamps[step]);

  let currentStep: ProgressStep | null = null;
  if (input.status === "COMPLETED") {
    currentStep = null;
  } else if (input.status === "CANCELLED" || input.status === "REFUNDED") {
    currentStep = null;
  } else {
    currentStep =
      progressStepOrder.find((step) => !stepCompleted(step)) ?? null;
  }

  return progressStepOrder.map((step) => {
    const timestamp = stepTimestamps[step];
    const isCompleted = stepCompleted(step);
    const isCurrent = currentStep === step;

    return {
      step,
      label: progressStepMeta[step].label,
      state: isCompleted ? "completed" : isCurrent ? "current" : "pending",
      timestamp,
      description: stepDescriptions[step],
    };
  });
}

export async function logProgressEvent(
  prisma: {
    orderProgressEvent: {
      create: (args: {
        data: {
          orderId: string;
          step: ProgressStep;
          description?: string | null;
        };
      }) => Promise<unknown>;
    };
  },
  orderId: string,
  step: ProgressStep,
  description?: string | null,
) {
  if (!description?.trim()) return;
  await prisma.orderProgressEvent.create({
    data: {
      orderId,
      step,
      description: description.trim(),
    },
  });
}
