import {NextResponse} from "next/server";
import {z} from "zod";

import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

const deliverySchema = z.object({
  action: z.enum(["save", "publish"]),
  deliveryDescription: z.string().trim().max(2000),
  deliveryData: z.record(z.string(), z.string().trim().max(200)),
});

export async function PATCH(request: Request, {params}: {params: Promise<{orderNumber: string}>}) {
  const session = await auth.api.getSession({headers: request.headers});
  if (!session) return NextResponse.json({error: "Unauthorized"}, {status: 401});
  if (session.user.role !== "ADMIN") return NextResponse.json({error: "Forbidden"}, {status: 403});

  const body = deliverySchema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({error: "交付信息格式不正确。"}, {status: 400});

  const {orderNumber} = await params;
  const order = await prisma.order.findUnique({where: {orderNumber}, select: {id: true, paymentStatus: true, deliveryStatus: true, deliveryFileName: true}});
  if (!order) return NextResponse.json({error: "Order not found"}, {status: 404});
  if (order.deliveryStatus === "CONFIRMED") return NextResponse.json({error: "客户已确认交付，无法继续修改。"}, {status: 409});

  const hasContent = Boolean(body.data.deliveryDescription || order.deliveryFileName || Object.values(body.data.deliveryData).some(Boolean));
  if (body.data.action === "publish" && !hasContent) return NextResponse.json({error: "请先填写至少一项交付内容。"}, {status: 400});
  if (body.data.action === "publish" && order.paymentStatus !== "PAID") return NextResponse.json({error: "订单付款成功后才能发布交付。"}, {status: 409});

  const now = new Date();
  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: {orderNumber},
      data: {
        deliveryDescription: body.data.deliveryDescription || null,
        deliveryData: body.data.deliveryData,
        deliveryInvitationCode: body.data.deliveryData.invitationCode || null,
        deliveryStoreNumber: body.data.deliveryData.storeNumber || null,
        ...(body.data.action === "publish" ? {deliveryStatus: "PUBLISHED", deliveryPublishedAt: now, deliveryRevisionNote: null, status: "PROCESSING"} : {}),
      },
    });
    if (body.data.action === "publish") {
      await tx.orderDeliveryEvent.create({data: {orderId: order.id, type: "PUBLISHED", note: body.data.deliveryDescription || null}});
    }
  });

  return NextResponse.json({status: true});
}
