export type DeliveryField = {
  key: string;
  label: string;
  placeholder: string;
};

const fieldsByService: Record<string, DeliveryField[]> = {
  onboarding: [
    {key: "invitationCode", label: "邀请码", placeholder: "填写已交付的邀请码"},
    {key: "storeNumber", label: "店铺编号", placeholder: "填写平台店铺编号（如有）"},
  ],
  whitelist: [
    {key: "approvedCategory", label: "已开通类目", placeholder: "填写最终通过的类目"},
    {key: "resultReference", label: "结果凭证说明", placeholder: "填写审核结果或凭证说明"},
  ],
  permissions: [
    {key: "permissionScope", label: "已开通权限", placeholder: "填写已开通的权限范围"},
    {key: "effectiveAt", label: "生效时间", placeholder: "填写权限生效时间"},
  ],
};

export function getDeliveryFields(serviceId: string): DeliveryField[] {
  return fieldsByService[serviceId] ?? [
    {key: "resultReference", label: "交付结果", placeholder: "填写交付结果"},
  ];
}

export const deliveryStatusMeta = {
  DRAFT: {label: "草稿", className: "border-border text-muted-foreground"},
  PUBLISHED: {label: "待客户确认", className: "border-blue-200 bg-blue-50 text-blue-700"},
  REVISION_REQUESTED: {label: "客户申请修改", className: "border-amber-200 bg-amber-50 text-amber-700"},
  CONFIRMED: {label: "客户已确认", className: "border-emerald-200 bg-emerald-50 text-emerald-700"},
} as const;

export const deliveryEventLabels = {
  PUBLISHED: "管理员发布交付",
  REVISION_REQUESTED: "客户申请修改",
  CONFIRMED: "客户确认交付",
} as const;
