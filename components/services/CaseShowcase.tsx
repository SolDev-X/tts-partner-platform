"use client";

import {useState} from "react";
import {ChevronLeft, ChevronRight, X} from "lucide-react";
import Image from "next/image";

export type ServiceCase = {
  id: string;
  imageUrl: string;
  title: string;
  tag?: string;
};

type CaseShowcaseProps = {
  cases: ServiceCase[];
};

export default function CaseShowcase({cases}: CaseShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setLightboxOpen] = useState(false);

  if (cases.length === 0) return null;

  const activeCase = cases[activeIndex];

  const goPrev = () =>
    setActiveIndex((prev) => (prev === 0 ? cases.length - 1 : prev - 1));
  const goNext = () =>
    setActiveIndex((prev) => (prev === cases.length - 1 ? 0 : prev + 1));

  return (
    <div className="mt-10 mx-auto items-center">
      {/* 主图区域 */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div
          className="relative aspect-[16/10] bg-gray-100 cursor-zoom-in group"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={activeCase.imageUrl}
            alt={activeCase.title}
            width={650}
            height={600}
          />

          {/* 左右切换箭头 */}
          {cases.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* 图片说明 */}
        <div className="px-5 py-4 flex items-center justify-between bg-black">
          <p className="text-sm font-medium text-white">{activeCase.title}</p>
          {activeCase.tag && (
            <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5">
              {activeCase.tag}
            </span>
          )}
        </div>
      </div>

      {/* 缩略图行 */}
      {cases.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {cases.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(index)}
              className={`
                relative flex-shrink-0 w-20 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all
                ${
                  index === activeIndex
                    ? "border-gray-900"
                    : "border-transparent opacity-60 hover:opacity-100"
                }
              `}
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={800}
                height={500}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* 灯箱大图预览 */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 text-white/80 hover:text-white"
          >
            <X size={28} />
          </button>
          <Image
            src={activeCase.imageUrl}
            alt={activeCase.title}
            width={1000}
            height={700}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
