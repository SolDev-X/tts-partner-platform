import type {Metadata} from "next";
import {headers} from "next/headers";
import Link from "next/link";
import {redirect} from "next/navigation";
import {PackageOpen} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {auth} from "@/lib/auth";
import {getOrderDisplayTitle} from "@/lib/order-display";
import {orderStatusMeta} from "@/lib/order-status";
import {prisma} from "@/lib/prisma";
import type {OrderStatus} from "@/lib/generated/prisma";

export const metadata: Metadata = {
  title: "我的订单 | 跨境服务平台",
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
  {id: "cancelled", label: "已取消", href: "/account/orders?status=cancelled"},
] as const;

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{status?: string}>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const {status} = await searchParams;
  const activeFilter = status === "all" || status === "cancelled" ? status : "active";

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
      ...(activeFilter === "cancelled"
        ? {status: "CANCELLED"}
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
  });

  return (
    <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">我的订单</h1>
        <p className="mt-2 text-muted-foreground">
          查看您的服务订单、订单状态和办理进度。
        </p>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
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
        <Card className="mt-8" variant="outline">
          <CardContent className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <PackageOpen className="size-5 text-muted-foreground" />
            </div>
            <h2 className="mt-5 text-lg font-medium">
              {activeFilter === "cancelled" ? "暂无已取消订单" : "暂无订单"}
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              {activeFilter === "cancelled"
                ? "您取消的订单会在这里保留记录。"
                : "您提交或购买的服务订单将在这里显示。"}
            </p>
            {activeFilter !== "cancelled" && (
              <Button
                className="mt-6"
                nativeButton={false}
                render={<Link href="/#services" />}
              >
                浏览服务
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.orderNumber}`}
              className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card
                variant="outline"
                className="transition-colors hover:bg-muted/40"
              >
                <CardContent className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">
                      {getOrderDisplayTitle(
                        order.serviceId,
                        order.serviceLabel,
                        order.selection,
                      )}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {order.serviceLabel} · 订单号：{order.orderNumber}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground sm:text-right">
                    <p className="font-medium text-foreground">
                      {orderStatusMeta[order.status].label}
                    </p>
                    <p className="mt-1">
                      {order.createdAt.toLocaleDateString("zh-CN")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
