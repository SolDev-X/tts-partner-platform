import type {Metadata} from "next";
import {headers} from "next/headers";
import Link from "next/link";
import {redirect} from "next/navigation";
import {ArrowRight, ClipboardList, PackageOpen} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {auth} from "@/lib/auth";
import type {
  DeliveryStatus,
  MaterialStatus,
  OrderStatus,
  PaymentStatus,
  Prisma,
} from "@/lib/generated/prisma";
import {getOrderDisplayTitle} from "@/lib/order-display";
import {prisma} from "@/lib/prisma";

export const metadata: Metadata = {
  title: "我的订单 | 跨境服务平台",
  description: "查看您的跨境服务订单和办理进度。",
};

const workingOrderStatuses: OrderStatus[] = [
  "PENDING_CONFIRMATION",
  "PROCESSING",
  "REFUNDING",
];

const orderFilters = [
  {id: "all", label: "全部", href: "/account/orders?status=all"},
  {
    id: "attention",
    label: "待我处理",
    href: "/account/orders?status=attention",
  },
  {id: "active", label: "办理中", href: "/account/orders?status=active"},
  {id: "completed", label: "已完成", href: "/account/orders?status=completed"},
  {id: "cancelled", label: "已取消", href: "/account/orders?status=cancelled"},
] as const;

type OrderFilter = (typeof orderFilters)[number]["id"];

type OrderListItem = {
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  materials: Array<{status: MaterialStatus}>;
};

type CustomerOrderView = {
  label: string;
  nextStep: string;
  action: string;
  badgeClassName: string;
};

const attentionWhere: Prisma.OrderWhereInput = {
  OR: [
    {status: {in: ["PENDING_PAYMENT", "WAITING_FOR_CUSTOMER"]}},
    {deliveryStatus: "PUBLISHED"},
  ],
};

function getStatusWhere(filter: OrderFilter): Prisma.OrderWhereInput {
  if (filter === "all") return {};
  if (filter === "attention") return attentionWhere;
  if (filter === "active") {
    return {
      status: {in: workingOrderStatuses},
      NOT: {deliveryStatus: "PUBLISHED"},
    };
  }
  if (filter === "completed") return {status: "COMPLETED"};
  if (filter === "cancelled") return {status: {in: ["CANCELLED", "REFUNDED"]}};
  return {};
}

