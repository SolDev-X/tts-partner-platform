import type {Metadata} from "next";
import {headers} from "next/headers";
import Link from "next/link";
import {redirect} from "next/navigation";
import {PackageOpen} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export const metadata: Metadata = {
  title: "我的订单 | 跨境服务平台",
  description: "查看您的跨境服务订单和办理进度。",
};

export default async function OrdersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: {userId: session.user.id},
    orderBy: {createdAt: "desc"},
    select: {
      id: true,
      orderNumber: true,
      serviceLabel: true,
      status: true,
      createdAt: true,
    },
  });

  const statusLabels = {
    PENDING_CONFIRMATION: "待确认",
    PROCESSING: "处理中",
    WAITING_FOR_CUSTOMER: "待补充材料",
    UNDER_REVIEW: "审核中",
    COMPLETED: "已完成",
    CANCELLED: "已取消",
  };

  return (
    <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">我的订单</h1>
        <p className="mt-2 text-muted-foreground">
          查看您的服务订单、付款状态和办理进度。
        </p>
      </div>

      {orders.length === 0 ? (
      <Card className="mt-8" variant="outline">
        <CardContent className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <PackageOpen className="size-5 text-muted-foreground" />
          </div>
          <h2 className="mt-5 text-lg font-medium">暂无订单</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            您提交或购买的服务订单将在这里显示。
          </p>
          <Button
            className="mt-6"
            nativeButton={false}
            render={<Link href="/#services" />}
          >
            浏览服务
          </Button>
        </CardContent>
      </Card>
      ) : (
        <div className="mt-8 space-y-3">
          {orders.map((order) => (
            <Card key={order.id} variant="outline">
              <CardContent className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{order.serviceLabel}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    订单号：{order.orderNumber}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground sm:text-right">
                  <p className="font-medium text-foreground">
                    {statusLabels[order.status]}
                  </p>
                  <p className="mt-1">
                    {order.createdAt.toLocaleDateString("zh-CN")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
