import {NextResponse} from "next/server";
import {z} from "zod";

import {auth} from "@/lib/auth";
import {logProgressEvent} from "@/lib/order-progress";
import {prisma} from "@/lib/prisma";

const actionSchema = z.object({
  action: z.enum(["confirm", "request_revision"]),
  revisionNote: z.string().trim().max(1000).optional().default(""),
});

export async function PATCH(request: Request, {params}: {params: Promise<{orderNumber: string}>}) {
  const session = await auth.api.getSession({headers: request.headers});
  if (!session) return NextResponse.json({error: "Unauthorized"}, {status: 401});
  if (session.user.role !== "CUSTOMER") return NextResponse.json({error: "Forbidden"}, {status: 403});

  const body = actionSchema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({error: "请求格式不正确。"}, {status: 400});
  if (body.data.action === "request_revision" && !body.data.revisionNote) return NextResponse.json({error: "请填写需要修改的内容。"}, {status: 400});

  const {orderNumber} = await params;
  const order = await prisma.order.findFirst({where: {orderNumber, userId: session.user.id}, select: {id: true, deliveryStatus: true}});
  if (!order) return NextResponse.json({error: "Order not found"}, {status: 404});
  if (order.deliveryStatus !== "PUBLISHED") return NextResponse.json({error: "当前交付内容不能执行此操作。"}, {status: 409});

  const now = new Date();
  await prisma.$transaction(async (tx) => {
    if (body.data.action === "confirm") {
      await tx.order.update({where: {id: order.id}, data: {deliveryStatus: "CONFIRMED", deliveryConfirmedAt: now, deliveryCompletedAt: now, status: "COMPLETED"}});
      await tx.orderDeliveryEvent.create({data: {orderId: order.id, type: "CONFIRMED"}});
      await logProgressEvent(tx, order.id, "COMPLETED", "客户已确认服务交付。");
    } else {
      await tx.order.update({where: {id: order.id}, data: {deliveryStatus: "REVISION_REQUESTED", deliveryRevisionNote: body.data.revisionNote, status: "PROCESSING"}});
      await tx.orderDeliveryEvent.create({data: {orderId: order.id, type: "REVISION_REQUESTED", note: body.data.revisionNote}});
    }
  });

  return NextResponse.json({status: true});
}
