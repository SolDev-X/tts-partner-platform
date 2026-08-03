import type {Metadata} from "next";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";

export const metadata: Metadata = {
  title: "隐私政策",
};

const sections = [
  {id: "collect", title: "我们收集哪些信息"},
  {id: "purpose", title: "我们为什么收集这些信息"},
  {id: "storage", title: "信息的存储与保存期限"},
  {id: "share", title: "信息是否会分享给第三方"},
  {id: "transfer", title: "数据出境说明"},
  {id: "sensitive", title: "敏感个人信息的单独说明"},
  {id: "rights", title: "您的权利"},
  {id: "contact", title: "联系我们"},
];

export default function PrivacyPage() {
  return (
    <section className={cn("py-32")}>
      <div className="container mx-auto items-start">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[240px_1fr] lg:gap-16">
          {/* 左侧：标题 + 目录导航（桌面端吸顶） */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                隐私政策
              </h1>
              <p className="text-sm text-muted-foreground">
                最后更新日期：2026年8月3日
              </p>
            </div>
            <nav className="hidden space-y-1 border-l pl-4 lg:block">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>

          {/* 右侧：正文内容 */}
          <div className="max-w-2xl space-y-16">
            <p className="text-muted-foreground">
              本隐私政策说明我们在提供 TikTok Shop
              入驻代办、类目报白、权限开通等服务过程中，如何收集、使用、存储和保护您的个人信息。请您在使用我们的服务前仔细阅读本政策。
            </p>

            <div id="collect" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl font-semibold">我们收集哪些信息</h2>
              <p className="text-sm text-muted-foreground">
                为完成您委托的服务，我们可能会收集以下信息：
              </p>

              <div className="space-y-3">
                <p className="text-sm font-medium">基础联系信息</p>
                <ul className="space-y-2">
                  {["手机号", "邮箱地址"].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">企业与身份验证信息</p>
                <ul className="space-y-2">
                  {[
                    "营业执照照片",
                    "身份证正反面照片（法人配合人脸核验时）",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">店铺相关信息</p>
                <ul className="space-y-2">
                  {[
                    "店铺主体名称、主营类目",
                    "店铺 code、shop id",
                    "店铺子账号（用于协助登录后台提交材料）",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <PlaceholderNote>
                身份证信息属于《个人信息保护法》定义的敏感个人信息，本页面"敏感个人信息"章节的措辞需要律师重点核实。
              </PlaceholderNote>
            </div>

            <div id="purpose" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl font-semibold">我们为什么收集这些信息</h2>
              <p className="text-sm text-muted-foreground">
                我们收集上述信息，仅用于以下目的：
              </p>
              <ul className="space-y-2">
                {[
                  "协助您完成 TikTok Shop 店铺入驻申请",
                  "协助您完成类目报白资质审核与材料提交",
                  "协助您完成全类目权限开通与一品多仓布局申请",
                  "与您沟通服务进度、审核结果",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground">
                我们不会将这些信息用于上述目的以外的其他用途。
              </p>
            </div>

            <div id="storage" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl font-semibold">信息的存储与保存期限</h2>
              <p className="text-sm text-muted-foreground">
                您的信息将存储在 [此处填写实际使用的数据库/服务器名称]
                中。我们仅在为您提供服务、以及配合平台审核所必需的期限内保存这些信息，服务完成后，
                [此处填写实际的保留/删除策略]。
              </p>
              <PlaceholderNote>
                需要确认实际的数据保留期限，以及服务器/数据库的具体部署位置（境内还是境外）。
              </PlaceholderNote>
            </div>

            <div id="share" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl font-semibold">信息是否会分享给第三方</h2>
              <p className="text-sm text-muted-foreground">
                在为您办理服务的过程中，以下信息共享是必要的：
              </p>
              <ul className="space-y-2">
                {[
                  "为完成入驻、报白、权限开通申请，我们需要将相关材料提交给 TikTok Shop 平台官方审核系统",
                  "我们内部经办您业务的顾问、客服人员会在必要范围内接触您的材料，我们要求相关人员对您的信息严格保密",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground">
                除上述必要情形外，我们不会将您的个人信息出售、出租或以其他方式提供给无关的第三方。
              </p>
            </div>

            <div id="transfer" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl font-semibold">数据出境说明</h2>
              <p className="text-sm text-muted-foreground">
                [此处需要确认：服务器/数据库是否部署在中国大陆境外。如果是，需要明确告知信息出境的事实，并说明是否已签署个人信息出境标准合同或完成相应认证/评估。]
              </p>
              <PlaceholderNote important>
                这部分内容强烈建议由律师根据实际的服务器部署方案撰写，措辞不当可能构成未履行告知义务。
              </PlaceholderNote>
            </div>

            <div id="sensitive" className="space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">
                  敏感个人信息的单独说明
                </h2>
                <Badge variant="secondary">重要</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                您的身份证信息属于敏感个人信息。我们在向您收集此类信息前，会通过单独的确认方式征得您的同意；您有权拒绝提供，但这可能导致我们无法为您办理相关服务。我们承诺对您的身份证信息采取加密存储等必要的安全保护措施。
              </p>
            </div>

            <div id="rights" className="space-y-4 scroll-mt-24">
              <h2 className="text-xl font-semibold">您的权利</h2>
              <p className="text-sm text-muted-foreground">
                您对自己的个人信息享有以下权利：
              </p>
              <ul className="space-y-2">
                {[
                  "查询我们持有的您的哪些个人信息",
                  "要求更正不准确的信息",
                  "在符合法律规定的前提下，要求删除您的个人信息（例如服务已完结且不再有留存必要时）",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground">
                如需行使上述权利，请通过下方联系方式与我们联系，我们会在合理时间内处理您的请求。
              </p>
            </div>

            <div
              id="contact"
              className="scroll-mt-24 rounded-lg border bg-muted/40 p-4"
            >
              <h2 className="mb-2 text-sm font-semibold">联系我们</h2>
              <p className="text-sm text-muted-foreground">
                如您对本隐私政策或您的个人信息有任何疑问，请通过
                [此处填写实际的联系方式] 与我们联系。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const PlaceholderNote = ({
  children,
  important,
}: {
  children: React.ReactNode;
  important?: boolean;
}) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed p-3 text-xs text-muted-foreground",
        important && "border-destructive/40 bg-destructive/5",
      )}
    >
      {important ? "⚠️ " : ""}
      {children}
    </div>
  );
};
