"use client";

import {LoaderCircle, PackageCheck} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";

export function DeliveryEditor({
  orderNumber,
  status,
  deliveryDescription: initialDescription,
  deliveryInvitationCode: initialInvitationCode,
  deliveryStoreNumber: initialStoreNumber,
  deliveryFileName: initialFileName,
  deliveryCompletedAt,
  deliveryVisibleAfterPayment: initialVisibleAfterPayment,
}: {
  orderNumber: string;
  status: string;
  deliveryDescription: string | null;
  deliveryInvitationCode: string | null;
  deliveryStoreNumber: string | null;
  deliveryFileName: string | null;
  deliveryCompletedAt: string | null;
  deliveryVisibleAfterPayment: boolean;
}) {
  const router = useRouter();
  const [deliveryDescription, setDeliveryDescription] = useState(
    initialDescription ?? "",
  );
  const [deliveryInvitationCode, setDeliveryInvitationCode] = useState(
    initialInvitationCode ?? "",
  );
  const [deliveryStoreNumber, setDeliveryStoreNumber] = useState(
    initialStoreNumber ?? "",
  );
  const [deliveryFileName, setDeliveryFileName] = useState(
    initialFileName ?? "",
  );
  const [deliveryVisibleAfterPayment, setDeliveryVisibleAfterPayment] =
    useState(initialVisibleAfterPayment);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [feedback, setFeedback] = useState<string>();

  const isDelivered = status === "COMPLETED";

  async function saveDelivery(confirm = false) {
    setFeedback(undefined);
    if (confirm) {
      setIsConfirming(true);
    } else {
      setIsSaving(true);
    }

    const response = await fetch(`/api/admin/orders/${orderNumber}/delivery`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        deliveryDescription,
        deliveryInvitationCode,
        deliveryStoreNumber,
        deliveryFileName,
        deliveryVisibleAfterPayment,
        confirm,
      }),
    });

    setIsSaving(false);
    setIsConfirming(false);

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setFeedback(result?.error ?? "保存失败，请稍后重试。");
      return;
    }

    setFeedback(
      confirm ? "已确认交付，订单标记为已完成。" : "交付信息已保存。",
    );
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 border-b pb-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <PackageCheck className="size-4 text-muted-foreground" />
        </span>
        <div>
          <h2 className="font-semibold">服务交付</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            填写交付结果并确认完成，客户可在订单详情页查看。
          </p>
        </div>
      </div>

      <label className="block space-y-2 text-sm font-medium">
        交付结果说明
        <Textarea
          value={deliveryDescription}
          onChange={(event) => setDeliveryDescription(event.target.value)}
          maxLength={2000}
          placeholder="向客户说明本次服务的交付内容和注意事项。"
          className="min-h-24"
          disabled={isDelivered}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          邀请码
          <Input
            value={deliveryInvitationCode}
            onChange={(event) => setDeliveryInvitationCode(event.target.value)}
            maxLength={100}
            placeholder="如有邀请码请填写"
            disabled={isDelivered}
          />
        </label>
        <label className="space-y-2 text-sm font-medium">
          店铺编号
          <Input
            value={deliveryStoreNumber}
            onChange={(event) => setDeliveryStoreNumber(event.target.value)}
            maxLength={100}
            placeholder="如有店铺编号请填写"
            disabled={isDelivered}
          />
        </label>
      </div>

      <label className="block space-y-2 text-sm font-medium">
        结果文件或截图
        <Input
          value={deliveryFileName}
          onChange={(event) => setDeliveryFileName(event.target.value)}
          maxLength={200}
          placeholder="填写文件名或截图说明"
          disabled={isDelivered}
        />
        <span className="block text-xs font-normal text-muted-foreground">
          暂以文件名记录，后续可接入文件上传。
        </span>
      </label>

      <label className="flex items-start gap-3 rounded-lg border bg-muted/30 px-4 py-3 text-sm">
        <input
          type="checkbox"
          checked={deliveryVisibleAfterPayment}
          onChange={(event) =>
            setDeliveryVisibleAfterPayment(event.target.checked)
          }
          disabled={isDelivered}
          className="mt-0.5 size-4 rounded border"
        />
        <span>
          <span className="font-medium">敏感内容仅付款后可见</span>
          <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
            开启后，未付款客户无法查看邀请码、店铺编号等交付详情。
          </span>
        </span>
      </label>

      {deliveryCompletedAt && (
        <p className="text-xs text-muted-foreground">
          完成时间：{new Date(deliveryCompletedAt).toLocaleString("zh-CN")}
        </p>
      )}

      {feedback && (
        <p
          className={
            feedback.includes("失败")
              ? "text-sm text-destructive"
              : "text-sm text-muted-foreground"
          }
        >
          {feedback}
        </p>
      )}

      {!isDelivered && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="sm:flex-1"
            disabled={isSaving || isConfirming}
            onClick={() => saveDelivery(false)}
          >
            {isSaving && <LoaderCircle className="animate-spin" />}
            {isSaving ? "正在保存" : "保存交付信息"}
          </Button>
          <Button
            type="button"
            className="sm:flex-1"
            disabled={isSaving || isConfirming}
            onClick={() => saveDelivery(true)}
          >
            {isConfirming && <LoaderCircle className="animate-spin" />}
            {isConfirming ? "正在确认" : "确认交付"}
          </Button>
        </div>
      )}
    </div>
  );
}
