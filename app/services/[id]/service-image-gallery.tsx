"use client";
import Image from "next/image";
import {useState} from "react";
import {X} from "lucide-react";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {Badge} from "@/components/ui/badge";
import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {cn} from "@/lib/utils";
import type {ServiceCase} from "@/lib/types";

interface ServiceImageGalleryProps {
  cases: ServiceCase[];
}

const ServiceImageGallery = ({cases}: ServiceImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!cases.length) return null;

  const active = cases[activeIndex];

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* 缩略图列表 */}
      <div className="flex gap-3 overflow-x-auto md:w-20 md:flex-col md:overflow-visible">
        {cases.map((item, index) => (
          <button
            key={item.id ?? index}
            type="button"
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "size-16 shrink-0 overflow-hidden rounded-md border-2 bg-muted transition-colors md:size-20",
              index === activeIndex
                ? "border-primary"
                : "border-transparent opacity-70 hover:opacity-100",
            )}
          >
            <Image
              src={item.imageUrl}
              alt={item.title ?? "服务案例"}
              width={80}
              height={80}
              className="block size-full object-contain"
            />
          </button>
        ))}
      </div>

      {/* 大图，点击打开大图预览 */}
      <div className="flex-1">
        <AspectRatio
          ratio={1}
          className="relative overflow-hidden rounded-lg bg-muted"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="relative block size-full cursor-zoom-in"
          >
            <Image
              src={active.imageUrl}
              alt={active.title ?? "服务案例"}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="block size-full object-contain object-center"
            />
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t ">
            {active.title && (
              <Badge variant="secondary" className="w-fit m-2">
                {active.title}
              </Badge>
            )}
          </div>
        </AspectRatio>
      </div>

      {/* 大图预览弹窗：移动端全屏，桌面端居中带边距 */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          showCloseButton={false}
          className={cn(
            "max-w-none! border-none bg-black/95 p-0 shadow-none",
            "h-dvh w-screen max-h-dvh translate-x-0 translate-y-0 top-0 left-0 rounded-none",
            "sm:h-auto sm:w-auto sm:max-h-[90vh] sm:max-w-[90vw] sm:top-1/2 sm:left-1/2 sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-lg sm:bg-transparent",
          )}
        >
          <DialogTitle className="sr-only">{active.title}</DialogTitle>

          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="关闭大图预览"
            className={cn(
              "absolute z-10 flex items-center justify-center rounded-full",
              "top-4 right-4 size-10 bg-black/60 text-white",
              "sm:top-2 sm:right-2 sm:size-8 sm:bg-white/90 sm:text-foreground",
            )}
          >
            <X className="size-5 sm:size-4" />
          </button>

          <div className="flex size-full items-center justify-center">
            <Image
              src={active.imageUrl}
              alt={active.title ?? "服务案例"}
              width={1600}
              height={1600}
              sizes="90vw"
              className="h-auto max-h-full w-auto max-w-full object-contain sm:max-h-[90vh] sm:max-w-[90vw] sm:rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export {ServiceImageGallery};
