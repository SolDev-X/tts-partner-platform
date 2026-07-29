"use client";
import {useState} from "react";

import {AspectRatio} from "@/components/ui/aspect-ratio";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import type {ServiceCase} from "@/lib/types";

interface ServiceImageGalleryProps {
  cases: ServiceCase[];
}

/**
 * 左侧（移动端为下方）缩略图 + 右侧大图，点击缩略图切换大图。
 * 需要记录"当前选中第几张"的状态，所以是 Client Component。
 */
const ServiceImageGallery = ({cases}: ServiceImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!cases.length) return null;

  const active = cases[activeIndex];

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* 缩略图列表：移动端横向滚动，桌面端竖向排列在大图左侧 */}
      <div className="flex gap-3 overflow-x-auto md:w-20 md:flex-col md:overflow-visible">
        {cases.map((item, index) => (
          <button
            key={item.id ?? index}
            type="button"
            aria-label={item.title}
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "size-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors md:size-20",
              index === activeIndex
                ? "border-primary"
                : "border-transparent opacity-70 hover:opacity-100",
            )}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="block size-full object-cover object-center"
            />
          </button>
        ))}
      </div>

      {/* 大图 */}
      <div className="flex-1">
        <AspectRatio
          ratio={1}
          className="relative overflow-hidden rounded-lg bg-muted"
        >
          <img
            src={active.imageUrl}
            alt={active.title}
            className="block size-full object-cover object-center"
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/70 to-transparent p-4">
            {active.tag && (
              <Badge variant="secondary" className="w-fit">
                {active.tag}
              </Badge>
            )}
            <p className="text-sm font-medium text-white">{active.title}</p>
          </div>
        </AspectRatio>
      </div>
    </div>
  );
};

export {ServiceImageGallery};