function getCustomerOrderView(order: OrderListItem): CustomerOrderView {
  if (order.status === "PENDING_PAYMENT") {
    return {
      label: "待付款",
      nextStep: "请完成订单支付，付款成功后平台将确认材料并开始办理。",
      action: "前往付款",
      badgeClassName: "border-amber-200 bg-amber-50 text-amber-800",
    };
  }

  if (order.status === "WAITING_FOR_CUSTOMER") {
    const needsRevision = order.materials.some(
      (material) => material.status === "NEEDS_REVISION",
    );

    return {
      label: needsRevision ? "待修改材料" : "待补充材料",
      nextStep: needsRevision
        ? "顾问已反馈材料问题，请进入订单查看并重新提交。"
        : "请根据顾问说明补充所需材料，以便继续办理。",
      action: "处理材料",
      badgeClassName: "border-orange-200 bg-orange-50 text-orange-800",
    };
  }

  if (order.deliveryStatus === "PUBLISHED") {
    return {
      label: "待确认交付",
      nextStep: "交付内容已发布，请核对结果并确认是否需要修改。",
      action: "确认交付",
      badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-800",
    };
  }

  if (order.status === "PENDING_CONFIRMATION") {
    return {
      label: "待平台确认",
      nextStep: "我们将在 1 个工作日内确认材料要求与后续安排。",
      action: "查看进度",
      badgeClassName: "border-sky-200 bg-sky-50 text-sky-800",
    };
  }

  if (order.status === "REFUNDING") {
    return {
      label: "退款中",
      nextStep: "退款申请正在处理，到账时间以支付渠道为准。",
      action: "查看详情",
      badgeClassName: "border-violet-200 bg-violet-50 text-violet-800",
    };
  }

  if (order.status === "COMPLETED") {
    return {
      label: "已完成",
      nextStep: "本订单已完成。如有后续问题，请通过联系我们获取协助。",
      action: "查看详情",
      badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-800",
    };
  }

  if (order.status === "CANCELLED") {
    return {
      label: "已取消",
      nextStep: "本订单已取消。如需重新办理，请重新选择服务方案。",
      action: "查看记录",
      badgeClassName: "border-slate-200 bg-slate-100 text-slate-600",
    };
  }

  if (order.status === "REFUNDED") {
    return {
      label: "已退款",
      nextStep: "本订单已完成退款，如有疑问请联系我们。",
      action: "查看记录",
      badgeClassName: "border-slate-200 bg-slate-100 text-slate-600",
    };
  }

  if (order.deliveryStatus === "REVISION_REQUESTED") {
    return {
      label: "修改处理中",
      nextStep: "顾问正在根据您的修改意见调整交付内容。",
      action: "查看进度",
      badgeClassName: "border-blue-200 bg-blue-50 text-blue-800",
    };
  }

  return {
    label: order.paymentStatus === "PAID" ? "办理中" : "处理中",
    nextStep: "顾问正在推进您的服务申请，请留意后续通知。",
    action: "查看进度",
    badgeClassName: "border-blue-200 bg-blue-50 text-blue-800",
  };
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{status?: string}>;
}) {
  const session = await auth.api.getSession({headers: await headers()});
  if (!session) redirect("/login");

  const {status} = await searchParams;
  const activeFilter = orderFilters.some((filter) => filter.id === status)
    ? (status as OrderFilter)
    : "all";

  const where: Prisma.OrderWhereInput = {
    userId: session.user.id,
    ...getStatusWhere(activeFilter),
  };

  const [orders, attentionCount, inProgressCount, completedCount] =
    await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: {createdAt: "desc"},
        select: {
          id: true,
          orderNumber: true,
          serviceId: true,
          serviceLabel: true,
          selection: true,
          status: true,
          paymentStatus: true,
          deliveryStatus: true,
          createdAt: true,
          materials: {select: {status: true}},
        },
      }),
      prisma.order.count({where: {userId: session.user.id, ...attentionWhere}}),
      prisma.order.count({
        where: {
          userId: session.user.id,
          status: {in: workingOrderStatuses},
          NOT: {deliveryStatus: "PUBLISHED"},
        },
      }),
      prisma.order.count({
        where: {userId: session.user.id, status: "COMPLETED"},
      }),
    ]);

  return (
    <section className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">我的订单</h1>
      </div>

      {attentionCount > 0 && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-destructive/45 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          <ClipboardList className="mt-0.5 size-4 shrink-0" />
          <p className="text-xs">
            您有 {attentionCount}{" "}
            个订单需要处理。请进入对应订单完成付款、补充材料或确认交付。
          </p>
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Card
          variant="outline"
          className={attentionCount ? "border-foreground/20" : undefined}
        >
          <CardContent className="flex items-start justify-between gap-4 p-5">
            <div>
              <p className="text-sm font-medium">待我处理</p>
              <p className="mt-1 text-xs text-muted-foreground">
                待付款、补材料或确认交付
              </p>
            </div>
            <span className="text-2xl font-semibold tabular-nums">
              {attentionCount}
            </span>
          </CardContent>
        </Card>
        <Card variant="outline">
          <CardContent className="flex items-start justify-between gap-4 p-5">
            <div>
              <p className="text-sm font-medium">办理中</p>
              <p className="mt-1 text-xs text-muted-foreground">
                平台正在推进的订单
              </p>
            </div>
            <span className="text-2xl font-semibold tabular-nums">
              {inProgressCount}
            </span>
          </CardContent>
        </Card>
        <Card variant="outline">
          <CardContent className="flex items-start justify-between gap-4 p-5">
            <div>
              <p className="text-sm font-medium">已完成</p>
              <p className="mt-1 text-xs text-muted-foreground">
                已结束的服务申请
              </p>
            </div>
            <span className="text-2xl font-semibold tabular-nums">
              {completedCount}
            </span>
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
                  : activeFilter === "attention"
                    ? "当前没有需要您处理的订单"
                    : activeFilter === "active"
                      ? "暂无办理中的订单"
                      : "暂时没有订单"}
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              {activeFilter === "cancelled"
                ? "您取消的订单会在这里保留记录。"
                : activeFilter === "attention"
                  ? "需要付款、补材料或确认交付的订单会显示在这里。"
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
          {orders.map((order) => {
            const orderView = getCustomerOrderView(order);

            return (
              <Card
                key={order.id}
                variant="outline"
                className="overflow-hidden"
              >
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
                      <Badge
                        variant="outline"
                        className={orderView.badgeClassName}
                      >
                        {orderView.label}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {orderView.nextStep}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>订单号：{order.orderNumber}</span>
                      <span>{order.createdAt.toLocaleDateString("zh-CN")}</span>
                    </div>
                  </div>
                  <Button
                    className="shrink-0"
                    nativeButton={false}
                    render={
                      <Link href={`/account/orders/${order.orderNumber}`} />
                    }
                  >
                    {orderView.action}
                    <ArrowRight />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
