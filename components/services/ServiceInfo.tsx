import {FileText, ShieldCheck} from "lucide-react";

type ServiceInfoProps = {
  details: string; // 服务详细说明
  afterSalesRule: string; // 售后规则说明
};

export default function ServiceInfo({
  details,
  afterSalesRule,
}: ServiceInfoProps) {
  return (
    <div className="mt-15 flex flex-col max-w-4xl mx-auto gap-10 mb-20">
      {/* 服务详细 */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white">
            <FileText size={16} />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">服务详细</h3>
        </div>
        <div className="px-5 py-5 text-sm leading-relaxed text-gray-600 whitespace-pre-line">
          {details}
        </div>
      </div>

      {/* 售后规则 */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white">
            <ShieldCheck size={16} />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">售后规则</h3>
        </div>
        <div className="px-5 py-5 text-sm leading-relaxed text-gray-600 whitespace-pre-line">
          {afterSalesRule}
        </div>
      </div>
    </div>
  );
}
