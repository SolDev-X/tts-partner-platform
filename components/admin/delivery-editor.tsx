"use client";

import {upload} from "@vercel/blob/client";
import {Clock3, Download, FileUp, LoaderCircle, PackageCheck} from "lucide-react";
import {useRouter} from "next/navigation";
import {useRef, useState} from "react";

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
} from "@/lib/delivery";

type DeliveryStatus = keyof typeof deliveryStatusMeta;

export function DeliveryEditor({
  orderNumber,
  paymentStatus,
  deliveryStatus: initialStatus,
  deliveryDescription: initialDescription,
  deliveryData: initialData,
  deliveryFileName: initialFileName,
  deliveryFilePathname,
  deliveryFileSize: initialFileSize,
  deliveryPublishedAt,
  deliveryConfirmedAt,
  deliveryRevisionNote,
  deliveryEvents,
}: {
  orderNumber: string;
  paymentStatus: string;
  deliveryStatus: DeliveryStatus;
  deliveryDescription: string | null;
  deliveryData: Record<string, string>;
  deliveryFileName: string | null;
  deliveryFilePathname: string | null;
  deliveryFileSize: number | null;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deliveryDescription, setDeliveryDescription] = useState(
    initialDescription ?? "",
  );
  const deliveryData = initialData;
  const [deliveryFileName, setDeliveryFileName] = useState(
    initialFileName ?? "",
  );
  const [deliveryFileSize, setDeliveryFileSize] = useState(initialFileSize);
  const [uploadProgress, setUploadProgress] = useState<number>();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [feedback, setFeedback] = useState<string>();
  const isConfirmed = initialStatus === "CONFIRMED";

  async function uploadFile(file: File) {
    setFeedback(undefined);
    if (file.size > 20 * 1024 * 1024) {
      setFeedback("上传失败：文件不能超过 20 MB。");
      return;
    }

    setUploadProgress(0);
    try {
      await upload(`orders/${orderNumber}/delivery/${file.name}`, file, {
        access: "private",
        handleUploadUrl: `/api/admin/orders/${orderNumber}/delivery/upload`,
        clientPayload: JSON.stringify({
          orderNumber,
          fileName: file.name,
          size: file.size,
        }),
        onUploadProgress: ({percentage}) => setUploadProgress(percentage),
      });
      setDeliveryFileName(file.name);
      setDeliveryFileSize(file.size);
      setFeedback("文件上传成功。");
      router.refresh();
    } catch (error) {
      setFeedback(
        `上传失败：${error instanceof Error ? error.message : "请稍后重试。"}`,
      );
    } finally {
      setUploadProgress(undefined);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

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

      <div className="ml-1 space-y-2">
        <p className="text-sm font-medium">交付文件</p>
        <Input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.zip,.docx,.xlsx,.png,.jpg,.jpeg"
          disabled={isConfirmed || uploadProgress !== undefined}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void uploadFile(file);
          }}
        />
        <p className="text-xs text-muted-foreground">
          支持 PDF、ZIP、DOCX、XLSX、PNG、JPG，最大 20 MB。
        </p>
        {uploadProgress !== undefined && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin" />
            正在上传 {Math.round(uploadProgress)}%
          </p>
        )}
        {deliveryFileName && uploadProgress === undefined && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/30 p-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <FileUp className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{deliveryFileName}</span>
              {deliveryFileSize !== null && (
                <span className="shrink-0 text-xs text-muted-foreground">
                  {(deliveryFileSize / 1024 / 1024).toFixed(2)} MB
                </span>
              )}
            </span>
            {deliveryFilePathname && (
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={
                  <a
                    href={`/api/orders/${orderNumber}/delivery/file`}
                    target="_blank"
                    rel="noreferrer"
                  />
                }
              >
                <Download /> 下载
              </Button>
            )}
          </div>
        )}
      </div>

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
            disabled={isSaving || isPublishing || uploadProgress !== undefined}
            onClick={() => submit("save")}
          >
            {isSaving && <LoaderCircle className="animate-spin" />}
            {isSaving ? "正在保存" : "保存草稿"}
          </Button>
          <Button
            type="button"
            className="sm:flex-1"
            disabled={isSaving || isPublishing || uploadProgress !== undefined}
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
