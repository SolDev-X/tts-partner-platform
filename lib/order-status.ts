import type {OrderStatus} from "@/lib/generated/prisma";

export const orderStatusMeta: Record<
  OrderStatus,
  {label: string; nextStep: string}
> = {
  PENDING_CONFIRMATION: {
    label: "待确认",
    nextStep: "我们将在 1 个工作日内确认材料要求与后续安排。",
  },
  PROCESSING: {
    label: "处理中",
    nextStep: "顾问正在推进您的服务申请，请留意后续通知。",
  },
  WAITING_FOR_CUSTOMER: {
    label: "待补充材料",
    nextStep: "请根据顾问后续说明补充所需材料，以便继续办理。",
  },
  UNDER_REVIEW: {
    label: "审核中",
    nextStep: "材料已提交至平台审核，审核进度会在此订单中更新。",
  },
  COMPLETED: {
    label: "已完成",
    nextStep: "本订单已完成。如有后续问题，请通过联系我们获取协助。",
  },
  CANCELLED: {
    label: "已取消",
    nextStep: "本订单已取消。如需重新办理，请重新选择服务方案。",
  },
};
