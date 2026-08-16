import {headers} from "next/headers";
import {redirect} from "next/navigation";

import {DataTable} from "@/components/orders/customer/orders-table";
import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

function getOrderStatusLabel(status: string) {
  switch (status) {
    case "PENDING_CONFIRMATION":
      return "待确认";
    case "PENDING_PAYMENT":
      return "待付款";
    case "WAITING_FOR_CUSTOMER":
      return "待补资料";
    case "PROCESSING":
      return "办理中";
    case "COMPLETED":
      return "已完成";
    case "CANCELLED":
      return "已取消";
    default:
      return status;
  }
}

export default async function OrdersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const tableData = orders.map((order) => ({
    id: order.id,
    orderInfo: order.serviceLabel,
    orderId: order.orderNumber,
    currentStatus: getOrderStatusLabel(order.status),
    amount: order.amountInCents
      ? `${(order.amountInCents / 100).toFixed(2)} ${order.currency}`
      : "-",
    createdAt: order.createdAt.toLocaleDateString("zh-CN"),
    updatedAt: order.updatedAt.toLocaleDateString("zh-CN"),
  }));

  return (
    <div className="@container/main flex flex-1 flex-col gap-2 py-4 md:gap-6 md:py-6">
      <DataTable data={tableData} />
    </div>
  );
}
