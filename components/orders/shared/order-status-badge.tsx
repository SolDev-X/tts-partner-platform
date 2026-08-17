import type {ComponentType} from "react";
import {
  Ban,
  CircleCheck,
  CreditCard,
  FileUp,
  Hourglass,
  ReceiptText,
  RefreshCcw,
  Settings,
} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import type {OrderStatus} from "@/lib/generated/prisma";
import {orderStatusMeta} from "@/lib/order-status";
import {cn} from "@/lib/utils";

type StatusVisual = {
  icon: ComponentType<{className?: string}>;
  className: string;
};

const statusVisuals = {
  PENDING_CONFIRMATION: {
    icon: Hourglass,
    className: "text-muted-foreground",
  },

  PENDING_PAYMENT: {
    icon: CreditCard,
    className: "text-muted-foreground",
  },

  WAITING_FOR_CUSTOMER: {
    icon: FileUp,
    className: "text-muted-foreground",
  },

  PROCESSING: {
    icon: Settings,
    className: "text-muted-foreground",
  },

  COMPLETED: {
    icon: CircleCheck,
    className: "text-muted-foreground",
  },

  CANCELLED: {
    icon: Ban,
    className: "text-muted-foreground",
  },

  REFUNDING: {
    icon: RefreshCcw,
    className: "text-muted-foreground",
  },

  REFUNDED: {
    icon: ReceiptText,
    className: "text-muted-foreground",
  },
} satisfies Record<OrderStatus, StatusVisual>;

type OrderStatusBadgeProps = {
  status: OrderStatus;
  className?: string;
};

export function OrderStatusBadge({status, className}: OrderStatusBadgeProps) {
  const meta = orderStatusMeta[status];
  const visual = statusVisuals[status];
  const StatusIcon = visual.icon;

  return (
    <Badge
      variant="outline"
      className={cn("px-1.5", visual.className, className)}
    >
      <StatusIcon className="size-3.5" />
      {meta.label}
    </Badge>
  );
}
