"use client";

import {LoaderCircle} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";

import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CancelOrderDialog({
  orderNumber,
  open,
  onOpenChange,
}: {
  orderNumber: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleOpenChange(nextOpen: boolean) {
    if (isCancelling) return;

    if (!nextOpen) {
      setError(null);
    }

    onOpenChange(nextOpen);
  }

  async function handleCancel() {
    if (isCancelling) return;

    setError(null);
    setIsCancelling(true);

    try {
      const response = await fetch(`/api/orders/${orderNumber}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          typeof result?.error === "string"
            ? result.error
            : "订单当前状态无法取消，请刷新后重试。",
        );
        return;
      }

      onOpenChange(false);
      router.refresh();
    } catch {
      setError("取消订单失败，请稍后重试。");
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-xl border bg-popover p-0 shadow-md sm:max-w-md">
        <DialogHeader className="px-5 py-5 text-left">
          <DialogTitle className="text-base font-medium">
            确认取消订单？
          </DialogTitle>

          <DialogDescription className="mt-1 text-sm leading-6 text-muted-foreground">
            取消后订单将不再进入办理流程，如需继续办理可以重新提交服务订单。
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="px-5 pb-5">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="flex min-h-15 items-center justify-end gap-2  bg-popover px-5">
          <DialogClose
            render={<Button variant="outline" size="sm" />}
            disabled={isCancelling}
          >
            暂不取消
          </DialogClose>

          <Button
            variant="destructive"
            size="sm"
            disabled={isCancelling}
            onClick={handleCancel}
          >
            {isCancelling && (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            )}

            {isCancelling ? "正在取消" : "确认取消"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
