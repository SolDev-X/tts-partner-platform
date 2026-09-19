import {AdminOrdersTable} from "@/components/orders/admin/orders-table";
import {orderStatusMeta} from "@/lib/order-status";
import {prisma} from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const tableData = orders.map((order) => ({
    id: order.id,
    orderInfo: order.serviceLabel,
    orderId: order.orderNumber,
    customer: order.user.name ?? order.user.email,
    status: order.status,
    currentStatus: orderStatusMeta[order.status].label,
    amount: order.amountInCents
      ? `${(order.amountInCents / 100).toFixed(2)} ${order.currency}`
      : "-",
    createdAt: order.createdAt.toLocaleDateString("zh-CN"),
    updatedAt: order.updatedAt.toLocaleDateString("zh-CN"),
  }));

  return (
    <div className="@container/main flex flex-1 flex-col gap-2 py-4 md:gap-6 md:py-6">
      <AdminOrdersTable data={tableData} />
    </div>
  );
}
