import {NextResponse} from "next/server";
import {z} from "zod";

import {auth} from "@/lib/auth";
import {logProgressEvent} from "@/lib/order-progress";
import {prisma} from "@/lib/prisma";

const paymentSchema = z.object({
  amount: z.string().trim(),
  paymentStatus: z.enum(["UNPAID", "PAID", "REFUNDING", "REFUNDED"]),
  paymentChannel: z.string().trim().max(50),
  transactionId: z.string().trim().max(100),
  refundedAmount: z.string().trim(),
});

function parseAmount(value: string, nullable = false) {
  if (!value && nullable) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return undefined;
  const cents = Math.round(Number(value) * 100);
  return Number.isSafeInteger(cents) ? cents : undefined;
}

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

  const body = paymentSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({error: "付款信息格式不正确。"}, {status: 400});
  }

  const amountInCents = parseAmount(body.data.amount, true);
  const parsedRefundedAmount = parseAmount(body.data.refundedAmount || "0");
  if (amountInCents === undefined || parsedRefundedAmount === undefined) {
    return NextResponse.json(
      {error: "金额应为最多两位小数的非负数字。"},
      {status: 400},
    );
  }
  const refundedAmountInCents = parsedRefundedAmount ?? 0;
  if (amountInCents !== null && refundedAmountInCents > amountInCents) {
    return NextResponse.json(
      {error: "退款金额不能大于订单金额。"},
      {status: 400},
    );
  }

  const {orderNumber} = await params;
  const current = await prisma.order.findUnique({
    where: {orderNumber},
    select: {id: true, paymentStatus: true, paidAt: true, refundedAt: true},
  });
  if (!current) {
    return NextResponse.json({error: "Order not found"}, {status: 404});
  }

  const now = new Date();
  await prisma.order.update({
    where: {orderNumber},
    data: {
      amountInCents,
      paymentStatus: body.data.paymentStatus,
      paymentChannel: body.data.paymentChannel || null,
      transactionId: body.data.transactionId || null,
      refundedAmountInCents,
      paidAt:
        body.data.paymentStatus === "PAID"
          ? (current.paidAt ?? now)
          : current.paidAt,
      refundedAt:
        body.data.paymentStatus === "REFUNDED"
          ? (current.refundedAt ?? now)
          : null,
    },
  });

  if (body.data.paymentStatus === "PAID" && current.paymentStatus !== "PAID") {
    await logProgressEvent(
      prisma,
      current.id,
      "PAYMENT_SUCCESS",
      "客户已完成付款。",
    );
  }

  return NextResponse.json({status: true});
}
