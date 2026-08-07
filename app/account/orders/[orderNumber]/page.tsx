import type {Metadata} from "next";
import {headers} from "next/headers";
import Link from "next/link";
import {notFound, redirect} from "next/navigation";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {CancelOrderButton} from "@/components/orders/cancel-order-button";
import {auth} from "@/lib/auth";
import {services} from "@/lib/data";
import {getOrderDisplayTitle, isStringSelection} from "@/lib/order-display";
import {orderStatusMeta} from "@/lib/order-status";
import {prisma} from "@/lib/prisma";

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
      createdAt: true,
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
  const status = orderStatusMeta[order.status];

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
          <Badge variant="secondary">{status.label}</Badge>
          {order.status === "PENDING_CONFIRMATION" && (
            <CancelOrderButton orderNumber={order.orderNumber} />
          )}
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <Card variant="outline">
          <CardContent className="p-5">
            <h2 className="font-semibold">当前进度</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {status.nextStep}
            </p>
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
