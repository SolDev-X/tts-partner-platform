import {NextResponse} from "next/server";
import {z} from "zod";

import {auth} from "@/lib/auth";
import {services} from "@/lib/data";
import {isStringSelection} from "@/lib/order-display";
import {prisma} from "@/lib/prisma";
import {matchVariantRule} from "@/lib/utils";

const reviewSchema = z.object({
  status: z.enum(["APPROVED", "NEEDS_REVISION"]),
  adminFeedback: z.string().trim().max(500),
});

export async function PATCH(
  request: Request,
  {
    params,
  }: {params: Promise<{orderNumber: string; materialKey: string}>},
) {
  const session = await auth.api.getSession({headers: request.headers});
  if (!session) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({error: "Forbidden"}, {status: 403});
  }

  const body = reviewSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({error: "Invalid material review"}, {status: 400});
  }
  if (body.data.status === "NEEDS_REVISION" && !body.data.adminFeedback) {
    return NextResponse.json({error: "Feedback is required"}, {status: 400});
  }

  const {orderNumber, materialKey} = await params;
  const order = await prisma.order.findUnique({
    where: {orderNumber},
    select: {
      id: true,
      serviceId: true,
      selection: true,
      materials: {where: {key: materialKey}, select: {status: true}},
    },
  });
  if (!order) {
    return NextResponse.json({error: "Order not found"}, {status: 404});
  }

  const service = services.find((item) => item.id === order.serviceId);
  const selection = isStringSelection(order.selection) ? order.selection : {};
  const rule = service
    ? matchVariantRule(service.variantRules ?? [], selection)
    : null;
  const index = Number(materialKey.replace("material-", "")) - 1;
  const label = rule?.requiredMaterials?.[index];
  if (!label || order.materials[0]?.status !== "SUBMITTED") {
    return NextResponse.json({error: "Material is not ready"}, {status: 409});
  }

  await prisma.orderMaterial.upsert({
    where: {orderId_key: {orderId: order.id, key: materialKey}},
    create: {
      orderId: order.id,
      key: materialKey,
      label,
      status: body.data.status,
      adminFeedback: body.data.adminFeedback || null,
      reviewedAt: new Date(),
    },
    update: {
      status: body.data.status,
      adminFeedback: body.data.adminFeedback || null,
      reviewedAt: new Date(),
    },
  });

  return NextResponse.json({status: true});
}
