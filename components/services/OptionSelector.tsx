import type {Service} from "@/lib/types";
import {Button} from "@/components/ui/button";
import {Globe, Store, Send, Check} from "lucide-react";

type OptionSelectorProps = {
  service: Service;
  selections: Record<string, string>;
  onSelect: (groupKey: string, optionId: string) => void;
};

const groupIcons: Record<string, React.ElementType> = {
  sites: Globe,
  shopType: Store,
  onboardingType: Send,
};

export default function OptionSelector({
  service,
  selections,
  onSelect,
}: OptionSelectorProps) {
  const totalGroups = service.optionGroups?.length ?? 0;
  const selectedCount = Object.keys(selections).length;

  return (
    <div className="max-w-3xl mx-auto px-6">
      {/* 选项组列表 */}
      <div className="space-y-6">
        {service.optionGroups?.map((group) => {
          const Icon = groupIcons[group.key] ?? Globe;
          const isGroupSelected = !!selections[group.key];

          return (
            <div
              key={group.key}
              className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white">
                    <Icon size={16} />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    {group.title}
                  </h2>
                </div>
                {isGroupSelected && (
                  <span className="text-xs text-gray-400">已选择</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 px-5 py-5">
                {group.options.map((option) => {
                  const isActive = selections[group.key] === option.id;

                  return (
                    <button
                      key={option.id}
                      onClick={() => onSelect(group.key, option.id)}
                      className={`
                        inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium
                        transition-all duration-150 border
                        ${
                          isActive
                            ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                        }
                      `}
                    >
                      {isActive && <Check size={14} />}
                      {option.name}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部提交按钮 */}
      {totalGroups > 0 && (
        <div className="mt-8 flex justify-end">
          <Button
            size="lg"
            disabled={selectedCount < totalGroups}
            className="rounded-full px-8"
          >
            提交申请
          </Button>
        </div>
      )}
    </div>
  );
}
