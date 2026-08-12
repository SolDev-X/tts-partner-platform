import {get} from "@vercel/blob";
import {NextResponse} from "next/server";

import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function GET(
  request: Request,
  {params}: {params: Promise<{orderNumber: string}>},
) {
  const session = await auth.api.getSession({headers: request.headers});
  if (!session) return NextResponse.json({error: "Unauthorized"}, {status: 401});

  const {orderNumber} = await params;
  const order = await prisma.order.findUnique({
    where: {orderNumber},
    select: {
      userId: true,
      paymentStatus: true,
      deliveryStatus: true,
      deliveryFileName: true,
      deliveryFilePathname: true,
    },
  });
  if (!order) return NextResponse.json({error: "文件不存在。"}, {status: 404});

  const isAdmin = session.user.role === "ADMIN";
  const customerCanDownload =
    session.user.role === "CUSTOMER" &&
    order.userId === session.user.id &&
    order.paymentStatus === "PAID" &&
    (order.deliveryStatus === "PUBLISHED" ||
      order.deliveryStatus === "CONFIRMED");
  if (!isAdmin && !customerCanDownload) {
    return NextResponse.json({error: "Forbidden"}, {status: 403});
  }
  if (!order.deliveryFilePathname || !order.deliveryFileName) {
    return NextResponse.json({error: "文件不存在。"}, {status: 404});
  }

  const result = await get(order.deliveryFilePathname, {access: "private"});
  if (!result || result.statusCode !== 200) {
    return NextResponse.json({error: "文件不存在。"}, {status: 404});
  }

  const encodedName = encodeURIComponent(order.deliveryFileName);
  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodedName}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
