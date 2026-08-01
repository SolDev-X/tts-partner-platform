"use client";
import {useState} from "react";

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
            <img
              src={item.imageUrl}
              alt={item.title}
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
            className="block size-full cursor-zoom-in"
          >
            <img
              src={active.imageUrl}
              alt={active.title}
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

      {/* 大图预览弹窗 */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className={cn(
            "max-w-none! border-none bg-transparent p-0 shadow-none",
            "w-[95vw] sm:w-auto",
          )}
        >
          <DialogTitle className="sr-only">{active.title}</DialogTitle>
          <img
            src={active.imageUrl}
            alt={active.title}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export {ServiceImageGallery};
