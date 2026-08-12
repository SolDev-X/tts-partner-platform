import type {Metadata} from "next";
import {headers} from "next/headers";
import Link from "next/link";
import {notFound, redirect} from "next/navigation";
import {Download, Lock} from "lucide-react";

import {OrderProgressTimeline} from "@/components/orders/order-progress-timeline";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {CancelOrderButton} from "@/components/orders/cancel-order-button";
import {DeliveryActions} from "@/components/orders/delivery-actions";
import {auth} from "@/lib/auth";
import {services} from "@/lib/data";
import {deliveryEventLabels, deliveryStatusMeta, getDeliveryFields} from "@/lib/delivery";
import {getOrderDisplayTitle, isStringSelection} from "@/lib/order-display";
import {buildOrderTimeline} from "@/lib/order-progress";
import {orderStatusMeta} from "@/lib/order-status";
import {prisma} from "@/lib/prisma";
import {matchVariantRule} from "@/lib/utils";

export const metadata: Metadata = {
  title: "订单详情 | 跨境服务平台",
  description: "查看服务订单的方案和办理进度。",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{orderNumber: string}>;
}) {
  const session = await auth.api.getSession({headers: await headers()});
  if (!session) redirect("/login");

  const {orderNumber} = await params;
  const order = await prisma.order.findFirst({
    where: {orderNumber, userId: session.user.id},
    select: {
      orderNumber: true,
      serviceId: true,
      serviceLabel: true,
      selection: true,
      status: true,
      customerMessage: true,
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
        select: {type: true, note: true, createdAt: true},
      },
      createdAt: true,
      materials: {
        select: {status: true, reviewedAt: true},
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
    return [{title: group.title, value: option?.name ?? value}];
  });
  const variantRule = service
    ? matchVariantRule(service.variantRules ?? [], selection)
    : null;
  const status = orderStatusMeta[order.status];

  const timelineSteps = buildOrderTimeline({
    status: order.status,
    createdAt: order.createdAt,
    paidAt: order.paidAt,
    paymentStatus: order.paymentStatus,
    deliveryCompletedAt: order.deliveryCompletedAt,
    materials: order.materials,
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
    order.deliveryStatus === "PUBLISHED" || order.deliveryStatus === "CONFIRMED";
  const deliveryLocked = order.paymentStatus !== "PAID";

  return (
    <section className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
      <Button
        variant="ghost"
        className="-ml-3"
        nativeButton={false}
        render={<Link href="/account/orders" />}
      >
        返回我的订单
      </Button>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {getOrderDisplayTitle(
              order.serviceId,
              order.serviceLabel,
              order.selection,
            )}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {order.serviceLabel} · 订单号：{order.orderNumber}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={status.badgeClassName}>
            {status.label}
          </Badge>
          {(order.status === "PENDING_PAYMENT" ||
            order.status === "PENDING_CONFIRMATION") && (
            <CancelOrderButton orderNumber={order.orderNumber} />
          )}
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <Card variant="outline">
          <CardContent className="p-5">
            <h2 className="font-semibold">办理进度</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {status.nextStep}
            </p>
            <div className="mt-5">
              <OrderProgressTimeline steps={timelineSteps} compact />
            </div>
          </CardContent>
        </Card>

        {order.customerMessage && (
          <Card variant="outline">
            <CardContent className="p-5">
              <h2 className="font-semibold">平台处理说明</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground whitespace-pre-line">
                {order.customerMessage}
              </p>
            </CardContent>
          </Card>
        )}

        {deliveryIsPublished && (
          <Card variant="outline">
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">服务交付</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    请核对交付内容，确认无误后完成订单。
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={deliveryStatusMeta[order.deliveryStatus].className}
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
                <div className="mt-4 space-y-4 text-sm">
                  {order.deliveryDescription && (
                    <p className="leading-6 text-muted-foreground whitespace-pre-line">
                      {order.deliveryDescription}
                    </p>
                  )}
                  {deliveryFields.length > 0 && (
                    <dl className="grid gap-3 rounded-lg bg-muted/40 p-4 sm:grid-cols-2">
                      {deliveryFields.map((field) => (
                        <div key={field.key}>
                          <dt className="text-muted-foreground">{field.label}</dt>
                          <dd className="mt-1 break-all font-medium">{deliveryData[field.key]}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {order.deliveryFileName && order.deliveryFilePathname && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{order.deliveryFileName}</p>
                        {order.deliveryFileSize !== null && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {(order.deliveryFileSize / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={
                          <a href={`/api/orders/${order.orderNumber}/delivery/file`} />
                        }
                      >
                        <Download /> 下载交付文件
                      </Button>
                    </div>
                  )}
                  {(order.deliveryConfirmedAt ?? order.deliveryPublishedAt) && (
                    <p className="text-xs text-muted-foreground">
                      {order.deliveryConfirmedAt ? "确认时间" : "发布时间"}：
                      {(order.deliveryConfirmedAt ?? order.deliveryPublishedAt)?.toLocaleString("zh-CN")}
                    </p>
                  )}
                  {order.deliveryEvents.length > 0 && (
                    <div className="space-y-2 border-t pt-4">
                      <p className="font-medium">交付记录</p>
                      {order.deliveryEvents.map((event, index) => (
                        <div key={`${event.type}-${event.createdAt.toISOString()}-${index}`} className="flex items-start justify-between gap-4 text-xs text-muted-foreground">
                          <div>
                            <p>{deliveryEventLabels[event.type]}</p>
                            {event.type === "REVISION_REQUESTED" && event.note && <p className="mt-1 whitespace-pre-line">{event.note}</p>}
                          </div>
                          <time className="shrink-0">{event.createdAt.toLocaleString("zh-CN")}</time>
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

        <Card variant="outline">
          <CardContent className="p-5">
            <h2 className="font-semibold">已选服务方案</h2>
            {selectedOptions.length > 0 ? (
              <dl className="mt-4 divide-y">
                {selectedOptions.map((item) => (
                  <div
                    key={item.title}
                    className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <dt className="text-muted-foreground">{item.title}</dt>
                    <dd className="font-medium">{item.value}</dd>
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

        <Card variant="outline">
          <CardContent className="p-5">
            <h2 className="font-semibold">订单信息</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              创建时间：{order.createdAt.toLocaleString("zh-CN")}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
