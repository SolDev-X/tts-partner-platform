import type {Metadata} from "next";
import {headers} from "next/headers";
import Link from "next/link";
import {notFound, redirect} from "next/navigation";

import {OrderEditor} from "@/components/admin/order-editor";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {auth} from "@/lib/auth";
import {services} from "@/lib/data";
import {getOrderDisplayTitle, isStringSelection} from "@/lib/order-display";
import {orderStatusMeta} from "@/lib/order-status";
import {prisma} from "@/lib/prisma";

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
      orderNumber: true,
      serviceId: true,
      serviceLabel: true,
      selection: true,
      status: true,
      customerMessage: true,
      adminNote: true,
      createdAt: true,
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

  return (
    <section className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
      <Button variant="ghost" className="-ml-3" nativeButton={false} render={<Link href="/admin/orders" />}>
        返回订单管理
      </Button>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {getOrderDisplayTitle(order.serviceId, order.serviceLabel, order.selection)}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {order.serviceLabel} · 订单号：{order.orderNumber}
          </p>
        </div>
        <Badge
          variant="outline"
          className={orderStatusMeta[order.status].badgeClassName}
        >
          {orderStatusMeta[order.status].label}
        </Badge>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Card variant="outline">
            <CardContent className="p-5">
              <h2 className="font-semibold">客户信息</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">账户</dt><dd>{order.user.name || "未设置名称"}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">邮箱</dt><dd>{order.user.email}</dd></div>
                {order.user.phoneNumber && <div className="flex justify-between gap-4"><dt className="text-muted-foreground">手机号</dt><dd>{order.user.phoneNumber}</dd></div>}
              </dl>
            </CardContent>
          </Card>

          <Card variant="outline">
            <CardContent className="p-5">
              <h2 className="font-semibold">客户所选方案</h2>
              <dl className="mt-4 divide-y">
                {selectedOptions.map((item) => (
                  <div key={item.title} className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:justify-between">
                    <dt className="text-muted-foreground">{item.title}</dt>
                    <dd className="font-medium">{item.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm text-muted-foreground">
                创建时间：{order.createdAt.toLocaleString("zh-CN")}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card variant="outline" className="h-fit">
          <CardContent className="p-5">
            <h2 className="mb-5 font-semibold">处理订单</h2>
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
