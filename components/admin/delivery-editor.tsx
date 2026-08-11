"use client";

import {Clock3, LoaderCircle, PackageCheck} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {
  deliveryEventLabels,
  deliveryStatusMeta,
  getDeliveryFields,
} from "@/lib/delivery";

type DeliveryStatus = keyof typeof deliveryStatusMeta;

export function DeliveryEditor({
  orderNumber,
  serviceId,
  paymentStatus,
  deliveryStatus: initialStatus,
  deliveryDescription: initialDescription,
  deliveryData: initialData,
  deliveryFileName: initialFileName,
  deliveryPublishedAt,
  deliveryConfirmedAt,
  deliveryRevisionNote,
  deliveryEvents,
}: {
  orderNumber: string;
  serviceId: string;
  paymentStatus: string;
  deliveryStatus: DeliveryStatus;
  deliveryDescription: string | null;
  deliveryData: Record<string, string>;
  deliveryFileName: string | null;
  deliveryPublishedAt: string | null;
  deliveryConfirmedAt: string | null;
  deliveryRevisionNote: string | null;
  deliveryEvents: Array<{
    type: keyof typeof deliveryEventLabels;
    note: string | null;
    createdAt: string;
  }>;
}) {
  const router = useRouter();
  const fields = getDeliveryFields(serviceId);
  const [deliveryDescription, setDeliveryDescription] = useState(
    initialDescription ?? "",
  );
  const [deliveryData, setDeliveryData] = useState(initialData);
  const [deliveryFileName, setDeliveryFileName] = useState(
    initialFileName ?? "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [feedback, setFeedback] = useState<string>();
  const isConfirmed = initialStatus === "CONFIRMED";

  async function submit(action: "save" | "publish") {
    setFeedback(undefined);
    if (action === "save") {
      setIsSaving(true);
    } else {
      setIsPublishing(true);
    }
    const response = await fetch(`/api/admin/orders/${orderNumber}/delivery`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        action,
        deliveryDescription,
        deliveryData,
        deliveryFileName,
      }),
    });
    setIsSaving(false);
    setIsPublishing(false);
    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setFeedback(result?.error ?? "保存失败，请稍后重试。");
      return;
    }
    setPublishOpen(false);
    setFeedback(
      action === "publish"
        ? "交付内容已发布，正在等待客户确认。"
        : "交付草稿已保存。",
    );
    router.refresh();
  }

  const statusMeta = deliveryStatusMeta[initialStatus];
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <PackageCheck className="size-4 text-muted-foreground" />
          </span>
          <div>
            <h2 className="font-semibold">服务交付</h2>
          </div>
        </div>
        <Badge variant="outline" className={statusMeta.className}>
          {statusMeta.label}
        </Badge>
      </div>

      <div className="grid gap-3 rounded-xl bg-muted/35 p-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-muted-foreground">交付状态</p>
          <p className="mt-1 text-sm font-medium">{statusMeta.label}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">交付时间</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
            <Clock3 className="size-3.5 text-muted-foreground" />
            {deliveryPublishedAt
              ? new Date(deliveryPublishedAt).toLocaleString("zh-CN")
              : "尚未发布"}
          </p>
        </div>
      </div>

      {deliveryRevisionNote && initialStatus === "REVISION_REQUESTED" && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-medium">客户申请修改</p>
          <p className="mt-1 whitespace-pre-line">{deliveryRevisionNote}</p>
        </div>
      )}

      <label className="block space-y-2 text-sm font-medium ml-1">
        交付结果说明
        <Textarea
          value={deliveryDescription}
          onChange={(event) => setDeliveryDescription(event.target.value)}
          maxLength={2000}
          className="min-h-28 mt-2"
          disabled={isConfirmed}
        />
      </label>

      <label className="block space-y-2 text-sm font-medium  ml-1">
        交付文件
        <Input
          value={deliveryFileName}
          onChange={(event) => setDeliveryFileName(event.target.value)}
          maxLength={200}
          disabled={isConfirmed}
        />
      </label>

      {deliveryConfirmedAt && (
        <p className="text-xs text-muted-foreground">
          客户确认时间：{new Date(deliveryConfirmedAt).toLocaleString("zh-CN")}
        </p>
      )}

      {deliveryEvents.length > 0 && (
        <div className="space-y-3 border-t pt-4">
          <h3 className="text-sm font-medium">交付记录</h3>
          {deliveryEvents.map((event, index) => (
            <div
              key={`${event.type}-${event.createdAt}-${index}`}
              className="flex items-start justify-between gap-4 text-sm"
            >
              <div>
                <p className="font-medium">{deliveryEventLabels[event.type]}</p>
                {event.note && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {event.note}
                  </p>
                )}
              </div>
              <time className="shrink-0 text-xs text-muted-foreground">
                {new Date(event.createdAt).toLocaleString("zh-CN")}
              </time>
            </div>
          ))}
        </div>
      )}
      {feedback && (
        <p
          className={
            feedback.includes("失败") || feedback.includes("请先")
              ? "text-sm text-destructive"
              : "text-sm text-muted-foreground"
          }
        >
          {feedback}
        </p>
      )}

      {!isConfirmed && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="sm:flex-1"
            disabled={isSaving || isPublishing}
            onClick={() => submit("save")}
          >
            {isSaving && <LoaderCircle className="animate-spin" />}
            {isSaving ? "正在保存" : "保存草稿"}
          </Button>
          <Button
            type="button"
            className="sm:flex-1"
            disabled={isSaving || isPublishing}
            onClick={() => setPublishOpen(true)}
          >
            发布交付
          </Button>
        </div>
      )}

      {paymentStatus !== "PAID" && !isConfirmed && (
        <p className="text-xs text-amber-700">
          订单尚未付款，可以保存草稿，但付款成功前无法发布交付。
        </p>
      )}

      <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认发布交付？</DialogTitle>
            <DialogDescription>
              发布后客户将看到交付内容，并可以确认完成或申请修改。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              取消
            </DialogClose>
            <Button disabled={isPublishing} onClick={() => submit("publish")}>
              {isPublishing && <LoaderCircle className="animate-spin" />}
              {isPublishing ? "正在发布" : "确认发布"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
