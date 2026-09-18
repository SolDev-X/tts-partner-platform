"use client";

import {ArrowLeft} from "lucide-react";
import {useRouter} from "next/navigation";

import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

interface BackButtonProps {
  label?: string;
  fallbackHref?: string;
  className?: string;
}

export function BackButton({
  label = "返回上一级",
  fallbackHref = "/",
  className,
}: BackButtonProps) {
  const router = useRouter();

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className={cn("gap-1.5 text-muted-foreground", className)}
    >
      <ArrowLeft className="size-3.5" />
      {label}
    </Button>
  );
}
