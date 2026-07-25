"use client";

import {useState} from "react";
import Link from "next/link";
import {sites, onboardingTypes, inviteTypes} from "@/lib/data";
import {buttonVariants} from "@/components/ui/button";

export function OnboardingSelector() {
  const [siteId, setSiteId] = useState<string | null>(null);
  const [typeId, setTypeId] = useState<string | null>(null);
  const [inviteId, setInviteId] = useState<string | null>(null);

  const selectedSite = sites.find((s) => s.id === siteId);
  const isDirect = typeId === "direct";
  const isPop = typeId === "pop";

  // 直邮模式下的规则说明文字
  const directMailNote =
    isDirect && selectedSite?.directMailRule === "invite-only"
      ? `${selectedSite.name}站点直邮模式仅支持定邀入驻`
      : null;

  const summaryParts = [
    selectedSite?.name,
    typeId && onboardingTypes.find((t) => t.id === typeId)?.name,
    (isPop || (isDirect && selectedSite?.directMailRule === "both")) &&
      inviteId &&
      inviteTypes.find((i) => i.id === inviteId)?.name,
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      {/* 站点选择 */}
      <div>
        <p className="mb-3 text-sm font-semibold text-black">站点</p>
        <div className="flex flex-wrap gap-2">
          {sites.map((site) => (
            <button
              key={site.id}
              onClick={() => setSiteId(site.id)}
              className={`border px-4 py-2 text-sm ${
                siteId === site.id
                  ? "border-black bg-black text-white"
                  : "border-black text-black hover:bg-neutral-100"
              }`}
            >
              {site.name}
            </button>
          ))}
        </div>
      </div>

      {/* 入驻类型选择 */}
      <div>
        <p className="mb-3 text-sm font-semibold text-black">入驻类型</p>
        <div className="flex flex-wrap gap-2">
          {onboardingTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setTypeId(type.id);
                setInviteId(null); // 切换类型时重置定邀/普招选择
              }}
              className={`border px-4 py-2 text-sm ${
                typeId === type.id
                  ? "border-black bg-black text-white"
                  : "border-black text-black hover:bg-neutral-100"
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      {/* 仅POP模式下出现：定邀/普招 */}
      {(isPop || selectedSite?.directMailRule === "both") && (
        <div>
          <p className="mb-3 text-sm font-semibold text-black">入驻方式</p>
          <div className="flex flex-wrap gap-2">
            {inviteTypes.map((invite) => (
              <button
                key={invite.id}
                onClick={() => setInviteId(invite.id)}
                className={`border px-4 py-2 text-sm ${
                  inviteId === invite.id
                    ? "border-black bg-black text-white"
                    : "border-black text-black hover:bg-neutral-100"
                }`}
              >
                {invite.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 直邮模式下的规则说明 */}
      {directMailNote && (
        <p className="text-sm text-neutral-600">{directMailNote}</p>
      )}

      {/* 已选规格摘要 + CTA */}
      {summaryParts.length > 0 && (
        <div className="border-t border-black pt-6">
          <p className="text-sm text-neutral-500">已选规格</p>
          <p className="mt-1 text-lg font-bold text-black">
            {summaryParts.join(" · ")}
          </p>
          <Link
            href="/#social-contact"
            className={buttonVariants({
              size: "lg",
              className: "mt-4 bg-black text-white hover:bg-neutral-800",
            })}
          >
            咨询报价
          </Link>
        </div>
      )}
    </div>
  );
}
