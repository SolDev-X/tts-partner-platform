import {NextResponse} from "next/server";
import {z} from "zod";

import {auth} from "@/lib/auth";
import {logProgressEvent} from "@/lib/order-progress";
import {prisma} from "@/lib/prisma";

const deliverySchema = z.object({
  deliveryDescription: z.string().trim().max(2000),
  deliveryInvitationCode: z.string().trim().max(100),
  deliveryStoreNumber: z.string().trim().max(100),
  deliveryFileName: z.string().trim().max(200),
  deliveryVisibleAfterPayment: z.boolean(),
  confirm: z.boolean().optional(),
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

  const body = deliverySchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({error: "交付信息格式不正确。"}, {status: 400});
  }

  const {orderNumber} = await params;
  const order = await prisma.order.findUnique({
    where: {orderNumber},
    select: {id: true, status: true, deliveryCompletedAt: true},
  });
  if (!order) {
    return NextResponse.json({error: "Order not found"}, {status: 404});
  }

  if (order.status === "COMPLETED" && body.data.confirm) {
    return NextResponse.json({error: "订单已完成交付。"}, {status: 409});
  }

  const now = new Date();
  const shouldConfirm = body.data.confirm === true;

  await prisma.order.update({
    where: {orderNumber},
    data: {
      deliveryDescription: body.data.deliveryDescription || null,
      deliveryInvitationCode: body.data.deliveryInvitationCode || null,
      deliveryStoreNumber: body.data.deliveryStoreNumber || null,
      deliveryFileName: body.data.deliveryFileName || null,
      deliveryVisibleAfterPayment: body.data.deliveryVisibleAfterPayment,
      ...(shouldConfirm
        ? {
            status: "COMPLETED",
            deliveryCompletedAt: order.deliveryCompletedAt ?? now,
          }
        : {}),
    },
  });

  if (shouldConfirm) {
    await logProgressEvent(
      prisma,
      order.id,
      "COMPLETED",
      body.data.deliveryDescription || "服务已交付完成。",
    );
  }

  return NextResponse.json({status: true});
}
