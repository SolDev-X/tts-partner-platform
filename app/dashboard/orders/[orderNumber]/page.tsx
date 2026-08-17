import type {Metadata} from "next";
import {headers} from "next/headers";
import Link from "next/link";
import {notFound, redirect} from "next/navigation";
import {
  ArrowLeft,
  CircleCheck,
  Clock3,
  Download,
  FileCheck2,
  Lock,
  MessageSquareText,
  PackageCheck,
  ReceiptText,
  ShieldCheck,
  TriangleAlert,
  WalletCards,
} from "lucide-react";

import {DeliveryActions} from "@/components/orders/customer/delivery-actions";
import {OrderProgressTimeline} from "@/components/orders/shared/order-progress-timeline";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {auth} from "@/lib/auth";
import {services} from "@/lib/data";
import {
  deliveryEventLabels,
  deliveryStatusMeta,
  getDeliveryFields,
} from "@/lib/delivery";
import {getOrderDisplayTitle, isStringSelection} from "@/lib/order-display";
import {buildOrderTimeline} from "@/lib/order-progress";
import {orderStatusMeta} from "@/lib/order-status";
import {prisma} from "@/lib/prisma";
import {matchVariantRule} from "@/lib/utils";
import {OrderStatusBadge} from "@/components/orders/shared/order-status-badge";

export const metadata: Metadata = {
  title: "订单详情 | 跨境服务平台",
  description: "查看订单状态、付款、材料审核、办理进度与服务交付。",
};

function formatAmount(amountInCents: number | null) {
  if (amountInCents == null) return "待确认";

  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(amountInCents / 100);
}

function getPaymentMeta(status: string) {
  switch (status) {
    case "PAID":
      return {
        label: "已付款",
        description: "平台已确认收到付款。",
        icon: CircleCheck,
      };
    case "REFUNDED":
      return {
        label: "已退款",
        description: "款项已完成退款。",
        icon: CircleCheck,
      };
    case "REFUNDING":
      return {
        label: "退款处理中",
        description: "平台正在处理退款，请耐心等待。",
        icon: Clock3,
      };
    default:
      return {
        label: "待付款",
        description: "付款确认后，平台将继续推进后续办理流程。",
        icon: WalletCards,
      };
  }
}

function getMaterialMeta(status: string) {
  switch (status) {
    case "APPROVED":
      return {
        label: "已通过",
        className: "border-transparent bg-muted text-foreground",
      };
    case "REJECTED":
      return {
        label: "需修改",
        className: "border-destructive/30 bg-destructive/5 text-destructive",
      };
    case "SUBMITTED":
      return {
        label: "待审核",
        className: "border-border bg-background text-muted-foreground",
      };
    default:
      return {
        label: "待提交",
        className: "border-border bg-background text-muted-foreground",
      };
  }
}

