import {NextResponse} from "next/server";
import {z} from "zod";

import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

const orderStatusSchema = z.enum([
  "PENDING_PAYMENT",
  "PENDING_CONFIRMATION",
  "WAITING_FOR_CUSTOMER",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
  "REFUNDING",
  "REFUNDED",
]);

const updateOrderSchema = z.object({
  status: orderStatusSchema,
  customerMessage: z.string().trim().max(1000),
  adminNote: z.string().trim().max(1000),
});

export async function PATCH(
  request: Request,
  {params}: {params: Promise<{orderNumber: string}>},
) {
  const session = await auth.api.getSession({headers: request.headers});
  if (!session) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({error: "Forbidden"}, {status: 403});
  }

  const body = updateOrderSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({error: "Invalid order update"}, {status: 400});
  }

  const {orderNumber} = await params;
  const result = await prisma.order.updateMany({
    where: {orderNumber},
    data: {
      status: body.data.status,
      customerMessage: body.data.customerMessage || null,
      adminNote: body.data.adminNote || null,
    },
  });

  if (result.count === 0) {
    return NextResponse.json({error: "Order not found"}, {status: 404});
  }

  return NextResponse.json({status: true});
}
