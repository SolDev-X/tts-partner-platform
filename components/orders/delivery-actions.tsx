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
} from "@/components/ui/dialog";
import {Textarea} from "@/components/ui/textarea";

export function DeliveryActions({orderNumber}: {orderNumber: string}) {
  const router = useRouter();
  const [action, setAction] = useState<"confirm" | "request_revision">();
  const [revisionNote, setRevisionNote] = useState("");
  const [feedback, setFeedback] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit() {
    if (!action) return;
    setFeedback(undefined);
    setIsSubmitting(true);
    const response = await fetch(`/api/orders/${orderNumber}/delivery`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({action, revisionNote}),
    });
    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as {error?: string} | null;
      setFeedback(result?.error ?? "操作失败，请稍后重试。");
      setAction(undefined);
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
    setAction(undefined);
    router.refresh();
  }

  return (
    <div className="space-y-3 border-t pt-4">
      <p className="text-sm font-medium">请核对以上交付内容</p>
      <p className="text-xs text-muted-foreground">确认无误后订单将完成；如有问题，请填写具体修改要求。</p>
      {feedback && <p className="text-sm text-destructive">{feedback}</p>}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button className="sm:flex-1" disabled={isSubmitting} onClick={() => setAction("confirm")}>确认交付</Button>
        <Button variant="outline" className="sm:flex-1" disabled={isSubmitting} onClick={() => setAction("request_revision")}>申请修改</Button>
      </div>

      <Dialog open={Boolean(action)} onOpenChange={(open) => !open && setAction(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{action === "confirm" ? "确认本次交付？" : "申请修改交付内容"}</DialogTitle>
            <DialogDescription>{action === "confirm" ? "确认后订单将标记为已完成。" : "请说明需要修改或补充的内容，管理员会收到您的反馈。"}</DialogDescription>
          </DialogHeader>
          {action === "request_revision" && <Textarea value={revisionNote} onChange={(event) => setRevisionNote(event.target.value)} maxLength={1000} className="min-h-28" placeholder="请具体说明需要修改的内容" />}
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>取消</DialogClose>
            <Button disabled={isSubmitting || !action || (action === "request_revision" && !revisionNote.trim())} onClick={submit}>
              {isSubmitting && <LoaderCircle className="animate-spin" />}
              {isSubmitting ? "正在提交" : action === "confirm" ? "确认完成" : "提交修改申请"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
