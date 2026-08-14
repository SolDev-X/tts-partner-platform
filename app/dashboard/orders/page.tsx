import {headers} from "next/headers";
import Link from "next/link";
import {redirect} from "next/navigation";

import {ArrowUpRight, ClipboardList} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";

import {auth} from "@/lib/auth";
import type {OrderStatus, Prisma} from "@/lib/generated/prisma";
import {getOrderDisplayTitle} from "@/lib/order-display";
import {orderStatusMeta} from "@/lib/order-status";
import {prisma} from "@/lib/prisma";

type OrderView =
  | "all"
  | "action-required"
  | "processing"
  | "completed"
  | "cancelled";

const views: Record<
  OrderView,
  {
    title: string;
    description: string;
  }
> = {
  all: {
    title: "全部订单",
    description: "查看你的全部服务订单。",
  },

  "action-required": {
    title: "待我处理",
    description: "需要你付款、补充材料或完成其他操作的订单。",
  },

  processing: {
    title: "办理中",
    description: "当前正在办理中的服务订单。",
  },

  completed: {
    title: "已完成",
    description: "已经完成交付的服务订单。",
  },

  cancelled: {
    title: "已取消",
    description: "已经取消的服务订单。",
  },
};

function getStatusWhere(view: OrderView): Prisma.OrderWhereInput {
  switch (view) {
    case "action-required":
      return {
        status: {
          in: ["PENDING_PAYMENT", "WAITING_FOR_CUSTOMER"],
        },
      };

    case "processing":
      return {
        status: {
          in: ["PENDING_CONFIRMATION", "PROCESSING", "REFUNDING"],
        },
      };

    case "completed":
      return {
        status: "COMPLETED",
      };

    case "cancelled":
      return {
        status: "CANCELLED",
      };

    default:
      return {};
  }
}

function getProgressLabel(status: OrderStatus) {
  switch (status) {
    case "PENDING_PAYMENT":
      return "等待你完成付款";
    case "PENDING_CONFIRMATION":
      return "等待订单确认";
    case "WAITING_FOR_CUSTOMER":
      return "等待你补充材料";
    case "PROCESSING":
      return "服务正在办理中";
    case "REFUNDING":
      return "退款处理中";
    case "COMPLETED":
      return "服务已完成交付";
    case "CANCELLED":
      return "订单已取消";
    default:
      return "查看订单详情";
  }
}

