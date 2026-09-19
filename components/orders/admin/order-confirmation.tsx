"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";

type OrderConfirmationProps = {
  orderNumber: string;
};

export function OrderConfirmation({orderNumber}: OrderConfirmationProps) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function confirmOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
      setError("请输入有效金额，最多保留两位小数。");
      return;
    }

    setIsSubmitting(true);

    const paymentResponse = await fetch(
      `/api/admin/orders/${orderNumber}/payment`,
      {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          amount,
          paymentStatus: "UNPAID",
          paymentChannel: "",
          transactionId: "",
          refundedAmount: "0",
        }),
      },
    );

    if (!paymentResponse.ok) {
      setIsSubmitting(false);
      setError("订单金额保存失败，请稍后重试。");
      return;
    }

    const orderResponse = await fetch(`/api/admin/orders/${orderNumber}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        status: "PENDING_PAYMENT",
        customerMessage:
          message.trim() || "订单已确认，请根据确认金额完成付款。",
      }),
    });

    setIsSubmitting(false);

    if (!orderResponse.ok) {
      setError("订单确认失败，请稍后重试。");
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={confirmOrder} className="rounded-lg border bg-muted/30 p-4">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`confirm-order-amount-${orderNumber}`}>
            订单金额
          </Label>
          <Input
            id={`confirm-order-amount-${orderNumber}`}
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={`confirm-order-message-${orderNumber}`}>
            给客户的说明
          </Label>
          <Textarea
            id={`confirm-order-message-${orderNumber}`}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "确认中..." : "确认订单"}
        </Button>
      </div>
    </form>
  );
}
