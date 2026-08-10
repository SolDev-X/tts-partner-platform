import type {OrderStatus} from "@/lib/generated/prisma";

export const orderStatusMeta: Record<
  OrderStatus,
  {label: string; nextStep: string; badgeClassName: string}
> = {
  PENDING_CONFIRMATION: {
    label: "待确认",
    nextStep: "我们将在 1 个工作日内确认材料要求与后续安排。",
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-800",
  },
  PROCESSING: {
    label: "处理中",
    nextStep: "顾问正在推进您的服务申请，请留意后续通知。",
    badgeClassName: "border-blue-200 bg-blue-50 text-blue-800",
  },
  WAITING_FOR_CUSTOMER: {
    label: "待补充材料",
    nextStep: "请根据顾问后续说明补充所需材料，以便继续办理。",
    badgeClassName: "border-orange-200 bg-orange-50 text-orange-800",
  },
  UNDER_REVIEW: {
    label: "审核中",
    nextStep: "材料已提交至平台审核，审核进度会在此订单中更新。",
    badgeClassName: "border-sky-200 bg-sky-50 text-sky-800",
  },
  COMPLETED: {
    label: "已完成",
    nextStep: "本订单已完成。如有后续问题，请通过联系我们获取协助。",
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  CANCELLED: {
    label: "已取消",
    nextStep: "本订单已取消。如需重新办理，请重新选择服务方案。",
    badgeClassName: "border-slate-200 bg-slate-100 text-slate-600",
  },
};
