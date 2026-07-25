import {OnboardingSelector} from "@/components/services/onboarding-selector";
import Image from "next/image";

const screenshots = [""];

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-12 md:grid-cols-[2fr_3fr]">
        {/* 左侧 */}

        <div className="grid grid-cols-2 gap-4">
          {screenshots.map((src) => (
            <div
              key={src}
              className="relative aspect-square overflow-hidden border border-black"
            >
              <Image
                src={src}
                alt="服务示例截图"
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* 右侧 */}
        <div>
          <h1 className="text-3xl font-bold text-black">定邀/普招代入驻</h1>
          <p className="mt-3 text-neutral-600">
            协助店铺完成定向邀约邀请码入驻/普招入驻申请流程，覆盖多站点，按平台规范提交资料。
          </p>

          <div className="mt-8">
            <OnboardingSelector />
          </div>
        </div>
      </div>

      {/* 下方通栏内容，之后加：服务详情/流程/FAQ */}
    </div>
  );
}
