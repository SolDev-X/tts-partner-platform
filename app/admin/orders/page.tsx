import type {Metadata} from "next";
import {headers} from "next/headers";
import Link from "next/link";
import {redirect} from "next/navigation";
import {ArrowUpRight, ClipboardList, Search} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {auth} from "@/lib/auth";
import type {OrderStatus, Prisma} from "@/lib/generated/prisma";
import {getOrderDisplayTitle} from "@/lib/order-display";
import {orderStatusMeta} from "@/lib/order-status";
import {prisma} from "@/lib/prisma";

export const metadata: Metadata = {
  title: "订单管理 | 跨境服务平台",
  description: "管理客户服务订单和办理进度。",
};

const activeOrderStatuses: OrderStatus[] = [
  "PENDING_CONFIRMATION",
  "PROCESSING",
  "WAITING_FOR_CUSTOMER",
  "UNDER_REVIEW",
];

const orderFilters = [
  {id: "all", label: "全部"},
  {id: "active", label: "进行中"},
  {id: "completed", label: "已完成"},
  {id: "cancelled", label: "已取消"},
] as const;

type OrderFilter = (typeof orderFilters)[number]["id"];

type SummaryStatus =
  | "PENDING_CONFIRMATION"
  | "PROCESSING"
  | "WAITING_FOR_CUSTOMER"
  | "UNDER_REVIEW";

const summaryCards: Array<{
  status: SummaryStatus;
  label: string;
  description: string;
}> = [
  {
    status: "PENDING_CONFIRMATION",
    label: "待确认",
    description: "等待首次确认的订单",
  },
  {status: "PROCESSING", label: "处理中", description: "正在推进的服务"},
  {
    status: "WAITING_FOR_CUSTOMER",
    label: "待补材料",
    description: "等待客户补充材料",
  },
  {status: "UNDER_REVIEW", label: "审核中", description: "平台审核中的订单"},
];

function getFilterHref(filter: OrderFilter, query: string) {
  const params = new URLSearchParams();

  if (filter !== "active") params.set("status", filter);
  if (query) params.set("q", query);

  const search = params.toString();
  return `/admin/orders${search ? `?${search}` : ""}`;
}

function getStatusWhere(filter: OrderFilter): Prisma.OrderWhereInput {
  if (filter === "all") return {};
  if (filter === "active") return {status: {in: activeOrderStatuses}};
  if (filter === "completed") return {status: "COMPLETED"};
  if (filter === "cancelled") return {status: "CANCELLED"};
  return {};
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{status?: string; q?: string}>;
}) {
  const session = await auth.api.getSession({headers: await headers()});
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const {status, q} = await searchParams;
  const query = q?.trim() ?? "";
  const activeFilter = orderFilters.some((filter) => filter.id === status)
    ? (status as OrderFilter)
    : "active";

  const where: Prisma.OrderWhereInput = {
    ...getStatusWhere(activeFilter),
    ...(query
      ? {
          OR: [
            {orderNumber: {contains: query, mode: "insensitive"}},
            {
              user: {
                is: {
                  OR: [
                    {name: {contains: query, mode: "insensitive"}},
                    {email: {contains: query, mode: "insensitive"}},
                  ],
                },
              },
            },
          ],
        }
      : {}),
  };

  const [orders, groupedStatuses] = await Promise.all([
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
        createdAt: true,
        user: {select: {name: true, email: true}},
      },
    }),
    prisma.order.groupBy({by: ["status"], _count: {_all: true}}),
  ]);

  const statusCounts = new Map(
    groupedStatuses.map((item) => [item.status, item._count._all]),
  );

  return (
    <section className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">业务工作台</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">订单管理</h1>
          <p className="mt-2 text-muted-foreground">
            集中处理客户申请、材料补充与办理进度。
          </p>
        </div>
        <p className="text-sm text-muted-foreground">共 {orders.length} 个匹配订单</p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((item) => (
          <Card
            key={item.status}
            variant="outline"
            className="h-full"
          >
            <CardContent className="flex items-start justify-between gap-4 p-5">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <span className="text-2xl font-semibold tabular-nums">
                {statusCounts.get(item.status) ?? 0}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 rounded-xl border bg-card p-3 sm:p-4">
        <form className="flex flex-col gap-3 sm:flex-row" action="/admin/orders">
          {activeFilter !== "active" && (
            <input type="hidden" name="status" value={activeFilter} />
          )}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={query}
              className="h-9 pl-9"
              placeholder="搜索订单号、客户名称或邮箱"
              aria-label="搜索订单"
            />
          </div>
          <Button type="submit" className="h-9">
            搜索订单
          </Button>
          {query && (
            <Button
              variant="ghost"
              className="h-9"
              nativeButton={false}
              render={<Link href={getFilterHref(activeFilter, "")} />}
            >
              清除
            </Button>
          )}
        </form>

        <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
          {orderFilters.map((filter) => (
            <Button
              key={filter.id}
              size="sm"
              variant={activeFilter === filter.id ? "default" : "outline"}
              nativeButton={false}
              render={<Link href={getFilterHref(filter.id, query)} />}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <Card className="mt-6" variant="outline">
          <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <ClipboardList className="size-5 text-muted-foreground" />
            </div>
            <h2 className="mt-4 text-lg font-medium">没有匹配的订单</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              请调整筛选条件，或使用订单号、客户名称、邮箱进行搜索。
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mt-6 hidden overflow-hidden rounded-xl border md:block">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">订单</th>
                  <th className="px-5 py-3 font-medium">客户</th>
                  <th className="px-5 py-3 font-medium">状态</th>
                  <th className="px-5 py-3 font-medium">创建时间</th>
                  <th className="px-5 py-3 text-right font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/orders/${order.orderNumber}`}
                        className="font-medium hover:underline"
                      >
                        {getOrderDisplayTitle(
                          order.serviceId,
                          order.serviceLabel,
                          order.selection,
                        )}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {order.orderNumber}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p>{order.user.name || "未设置名称"}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {order.user.email}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className={orderStatusMeta[order.status].badgeClassName}
                      >
                        {orderStatusMeta[order.status].label}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {order.createdAt.toLocaleDateString("zh-CN")}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/admin/orders/${order.orderNumber}`} />}
                      >
                        查看
                        <ArrowUpRight />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-3 md:hidden">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.orderNumber}`}
                className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Card variant="outline" className="transition-colors hover:bg-muted/40">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">
                        {getOrderDisplayTitle(
                          order.serviceId,
                          order.serviceLabel,
                          order.selection,
                        )}
                      </p>
                      <Badge
                        variant="outline"
                        className={`shrink-0 ${orderStatusMeta[order.status].badgeClassName}`}
                      >
                        {orderStatusMeta[order.status].label}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {order.user.name || order.user.email}
                    </p>
                    <div className="mt-1 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span className="truncate">{order.orderNumber}</span>
                      <span className="shrink-0">
                        {order.createdAt.toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
