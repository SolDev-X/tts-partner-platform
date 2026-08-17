import type {OrderStatus} from "@/lib/generated/prisma";

export type OrderStatusMeta = {
  label: string;
  nextStep: string;
};

export const orderStatusMeta = {
  PENDING_CONFIRMATION: {
    label: "待确认",
    nextStep: "平台正在确认订单信息与服务内容，确认后将更新订单金额。",
  },

  PENDING_PAYMENT: {
    label: "待付款",
    nextStep: "订单金额已确认，请完成付款，付款后平台将开始办理。",
  },

  WAITING_FOR_CUSTOMER: {
    label: "待补资料",
    nextStep: "请根据平台要求补充所需资料，以便继续办理。",
  },

  PROCESSING: {
    label: "办理中",
    nextStep: "平台正在推进服务办理，请留意后续通知。",
  },

  COMPLETED: {
    label: "已完成",
    nextStep: "订单服务已完成。",
  },

  CANCELLED: {
    label: "已取消",
    nextStep: "订单已取消。",
  },

  REFUNDING: {
    label: "退款中",
    nextStep: "退款正在处理中，到账时间以支付渠道为准。",
  },

  REFUNDED: {
    label: "已退款",
    nextStep: "退款已完成。",
  },
} satisfies Record<OrderStatus, OrderStatusMeta>;

export function getOrderStatusMeta(status: OrderStatus) {
  return orderStatusMeta[status];
}
