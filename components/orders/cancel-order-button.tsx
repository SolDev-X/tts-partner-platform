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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CancelOrderButton({orderNumber}: {orderNumber: string}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string>();

  async function cancelOrder() {
    setError(undefined);
    setIsCancelling(true);

    const response = await fetch(`/api/orders/${orderNumber}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setIsCancelling(false);
      setError("订单状态已更新，暂时无法取消。");
      return;
    }

    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" />}>
        取消订单
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认取消订单？</DialogTitle>
          <DialogDescription>
            取消后订单将不再进入办理流程；如需继续办理，您可以重新选择服务方案创建订单。
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />} disabled={isCancelling}>
            暂不取消
          </DialogClose>
          <Button
            variant="destructive"
            disabled={isCancelling}
            onClick={cancelOrder}
          >
            {isCancelling && <LoaderCircle className="animate-spin" aria-hidden="true" />}
            确认取消
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
