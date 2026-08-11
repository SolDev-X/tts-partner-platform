import {NextResponse} from "next/server";
import {z} from "zod";

import {auth} from "@/lib/auth";
import {logProgressEvent, statusToProgressStep} from "@/lib/order-progress";
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
  const current = await prisma.order.findUnique({
    where: {orderNumber},
    select: {id: true, status: true, customerMessage: true},
  });
  if (!current) {
    return NextResponse.json({error: "Order not found"}, {status: 404});
  }

  const statusChanged = current.status !== body.data.status;
  const messageChanged =
    (current.customerMessage ?? "") !== body.data.customerMessage;

  await prisma.order.update({
    where: {orderNumber},
    data: {
      status: body.data.status,
      customerMessage: body.data.customerMessage || null,
    },
  });

  if (statusChanged || messageChanged) {
    const step = statusToProgressStep(body.data.status);
    if (step && body.data.customerMessage) {
      await logProgressEvent(
        prisma,
        current.id,
        step,
        body.data.customerMessage,
      );
    }
  }

  return NextResponse.json({status: true});
}