function formatAmount(amountInCents: number | null) {
  if (amountInCents == null) return "—";

  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(amountInCents / 100);
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    view?: string;
  }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const {view} = await searchParams;

  const activeView: OrderView =
    view && view in views ? (view as OrderView) : "all";

  const orders = await prisma.order.findMany({
    where: {
      user: {
        is: {
          id: session.user.id,
        },
      },

      ...getStatusWhere(activeView),
    },

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      orderNumber: true,
      serviceId: true,
      serviceLabel: true,
      selection: true,
      status: true,
      amountInCents: true,
      createdAt: true,
    },
  });

  const currentView = views[activeView];

  return (
    <section className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-1 flex-col ">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {currentView.title}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {currentView.description}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between sm:mt-8">
          <p className="text-sm font-medium">订单</p>

          <p className="text-sm text-muted-foreground">共 {orders.length} 个</p>
        </div>

        {orders.length === 0 ? (
          <Card variant="outline" className="mt-4">
            <CardContent className="flex min-h-56 flex-col items-center justify-center px-4 text-center sm:min-h-72">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <ClipboardList className="size-5 text-muted-foreground" />
              </div>

              <h2 className="mt-4 font-medium">暂无订单</h2>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                当前分类下还没有订单。
              </p>

              <Button
                className="mt-5"
                variant="outline"
                nativeButton={false}
                render={<Link href="/services" />}
              >
                浏览服务
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* 平板 / 桌面：同一张表格，根据断点逐步增加信息列 */}
            <div className="mt-4 hidden overflow-hidden rounded-xl border bg-background md:block">
              <table className="w-full table-fixed text-sm">
                <thead className="border-b bg-muted/30 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="w-[42%] px-4 py-3 font-medium lg:w-[30%] lg:px-5 xl:w-[28%]">
                      订单 / 服务
                    </th>

                    <th className="w-[18%] px-3 py-3 font-medium lg:w-[14%] lg:px-5 xl:w-[12%]">
                      状态
                    </th>

                    <th className="hidden w-[24%] px-5 py-3 font-medium lg:table-cell xl:w-[20%]">
                      当前进度
                    </th>

                    <th className="hidden w-[14%] px-5 py-3 font-medium xl:table-cell">
                      金额
                    </th>

                    <th className="w-[24%] px-3 py-3 font-medium lg:w-[18%] lg:px-5 xl:w-[16%]">
                      下单时间
                    </th>

                    <th className="w-[16%] px-3 py-3 text-right font-medium lg:w-[14%] lg:px-5 xl:w-[10%]">
                      操作
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="min-w-0 px-4 py-4 align-middle lg:px-5">
                        <Link
                          href={`/dashboard/orders/${order.orderNumber}`}
                          className="block truncate font-medium text-foreground hover:underline"
                          title={getOrderDisplayTitle(
                            order.serviceId,
                            order.serviceLabel,
                            order.selection,
                          )}
                        >
                          {getOrderDisplayTitle(
                            order.serviceId,
                            order.serviceLabel,
                            order.selection,
                          )}
                        </Link>

                        <p className="mt-1 truncate text-xs tabular-nums text-muted-foreground">
                          {order.orderNumber}
                        </p>
                      </td>

                      <td className="px-3 py-4 align-middle lg:px-5">
                        <Badge
                          variant="outline"
                          className={`max-w-full shrink-0 whitespace-nowrap ${orderStatusMeta[order.status].badgeClassName}`}
                        >
                          {orderStatusMeta[order.status].label}
                        </Badge>
                      </td>

                      <td className="hidden px-5 py-4 align-middle text-muted-foreground lg:table-cell">
                        <span className="block truncate">
                          {getProgressLabel(order.status)}
                        </span>
                      </td>

                      <td className="hidden px-5 py-4 align-middle font-medium tabular-nums xl:table-cell">
                        {formatAmount(order.amountInCents)}
                      </td>

                      <td className="px-3 py-4 align-middle text-xs tabular-nums text-muted-foreground lg:px-5 lg:text-sm">
                        {order.createdAt.toLocaleDateString("zh-CN")}
                      </td>

                      <td className="px-3 py-4 text-right align-middle lg:px-5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="px-2 lg:px-3"
                          nativeButton={false}
                          render={
                            <Link
                              href={`/dashboard/orders/${order.orderNumber}`}
                              aria-label={`查看订单 ${order.orderNumber}`}
                            />
                          }
                        >
                          <span className="hidden lg:inline">查看</span>
                          <ArrowUpRight className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 移动端：紧凑订单卡片 */}
            <div className="mt-4 space-y-3 md:hidden">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.orderNumber}`}
                  className="block rounded-xl border bg-background p-4 transition-colors active:bg-muted/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium leading-5 text-foreground">
                        {getOrderDisplayTitle(
                          order.serviceId,
                          order.serviceLabel,
                          order.selection,
                        )}
                      </p>
                      <p className="mt-1 truncate text-xs tabular-nums text-muted-foreground">
                        {order.orderNumber}
                      </p>
                    </div>

                    <Badge
                      variant="outline"
                      className={`shrink-0 ${orderStatusMeta[order.status].badgeClassName}`}
                    >
                      {orderStatusMeta[order.status].label}
                    </Badge>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <span className="shrink-0 text-muted-foreground">
                        当前进度
                      </span>
                      <span className="text-right">
                        {getProgressLabel(order.status)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">订单金额</span>
                      <span className="font-medium tabular-nums">
                        {formatAmount(order.amountInCents)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">下单时间</span>
                      <span className="tabular-nums">
                        {order.createdAt.toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end border-t pt-3 text-sm font-medium">
                    查看详情
                    <ArrowUpRight className="ml-1 size-4" />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
