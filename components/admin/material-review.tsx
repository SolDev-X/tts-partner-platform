"use client";

import {Check, FileText, LoaderCircle, RotateCcw} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import type {MaterialStatus} from "@/lib/generated/prisma";

type MaterialItem = {
  key: string;
  label: string;
  status: MaterialStatus;
  fileName: string | null;
  customerNote: string | null;
  adminFeedback: string | null;
  submittedAt: string | null;
};

const materialStatusMeta: Record<
  MaterialStatus,
  {label: string; className: string}
> = {
  PENDING: {
    label: "待客户提交",
    className: "border-slate-200 bg-slate-50 text-slate-700",
  },
  SUBMITTED: {
    label: "待审核",
    className: "border-amber-200 bg-amber-50 text-amber-800",
  },
  APPROVED: {
    label: "已通过",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  NEEDS_REVISION: {
    label: "需补充",
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

export function MaterialReview({
  orderNumber,
  materials,
}: {
  orderNumber: string;
  materials: MaterialItem[];
}) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<Record<string, string>>(
    Object.fromEntries(
      materials.map((material) => [material.key, material.adminFeedback ?? ""]),
    ),
  );
  const [savingKey, setSavingKey] = useState<string>();
  const [error, setError] = useState<string>();

  async function reviewMaterial(
    material: MaterialItem,
    status: "APPROVED" | "NEEDS_REVISION",
  ) {
    const message = feedback[material.key]?.trim() ?? "";
    if (status === "NEEDS_REVISION" && !message) {
      setError("要求客户补充资料时，请填写具体原因。");
      return;
    }

    setError(undefined);
    setSavingKey(material.key);
    const response = await fetch(
      `/api/admin/orders/${orderNumber}/materials/${material.key}`,
      {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({status, adminFeedback: message}),
      },
    );
    setSavingKey(undefined);

    if (!response.ok) {
      setError("资料审核结果保存失败，请稍后重试。");
      return;
    }

    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">客户提交资料</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            核对每项材料，并向客户说明需要补充或修改的内容。
          </p>
        </div>
        <span className="text-sm text-muted-foreground">
          {materials.filter((item) => item.status === "APPROVED").length}/
          {materials.length} 项已通过
        </span>
      </div>

      {materials.length === 0 ? (
        <p className="mt-5 rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
          当前服务方案没有配置必交材料。
        </p>
      ) : (
        <div className="mt-5 divide-y rounded-xl border">
          {materials.map((material) => {
            const meta = materialStatusMeta[material.status];
            const canReview = material.status === "SUBMITTED";
            const isSaving = savingKey === material.key;

            return (
              <div key={material.key} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <FileText className="size-4 text-muted-foreground" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{material.label}</p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {material.fileName ?? "客户尚未上传文件"}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className={meta.className}>
                    {meta.label}
                  </Badge>
                </div>

                {material.customerNote && (
                  <p className="mt-3 rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                    客户说明：{material.customerNote}
                  </p>
                )}

                {(canReview || material.status === "NEEDS_REVISION") && (
                  <Textarea
                    value={feedback[material.key] ?? ""}
                    onChange={(event) =>
                      setFeedback((current) => ({
                        ...current,
                        [material.key]: event.target.value,
                      }))
                    }
                    maxLength={500}
                    placeholder="需要补充时，请说明具体要求"
                    className="mt-3 min-h-20"
                  />
                )}

                {canReview && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={isSaving}
                      onClick={() => reviewMaterial(material, "APPROVED")}
                    >
                      {isSaving ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        <Check />
                      )}
                      审核通过
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isSaving}
                      onClick={() =>
                        reviewMaterial(material, "NEEDS_REVISION")
                      }
                    >
                      <RotateCcw />
                      要求补充
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </div>
  );
}
