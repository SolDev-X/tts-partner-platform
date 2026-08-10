import type {Metadata} from "next";
import {headers} from "next/headers";
import Link from "next/link";
import {notFound, redirect} from "next/navigation";
import {Lock} from "lucide-react";

import {OrderProgressTimeline} from "@/components/orders/order-progress-timeline";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {CancelOrderButton} from "@/components/orders/cancel-order-button";
import {auth} from "@/lib/auth";
import {services} from "@/lib/data";
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
      deliveryCompletedAt: true,
      deliveryVisibleAfterPayment: true,
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

  const hasDeliveryContent = Boolean(
    order.deliveryDescription ||
    order.deliveryInvitationCode ||
    order.deliveryStoreNumber ||
    order.deliveryFileName,
  );
  const deliveryLocked =
    order.deliveryVisibleAfterPayment && order.paymentStatus !== "PAID";

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

        {hasDeliveryContent && (
          <Card variant="outline">
            <CardContent className="p-5">
              <h2 className="font-semibold">服务交付</h2>
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
                  {(order.deliveryInvitationCode ||
                    order.deliveryStoreNumber) && (
                    <dl className="grid gap-3 rounded-lg bg-muted/40 p-4 sm:grid-cols-2">
                      {order.deliveryInvitationCode && (
                        <div>
                          <dt className="text-muted-foreground">邀请码</dt>
                          <dd className="mt-1 font-medium">
                            {order.deliveryInvitationCode}
                          </dd>
                        </div>
                      )}
                      {order.deliveryStoreNumber && (
                        <div>
                          <dt className="text-muted-foreground">店铺编号</dt>
                          <dd className="mt-1 font-medium">
                            {order.deliveryStoreNumber}
                          </dd>
                        </div>
                      )}
                    </dl>
                  )}
                  {order.deliveryFileName && (
                    <p className="text-muted-foreground">
                      结果文件：{order.deliveryFileName}
                    </p>
                  )}
                  {order.deliveryCompletedAt && (
                    <p className="text-xs text-muted-foreground">
                      完成时间：
                      {order.deliveryCompletedAt.toLocaleString("zh-CN")}
                    </p>
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
