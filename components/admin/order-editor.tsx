"use client";

import {LoaderCircle} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";

import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {orderStatusMeta} from "@/lib/order-status";
import type {OrderStatus} from "@/lib/generated/prisma";

const statusOptions = Object.entries(orderStatusMeta) as [
  OrderStatus,
  (typeof orderStatusMeta)[OrderStatus],
][];

export function OrderEditor({
  orderNumber,
  status: initialStatus,
  customerMessage: initialCustomerMessage,
  adminNote: initialAdminNote,
}: {
  orderNumber: string;
  status: OrderStatus;
  customerMessage: string | null;
  adminNote: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [customerMessage, setCustomerMessage] = useState(
    initialCustomerMessage ?? "",
  );
  const [adminNote, setAdminNote] = useState(initialAdminNote ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string>();

  async function saveOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(undefined);
    setIsSaving(true);

    const response = await fetch(`/api/admin/orders/${orderNumber}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({status, customerMessage, adminNote}),
    });

    setIsSaving(false);
    if (!response.ok) {
      setFeedback("保存失败，请稍后重试。");
      return;
    }

    setFeedback("订单已更新。");
    router.refresh();
  }

  return (
    <form onSubmit={saveOrder} className="space-y-5">
      <label className="block space-y-2 text-sm font-medium">
        订单状态
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as OrderStatus)}
          className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-shadow focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {statusOptions.map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2 text-sm font-medium">
        客户可见处理说明
        <Textarea
          value={customerMessage}
          onChange={(event) => setCustomerMessage(event.target.value)}
          maxLength={1000}
          placeholder="例如：材料已确认，预计 3–10 个工作日内进入平台审核。"
          className="min-h-24"
        />
      </label>

      <label className="block space-y-2 text-sm font-medium">
        内部备注
        <Textarea
          value={adminNote}
          onChange={(event) => setAdminNote(event.target.value)}
          maxLength={1000}
          placeholder="仅管理员可见，不会展示给客户。"
          className="min-h-20"
        />
      </label>

      {feedback && (
        <p className={feedback === "订单已更新。" ? "text-sm text-muted-foreground" : "text-sm text-destructive"}>
          {feedback}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isSaving}>
        {isSaving && <LoaderCircle className="animate-spin" aria-hidden="true" />}
        {isSaving ? "正在保存" : "保存订单更新"}
      </Button>
    </form>
  );
}
