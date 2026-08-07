import type {Metadata} from "next";
import {headers} from "next/headers";
import Link from "next/link";
import {redirect} from "next/navigation";
import {ArrowRight, ClipboardList, PackageOpen} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {auth} from "@/lib/auth";
import type {OrderStatus} from "@/lib/generated/prisma";
import {getOrderDisplayTitle} from "@/lib/order-display";
import {orderStatusMeta} from "@/lib/order-status";
import {prisma} from "@/lib/prisma";

export const metadata: Metadata = {
  title: "我的服务 | 跨境服务平台",
  description: "查看您的跨境服务订单和办理进度。",
};

const activeOrderStatuses: OrderStatus[] = [
  "PENDING_CONFIRMATION",
  "PROCESSING",
  "WAITING_FOR_CUSTOMER",
  "UNDER_REVIEW",
];

const orderFilters = [
  {id: "all", label: "全部", href: "/account/orders?status=all"},
  {id: "active", label: "进行中", href: "/account/orders"},
  {id: "completed", label: "已完成", href: "/account/orders?status=completed"},
  {id: "cancelled", label: "已取消", href: "/account/orders?status=cancelled"},
] as const;

function getOrderAction(status: OrderStatus) {
  if (status === "WAITING_FOR_CUSTOMER") return "查看材料要求";
  if (status === "PENDING_CONFIRMATION" || status === "UNDER_REVIEW") {
    return "查看进度";
  }
  return "查看详情";
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{status?: string}>;
}) {
  const session = await auth.api.getSession({headers: await headers()});
  if (!session) redirect("/login");

  const {status} = await searchParams;
  const activeFilter =
    status === "all" || status === "completed" || status === "cancelled"
      ? status
      : "active";

  const [orders, groupedStatuses] = await Promise.all([
    prisma.order.findMany({
      where: {
        userId: session.user.id,
        ...(activeFilter === "cancelled"
          ? {status: "CANCELLED"}
          : activeFilter === "completed"
            ? {status: "COMPLETED"}
            : activeFilter === "active"
              ? {status: {in: activeOrderStatuses}}
              : {}),
      },
      orderBy: {createdAt: "desc"},
      select: {
        id: true,
        orderNumber: true,
        serviceId: true,
        serviceLabel: true,
        selection: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.order.groupBy({
      by: ["status"],
      where: {userId: session.user.id},
      _count: {_all: true},
    }),
  ]);

  const statusCounts = new Map(
    groupedStatuses.map((item) => [item.status, item._count._all]),
  );
  const attentionCount = statusCounts.get("WAITING_FOR_CUSTOMER") ?? 0;
  const inProgressCount =
    (statusCounts.get("PENDING_CONFIRMATION") ?? 0) +
    (statusCounts.get("PROCESSING") ?? 0) +
    (statusCounts.get("UNDER_REVIEW") ?? 0);
  const completedCount = statusCounts.get("COMPLETED") ?? 0;

  return (
    <section className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">服务中心</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">我的服务</h1>
          <p className="mt-2 text-muted-foreground">
            查看申请进度、待办事项与服务记录。
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/#services" />}>
          浏览服务
          <ArrowRight />
        </Button>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Card variant="outline" className={attentionCount ? "border-foreground/20" : undefined}>
          <CardContent className="flex items-start justify-between gap-4 p-5">
            <div>
              <p className="text-sm font-medium">待我处理</p>
              <p className="mt-1 text-xs text-muted-foreground">需要查看或补充材料</p>
            </div>
            <span className="text-2xl font-semibold tabular-nums">{attentionCount}</span>
          </CardContent>
        </Card>
        <Card variant="outline">
          <CardContent className="flex items-start justify-between gap-4 p-5">
            <div>
              <p className="text-sm font-medium">办理中</p>
              <p className="mt-1 text-xs text-muted-foreground">顾问或平台正在处理</p>
            </div>
            <span className="text-2xl font-semibold tabular-nums">{inProgressCount}</span>
          </CardContent>
        </Card>
        <Card variant="outline">
          <CardContent className="flex items-start justify-between gap-4 p-5">
            <div>
              <p className="text-sm font-medium">已完成</p>
              <p className="mt-1 text-xs text-muted-foreground">已结束的服务申请</p>
            </div>
            <span className="text-2xl font-semibold tabular-nums">{completedCount}</span>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {orderFilters.map((filter) => (
          <Button
            key={filter.id}
            size="sm"
            variant={activeFilter === filter.id ? "default" : "outline"}
            nativeButton={false}
            render={<Link href={filter.href} />}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {orders.length === 0 ? (
        <Card className="mt-6" variant="outline">
          <CardContent className="flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <PackageOpen className="size-5 text-muted-foreground" />
            </div>
            <h2 className="mt-4 text-lg font-medium">
              {activeFilter === "cancelled"
                ? "暂无已取消订单"
                : activeFilter === "completed"
                  ? "暂无已完成服务"
                  : "暂时没有进行中的服务"}
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              {activeFilter === "cancelled"
                ? "您取消的订单会在这里保留记录。"
                : "选择所需服务并提交申请后，您可以在这里查看进度。"}
            </p>
            {activeFilter !== "cancelled" && (
              <Button
                className="mt-5"
                nativeButton={false}
                render={<Link href="/#services" />}
              >
                浏览服务
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((order) => (
            <Card key={order.id} variant="outline" className="overflow-hidden">
              <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">
                      {getOrderDisplayTitle(
                        order.serviceId,
                        order.serviceLabel,
                        order.selection,
                      )}
                    </p>
                    <Badge variant="secondary">
                      {orderStatusMeta[order.status].label}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {orderStatusMeta[order.status].nextStep}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>订单号：{order.orderNumber}</span>
                    <span>{order.createdAt.toLocaleDateString("zh-CN")}</span>
                  </div>
                </div>
                <Button
                  className="shrink-0"
                  nativeButton={false}
                  render={<Link href={`/account/orders/${order.orderNumber}`} />}
                >
                  {getOrderAction(order.status)}
                  <ArrowRight />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {attentionCount > 0 && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
          <ClipboardList className="mt-0.5 size-4 shrink-0 text-foreground" />
          <p>
            您有 {attentionCount} 个订单需要处理。请进入对应订单查看材料要求和顾问说明。
          </p>
        </div>
      )}
    </section>
  );
}
