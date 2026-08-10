import type {Metadata} from "next";
import {headers} from "next/headers";
import Link from "next/link";
import {notFound, redirect} from "next/navigation";

import {DeliveryEditor} from "@/components/admin/delivery-editor";
import {OrderEditor} from "@/components/admin/order-editor";
import {MaterialReview} from "@/components/admin/material-review";
import {PaymentEditor} from "@/components/admin/payment-editor";
import {OrderProgressTimeline} from "@/components/orders/order-progress-timeline";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {auth} from "@/lib/auth";
import {services} from "@/lib/data";
import {getOrderDisplayTitle, isStringSelection} from "@/lib/order-display";
import {buildOrderTimeline} from "@/lib/order-progress";
import {orderStatusMeta} from "@/lib/order-status";
import {prisma} from "@/lib/prisma";
import {matchVariantRule} from "@/lib/utils";

export const metadata: Metadata = {
  title: "管理订单详情 | 跨境服务平台",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{orderNumber: string}>;
}) {
  const session = await auth.api.getSession({headers: await headers()});
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const {orderNumber} = await params;
  const order = await prisma.order.findUnique({
    where: {orderNumber},
    select: {
      id: true,
      orderNumber: true,
      serviceId: true,
      serviceLabel: true,
      selection: true,
      status: true,
      customerMessage: true,
      adminNote: true,
      amountInCents: true,
      paymentStatus: true,
      paymentChannel: true,
      transactionId: true,
      paidAt: true,
      refundedAmountInCents: true,
      refundedAt: true,
      deliveryDescription: true,
      deliveryInvitationCode: true,
      deliveryStoreNumber: true,
      deliveryFileName: true,
      deliveryCompletedAt: true,
      deliveryVisibleAfterPayment: true,
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
      user: {select: {name: true, email: true, phoneNumber: true}},
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

  return (
    <section className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 text-muted-foreground hover:text-foreground"
        nativeButton={false}
        render={<Link href="/admin/orders" />}
      >
        返回订单管理
      </Button>

      <div className="mt-5">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {getOrderDisplayTitle(
              order.serviceId,
              order.serviceLabel,
              order.selection,
            )}
          </h1>
          <Badge
            variant="outline"
            className={orderStatusMeta[order.status].badgeClassName}
          >
            {orderStatusMeta[order.status].label}
          </Badge>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {order.serviceLabel}
          <span className="mx-2 text-border">/</span>
          订单号：{order.orderNumber}
          <span className="mx-2 text-border">/</span>
          {order.createdAt.toLocaleDateString("zh-CN")}
        </p>
      </div>

      <Card variant="outline" className="mt-8">
        <CardContent className="p-0">
          <div className="border-b px-5 py-4">
            <h2 className="font-semibold">办理进度</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              订单全流程节点，更新状态时会同步记录说明并展示给客户。
            </p>
          </div>
          <div className="px-5 py-6">
            <OrderProgressTimeline steps={timelineSteps} />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <Card variant="outline">
            <CardContent className="p-5">
              <PaymentEditor
                orderNumber={order.orderNumber}
                amountInCents={order.amountInCents}
                paymentStatus={order.paymentStatus}
                paymentChannel={order.paymentChannel}
                transactionId={order.transactionId}
                refundedAmountInCents={order.refundedAmountInCents}
                paidAt={order.paidAt?.toISOString() ?? null}
                refundedAt={order.refundedAt?.toISOString() ?? null}
              />
            </CardContent>
          </Card>

          <Card variant="outline">
            <CardContent className="p-5">
              <MaterialReview
                orderNumber={order.orderNumber}
                materials={materials.map((material) => ({
                  ...material,
                  submittedAt: material.submittedAt?.toISOString() ?? null,
                }))}
              />
            </CardContent>
          </Card>

          <Card variant="outline">
            <CardContent className="p-5">
              <DeliveryEditor
                orderNumber={order.orderNumber}
                status={order.status}
                deliveryDescription={order.deliveryDescription}
                deliveryInvitationCode={order.deliveryInvitationCode}
                deliveryStoreNumber={order.deliveryStoreNumber}
                deliveryFileName={order.deliveryFileName}
                deliveryCompletedAt={
                  order.deliveryCompletedAt?.toISOString() ?? null
                }
                deliveryVisibleAfterPayment={order.deliveryVisibleAfterPayment}
              />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card variant="outline">
              <CardContent className="p-0">
                <div className="border-b px-5 py-4">
                  <h2 className="text-sm font-semibold text-muted-foreground">
                    客户信息
                  </h2>
                </div>
                <dl className="space-y-4 px-5 py-5 text-sm">
                  <div>
                    <dt className="text-muted-foreground">公司名称</dt>
                    <dd className="mt-1 font-medium">
                      {order.user.name || "未设置名称"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">邮箱</dt>
                    <dd className="mt-1 break-all font-medium">
                      {order.user.email}
                    </dd>
                  </div>
                  {order.user.phoneNumber && (
                    <div>
                      <dt className="text-muted-foreground">手机号</dt>
                      <dd className="mt-1 font-medium">
                        {order.user.phoneNumber}
                      </dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            <Card variant="outline">
              <CardContent className="p-0">
                <div className="border-b px-5 py-4">
                  <h2 className="text-sm font-semibold text-muted-foreground">
                    客户所选方案
                  </h2>
                </div>
                <dl className="divide-y px-5">
                  {selectedOptions.map((item) => (
                    <div
                      key={item.title}
                      className="flex flex-col gap-1 py-3.5 text-sm"
                    >
                      <dt className="text-muted-foreground">{item.title}</dt>
                      <dd className="font-medium">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card variant="outline" className="h-fit lg:sticky lg:top-24">
          <CardContent className="p-5">
            <div className="mb-5 border-b pb-4">
              <h2 className="font-semibold">处理订单</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                更新办理进度和客户可见说明。
              </p>
            </div>
            <OrderEditor
              orderNumber={order.orderNumber}
              status={order.status}
              customerMessage={order.customerMessage}
              adminNote={order.adminNote}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