function getStageCopy(status: string, nextStep: string) {
  switch (status) {
    case "PENDING_PAYMENT":
      return {
        eyebrow: "需要你处理",
        title: "完成付款后开始办理",
        description: nextStep,
        icon: WalletCards,
      };
    case "WAITING_FOR_CUSTOMER":
      return {
        eyebrow: "需要你处理",
        title: "请补充或修改所需材料",
        description: nextStep,
        icon: TriangleAlert,
      };
    case "PENDING_CONFIRMATION":
      return {
        eyebrow: "平台处理中",
        title: "订单正在确认",
        description: nextStep,
        icon: ShieldCheck,
      };
    case "PROCESSING":
      return {
        eyebrow: "平台处理中",
        title: "服务正在办理",
        description: nextStep,
        icon: Clock3,
      };
    case "REFUNDING":
      return {
        eyebrow: "退款处理中",
        title: "平台正在处理退款",
        description: nextStep,
        icon: Clock3,
      };
    case "COMPLETED":
      return {
        eyebrow: "已完成",
        title: "本次服务已完成",
        description: nextStep,
        icon: PackageCheck,
      };
    case "CANCELLED":
      return {
        eyebrow: "已结束",
        title: "订单已取消",
        description: nextStep,
        icon: TriangleAlert,
      };
    default:
      return {
        eyebrow: "当前进度",
        title: "查看订单办理状态",
        description: nextStep,
        icon: Clock3,
      };
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{orderNumber: string}>;
}) {
  const session = await auth.api.getSession({headers: await headers()});
  if (!session) redirect("/login");

  const {orderNumber} = await params;

  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      userId: session.user.id,
    },
    select: {
      orderNumber: true,
      serviceId: true,
      serviceLabel: true,
      selection: true,
      status: true,
      customerMessage: true,

      amountInCents: true,
      paymentStatus: true,
      paidAt: true,

      deliveryDescription: true,
      deliveryInvitationCode: true,
      deliveryStoreNumber: true,
      deliveryFileName: true,
      deliveryFilePathname: true,
      deliveryFileSize: true,
      deliveryData: true,
      deliveryStatus: true,
      deliveryPublishedAt: true,
      deliveryConfirmedAt: true,
      deliveryRevisionNote: true,
      deliveryCompletedAt: true,
      deliveryEvents: {
        orderBy: {createdAt: "desc"},
        select: {
          type: true,
          note: true,
          createdAt: true,
        },
      },

      createdAt: true,

      materials: {
        orderBy: {createdAt: "asc"},
        select: {
          key: true,
          label: true,
          status: true,
          fileName: true,
          customerNote: true,
          adminFeedback: true,
          submittedAt: true,
          reviewedAt: true,
        },
      },

      progressEvents: {
        orderBy: {createdAt: "asc"},
        select: {
          step: true,
          description: true,
          createdAt: true,
        },
      },
    },
  });

  if (!order) notFound();

  const service = services.find((item) => item.id === order.serviceId);
  const selection = isStringSelection(order.selection) ? order.selection : {};

  const selectedOptions = (service?.optionGroups ?? []).flatMap((group) => {
    const value = selection[group.key];
    if (!value) return [];

    const option = group.options.find((item) => item.id === value);

    return [
      {
        title: group.title,
        value: option?.name ?? value,
      },
    ];
  });

  const variantRule = service
    ? matchVariantRule(service.variantRules ?? [], selection)
    : null;

  /*
   * 客户端与管理员端共用同一套材料记录。
   * 管理员审核 MaterialReview 写入的状态/反馈，会在这里直接展示给客户。
   */
  const savedMaterials = new Map(
    order.materials.map((material) => [material.key, material]),
  );

  const materials = (variantRule?.requiredMaterials ?? []).map(
    (label, index) => {
      const key = `material-${index + 1}`;

      return (
        savedMaterials.get(key) ?? {
          key,
          label,
          status: "PENDING" as const,
          fileName: null,
          customerNote: null,
          adminFeedback: null,
          submittedAt: null,
          reviewedAt: null,
        }
      );
    },
  );

  const status = orderStatusMeta[order.status];
  const stage = getStageCopy(order.status, status.nextStep);
  const StageIcon = stage.icon;

  const payment = getPaymentMeta(order.paymentStatus);
  const PaymentIcon = payment.icon;

  const approvedMaterialCount = materials.filter(
    (material) => material.status === "APPROVED",
  ).length;
  const rejectedMaterialCount = materials.filter(
    (material) => String(material.status) === "REJECTED",
  ).length;

  const timelineSteps = buildOrderTimeline({
    status: order.status,
    createdAt: order.createdAt,
    paidAt: order.paidAt,
    paymentStatus: order.paymentStatus,
    deliveryCompletedAt: order.deliveryCompletedAt,
    materials: materials.map((material) => ({
      status: material.status,
      reviewedAt: material.reviewedAt,
    })),
    requiredMaterialCount: variantRule?.requiredMaterials?.length ?? 0,
    progressEvents: order.progressEvents,
  });

  const savedDeliveryData =
    order.deliveryData &&
    typeof order.deliveryData === "object" &&
    !Array.isArray(order.deliveryData)
      ? Object.fromEntries(
          Object.entries(order.deliveryData).filter(
            (entry): entry is [string, string] => typeof entry[1] === "string",
          ),
        )
      : {};

  const deliveryData: Record<string, string> = {
    ...savedDeliveryData,
    ...(savedDeliveryData.invitationCode || !order.deliveryInvitationCode
      ? {}
      : {invitationCode: order.deliveryInvitationCode}),
    ...(savedDeliveryData.storeNumber || !order.deliveryStoreNumber
      ? {}
      : {storeNumber: order.deliveryStoreNumber}),
  };

  const deliveryFields = getDeliveryFields(order.serviceId).filter(
    (field) => deliveryData[field.key],
  );

  const deliveryIsPublished =
    order.deliveryStatus === "PUBLISHED" ||
    order.deliveryStatus === "CONFIRMED";

  const deliveryLocked = order.paymentStatus !== "PAID";

  return (
    <section className="w-full px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 text-muted-foreground hover:text-foreground"
          nativeButton={false}
          render={<Link href="/dashboard/orders" />}
        >
          <ArrowLeft />
          返回我的订单
        </Button>

        {/* 订单标题 */}
        <div className="mt-5 flex flex-col gap-4 sm:mt-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {getOrderDisplayTitle(
                  order.serviceId,
                  order.serviceLabel,
                  order.selection,
                )}
              </h1>

              <OrderStatusBadge status={order.status} />
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span>{order.serviceLabel}</span>
              <span className="text-border">/</span>
              <span className="tabular-nums">订单号：{order.orderNumber}</span>
              <span className="hidden text-border sm:inline">/</span>
              <span className="w-full tabular-nums sm:w-auto">
                {order.createdAt.toLocaleDateString("zh-CN")}
              </span>
            </div>
          </div>
        </div>

        {/* 当前阶段：客户打开页面第一眼就知道现在轮到谁处理 */}
        <Card className="mt-6 sm:mt-8">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <StageIcon className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">
                  {stage.eyebrow}
                </p>
                <h2 className="mt-1 text-lg font-semibold">{stage.title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {stage.description}
                </p>

                {order.customerMessage && (
                  <div className="mt-4 flex items-start gap-3 rounded-lg bg-muted/40 p-3">
                    <MessageSquareText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
                      {order.customerMessage}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 全局进度：由管理员更新的付款、审核、办理、交付状态共同驱动 */}
        <Card className="mt-4">
          <CardContent className="p-5 sm:p-6">
            <div>
              <h2 className="font-semibold">服务进度</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                从订单确认、材料审核到最终交付，所有关键节点都会同步到这里。
              </p>
            </div>

            <div className="mt-5">
              <OrderProgressTimeline steps={timelineSteps} compact />
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* 主流程 */}
          <div className="min-w-0 space-y-4">
            {/* 付款 */}
            <Card>
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <PaymentIcon className="size-4.5" />
                    </div>

                    <div>
                      <h2 className="font-semibold">付款信息</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {payment.description}
                      </p>
                    </div>
                  </div>

                  <Badge variant="outline">{payment.label}</Badge>
                </div>

                <dl className="mt-5 grid gap-4 rounded-lg bg-muted/30 p-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">订单金额</dt>
                    <dd className="mt-1 font-medium tabular-nums">
                      {formatAmount(order.amountInCents)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground">付款时间</dt>
                    <dd className="mt-1 font-medium tabular-nums">
                      {order.paidAt
                        ? order.paidAt.toLocaleString("zh-CN")
                        : "尚未确认"}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* 材料 */}
            {materials.length > 0 && (
              <Card>
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <FileCheck2 className="size-4.5" />
                      </div>

                      <div>
                        <h2 className="font-semibold">办理材料</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          管理员审核结果会直接同步到这里。
                        </p>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      已通过 {approvedMaterialCount}/{materials.length}
                    </div>
                  </div>

                  {rejectedMaterialCount > 0 && (
                    <div className="mt-4 flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm">
                      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
                      <p>
                        有 {rejectedMaterialCount}{" "}
                        项材料需要修改，请查看管理员反馈。
                      </p>
                    </div>
                  )}

                  <div className="mt-4 divide-y rounded-lg border">
                    {materials.map((material) => {
                      const meta = getMaterialMeta(material.status);

                      return (
                        <div
                          key={material.key}
                          className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between"
                        >
                          <div className="min-w-0">
                            <p className="font-medium">{material.label}</p>

                            {material.fileName && (
                              <p className="mt-1 truncate text-xs text-muted-foreground">
                                已提交：{material.fileName}
                              </p>
                            )}

                            {material.adminFeedback && (
                              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                                管理员反馈：{material.adminFeedback}
                              </p>
                            )}
                          </div>

                          <Badge
                            variant="outline"
                            className={`shrink-0 ${meta.className}`}
                          >
                            {meta.label}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 服务交付 */}
            {deliveryIsPublished && (
              <Card>
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <PackageCheck className="size-4.5" />
                      </div>

                      <div>
                        <h2 className="font-semibold">服务交付</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          请核对交付内容；确认无误后完成订单，如有问题可申请修改。
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={
                        deliveryStatusMeta[order.deliveryStatus].className
                      }
                    >
                      {deliveryStatusMeta[order.deliveryStatus].label}
                    </Badge>
                  </div>

                  {deliveryLocked ? (
                    <div className="mt-4 flex items-start gap-3 rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
                      <Lock className="mt-0.5 size-4 shrink-0" />
                      <p>交付结果包含敏感信息，完成付款后可查看。</p>
                    </div>
                  ) : (
                    <div className="mt-5 space-y-4 text-sm">
                      {order.deliveryDescription && (
                        <p className="whitespace-pre-line leading-6 text-muted-foreground">
                          {order.deliveryDescription}
                        </p>
                      )}

                      {deliveryFields.length > 0 && (
                        <dl className="grid gap-3 rounded-lg bg-muted/40 p-4 sm:grid-cols-2">
                          {deliveryFields.map((field) => (
                            <div key={field.key}>
                              <dt className="text-muted-foreground">
                                {field.label}
                              </dt>
                              <dd className="mt-1 break-all font-medium">
                                {deliveryData[field.key]}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}

                      {order.deliveryFileName && order.deliveryFilePathname && (
                        <div className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {order.deliveryFileName}
                            </p>

                            {order.deliveryFileSize !== null && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {(order.deliveryFileSize / 1024 / 1024).toFixed(
                                  2,
                                )}{" "}
                                MB
                              </p>
                            )}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                            nativeButton={false}
                            render={
                              <a
                                href={`/api/orders/${order.orderNumber}/delivery/file`}
                              />
                            }
                          >
                            <Download />
                            下载交付文件
                          </Button>
                        </div>
                      )}

                      {(order.deliveryConfirmedAt ??
                        order.deliveryPublishedAt) && (
                        <p className="text-xs text-muted-foreground">
                          {order.deliveryConfirmedAt ? "确认时间" : "发布时间"}
                          ：
                          {(
                            order.deliveryConfirmedAt ??
                            order.deliveryPublishedAt
                          )?.toLocaleString("zh-CN")}
                        </p>
                      )}

                      {order.deliveryEvents.length > 0 && (
                        <div className="space-y-3 border-t pt-4">
                          <p className="font-medium">交付记录</p>

                          {order.deliveryEvents.map((event, index) => (
                            <div
                              key={`${event.type}-${event.createdAt.toISOString()}-${index}`}
                              className="flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                            >
                              <div>
                                <p>{deliveryEventLabels[event.type]}</p>

                                {event.type === "REVISION_REQUESTED" &&
                                  event.note && (
                                    <p className="mt-1 whitespace-pre-line">
                                      {event.note}
                                    </p>
                                  )}
                              </div>

                              <time className="shrink-0 tabular-nums">
                                {event.createdAt.toLocaleString("zh-CN")}
                              </time>
                            </div>
                          ))}
                        </div>
                      )}

                      {order.deliveryStatus === "PUBLISHED" && (
                        <DeliveryActions orderNumber={order.orderNumber} />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* 右侧摘要：桌面 sticky，移动端自然排在主流程之后 */}
          <aside className="space-y-4 xl:sticky xl:top-20">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2">
                  <ReceiptText className="size-4 text-muted-foreground" />
                  <h2 className="font-semibold">服务方案</h2>
                </div>

                {selectedOptions.length > 0 ? (
                  <dl className="mt-4 divide-y">
                    {selectedOptions.map((item) => (
                      <div key={item.title} className="py-3 text-sm">
                        <dt className="text-muted-foreground">{item.title}</dt>
                        <dd className="mt-1 font-medium">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    暂无可展示的方案信息。
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-muted-foreground" />
                  <h2 className="font-semibold">订单信息</h2>
                </div>

                <dl className="mt-4 space-y-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">订单号</dt>
                    <dd className="mt-1 break-all font-medium tabular-nums">
                      {order.orderNumber}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground">创建时间</dt>
                    <dd className="mt-1 font-medium tabular-nums">
                      {order.createdAt.toLocaleString("zh-CN")}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground">当前状态</dt>
                    <dd className="mt-1 font-medium">{status.label}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h2 className="font-semibold">需要帮助？</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  如果对付款、材料审核或交付结果有疑问，可以联系平台顾问。
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                  nativeButton={false}
                  render={<Link href="/contact" />}
                >
                  联系我们
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </section>
  );
}
