"use client";

import {CreditCard, LoaderCircle} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import type {PaymentStatus} from "@/lib/generated/prisma";

const paymentStatuses: Array<{value: PaymentStatus; label: string}> = [
  {value: "UNPAID", label: "未付款"},
  {value: "PAID", label: "已付款"},
  {value: "REFUNDING", label: "退款中"},
  {value: "REFUNDED", label: "已退款"},
];

const paymentChannels = [
  {value: "", label: "暂未记录"},
  {value: "WECHAT_PAY", label: "微信支付"},
  {value: "ALIPAY", label: "支付宝"},
  {value: "BANK_TRANSFER", label: "银行转账"},
  {value: "OTHER", label: "其他"},
];

function centsToYuan(value: number | null) {
  return value === null ? "" : (value / 100).toFixed(2);
}

export function PaymentEditor({
  orderNumber,
  amountInCents,
  paymentStatus: initialPaymentStatus,
  paymentChannel: initialPaymentChannel,
  transactionId: initialTransactionId,
  refundedAmountInCents,
  paidAt,
  refundedAt,
}: {
  orderNumber: string;
  amountInCents: number | null;
  paymentStatus: PaymentStatus;
  paymentChannel: string | null;
  transactionId: string | null;
  refundedAmountInCents: number;
  paidAt: string | null;
  refundedAt: string | null;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(centsToYuan(amountInCents));
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [paymentChannel, setPaymentChannel] = useState(
    initialPaymentChannel ?? "",
  );
  const [transactionId, setTransactionId] = useState(
    initialTransactionId ?? "",
  );
  const [refundedAmount, setRefundedAmount] = useState(
    centsToYuan(refundedAmountInCents),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string>();

  async function savePayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(undefined);
    setIsSaving(true);

    const response = await fetch(`/api/admin/orders/${orderNumber}/payment`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        amount,
        paymentStatus,
        paymentChannel,
        transactionId,
        refundedAmount,
      }),
    });

    setIsSaving(false);
    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setFeedback(result?.error ?? "付款信息保存失败，请稍后重试。");
      return;
    }

    setFeedback("付款信息已保存。");
    router.refresh();
  }

  return (
    <form onSubmit={savePayment} className="space-y-5">
      <div className="flex items-center gap-3 border-b pb-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <CreditCard className="size-4 text-muted-foreground" />
        </span>
        <div>
          <h2 className="font-semibold">付款信息</h2>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          订单金额（元）
          <Input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            inputMode="decimal"
          />
        </label>
        <label className="space-y-2 text-sm font-medium">
          支付状态
          <select
            value={paymentStatus}
            onChange={(event) =>
              setPaymentStatus(event.target.value as PaymentStatus)
            }
            className="h-9 w-full rounded-lg border bg-background px-2 text-sm outline-none transition-shadow focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {paymentStatuses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium">
          支付渠道
          <select
            value={paymentChannel}
            onChange={(event) => setPaymentChannel(event.target.value)}
            className="h-9 w-full rounded-lg border bg-background px-2 text-sm outline-none transition-shadow focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {paymentChannels.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium">
          交易单号
          <Input
            value={transactionId}
            onChange={(event) => setTransactionId(event.target.value)}
            maxLength={100}
            placeholder="支付平台交易单号"
          />
        </label>
      </div>

      {(paymentStatus === "REFUNDING" || paymentStatus === "REFUNDED") && (
        <label className="block space-y-2 text-sm font-medium">
          退款金额（元）
          <Input
            value={refundedAmount}
            onChange={(event) => setRefundedAmount(event.target.value)}
            inputMode="decimal"
            placeholder="例如：999.00"
          />
        </label>
      )}

      {(paidAt || refundedAt) && (
        <dl className="grid gap-3 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground sm:grid-cols-2">
          {paidAt && (
            <div>
              <dt>付款时间</dt>
              <dd className="mt-1 text-foreground">
                {new Date(paidAt).toLocaleString("zh-CN")}
              </dd>
            </div>
          )}
          {refundedAt && (
            <div>
              <dt>退款完成时间</dt>
              <dd className="mt-1 text-foreground">
                {new Date(refundedAt).toLocaleString("zh-CN")}
              </dd>
            </div>
          )}
        </dl>
      )}

      {feedback && (
        <p
          className={
            feedback === "付款信息已保存。"
              ? "text-sm text-muted-foreground"
              : "text-sm text-destructive"
          }
        >
          {feedback}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isSaving}>
        {isSaving && <LoaderCircle className="animate-spin" />}
        {isSaving ? "正在保存" : "保存付款信息"}
      </Button>
    </form>
  );
}
