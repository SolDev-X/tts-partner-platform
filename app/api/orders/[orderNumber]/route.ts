import {NextResponse} from "next/server";

import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function DELETE(
  request: Request,
  {params}: {params: Promise<{orderNumber: string}>},
) {
  const session = await auth.api.getSession({headers: request.headers});
  if (!session) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const {orderNumber} = await params;
  const result = await prisma.order.updateMany({
    where: {
      orderNumber,
      userId: session.user.id,
      status: {in: ["PENDING_PAYMENT", "PENDING_CONFIRMATION"]},
    },
    data: {status: "CANCELLED"},
  });

  if (result.count === 0) {
    return NextResponse.json(
      {error: "订单当前状态无法取消，请刷新后重试。"},
      {status: 409},
    );
  }

  return NextResponse.json({status: true});
}
