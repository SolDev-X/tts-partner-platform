import type {Metadata} from "next";
import {CircleAlert, ExternalLink, Mail, ShieldCheck} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "隐私政策",
  description:
    "了解 SolDev 如何收集、使用、保存和保护您在使用跨境电商服务时提供的信息。",
};

const sections = [
  {id: "overview", title: "政策说明与适用范围"},
  {id: "collection", title: "我们如何收集信息"},
  {id: "information", title: "我们处理的信息"},
  {id: "sensitive", title: "敏感个人信息处理"},
  {id: "purpose", title: "处理目的与处理依据"},
  {id: "tiktok", title: "TikTok Shop 资料与账号权限"},
  {id: "sharing", title: "委托处理、共享与披露"},
  {id: "cross-border", title: "个人信息跨境传输"},
  {id: "cookies", title: "Cookie 与类似技术"},
  {id: "storage", title: "信息保存与安全保护"},
  {id: "rights", title: "您的个人信息权利"},
  {id: "minors", title: "未成年人保护"},
  {id: "updates", title: "政策更新与联系我们"},
];

const informationRows = [
  {
    scene: "咨询与联系",
    information: "公司或店铺名称、微信号或手机号、咨询类型、需求描述",
    purpose: "识别您的需求并与您取得联系",
  },
  {
    scene: "账户与网站服务",
    information: "姓名、邮箱、手机号、登录状态及账户安全记录",
    purpose: "在相关功能启用后创建账户、验证身份并保障账户安全",
  },
  {
    scene: "入驻及合规服务",
    information:
      "企业名称、营业执照、统一社会信用代码、经营类目、品牌及授权资料",
    purpose: "审核服务条件、整理申请材料并协助提交",
  },
  {
    scene: "身份与联系人核验",
    information: "法定代表人或联系人的姓名、联系方式及必要的身份证明资料",
    purpose: "满足平台审核要求并核实材料真实性",
  },
  {
    scene: "店铺服务",
    information: "TikTok Shop 店铺信息、申请记录及按需开通的子账号权限",
    purpose: "提供入驻、类目报白或店铺权限开通服务",
  },
  {
    scene: "网站运行与安全",
    information: "IP 地址、设备与浏览器信息、访问时间及操作日志",
    purpose: "维持网站运行、排查故障并防范安全风险",
  },
];

function PolicySection({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 space-y-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 font-mono text-sm text-muted-foreground">
          {String(index).padStart(2, "0")}
        </span>
        <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          {title}
        </h2>
      </div>
      <div className="space-y-4 pl-0 text-sm leading-7 text-muted-foreground md:pl-9 md:text-[15px]">
        {children}
      </div>
    </section>
  );
}

function PolicyList({children}: {children: React.ReactNode}) {
  return <ul className="space-y-2.5">{children}</ul>;
}

function PolicyListItem({children}: {children: React.ReactNode}) {
  return (
    <li className="flex gap-3">
      <span className="mt-[11px] size-1.5 shrink-0 rounded-full bg-foreground/50" />
      <span>{children}</span>
    </li>
  );
}

export default function PrivacyPage() {
  return (
    <main className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <header className="mb-12 max-w-3xl space-y-6 md:mb-16">
            <Badge variant="secondary">初版</Badge>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
                隐私政策
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                我们重视您的个人信息与企业资料安全。本政策说明 SolDev
                在提供跨境电商咨询及服务过程中，如何收集、使用、保存和保护相关信息。
              </p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span>最后更新：2026 年 8 月 3 日</span>
              <span>生效日期：2026 年 8 月 3 日</span>
            </div>
          </header>

          <div className="grid items-start gap-12 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
            <aside className="lg:sticky lg:top-24">
              <details className="group rounded-xl border bg-card p-4 lg:hidden">
                <summary className="cursor-pointer list-none font-medium">
                  查看政策目录
                </summary>
                <nav aria-label="隐私政策目录" className="mt-4 border-t pt-3">
                  {sections.map((section, index) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex gap-3 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <span className="font-mono text-xs opacity-60">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {section.title}
                    </a>
                  ))}
                </nav>
              </details>

              <nav
                aria-label="隐私政策目录"
                className="hidden border-l pl-5 lg:block"
              >
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  目录
                </p>
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block border-l-2 border-transparent py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </aside>

            <article className="min-w-0 space-y-12 md:space-y-16">
              <Card className="border-primary/20 bg-primary/[0.03] shadow-none">
                <CardContent className="flex gap-4 p-5 md:p-6">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">我们的基本原则</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      我们仅在提供服务所必需的范围内处理信息，不出售您的个人信息，
                      并通过合理的管理和技术措施保护相关资料。
                    </p>
                  </div>
                </CardContent>
              </Card>

              <PolicySection
                id="overview"
                index={1}
                title="政策说明与适用范围"
              >
                <p>
                  本政策由上海异步软件有限责任公司（旗下品牌“SolDev”，以下称“我们”）制定，
                  适用于您访问本网站、提交咨询、注册或使用账户，以及购买或使用我们提供的
                  TikTok Shop 入驻、类目报白、权限开通及其他跨境电商相关服务。
                </p>
                <p>
                  企业名称、营业执照等资料本身可能不属于个人信息；但其中包含的法定代表人、
                  联系人、实际控制人等自然人信息，仍将按照本政策进行保护。
                </p>
                <p>
                  如果您代表企业或向我们提交他人的个人信息，请确保您已获得相关个人的合法授权，
                  并已向其告知本政策所列事项。
                </p>
              </PolicySection>

              <Separator />

              <PolicySection id="collection" index={2} title="我们如何收集信息">
                <p>我们可能通过以下方式取得与服务有关的信息：</p>
                <PolicyList>
                  <PolicyListItem>
                    您主动填写咨询表单、注册账户、与客服沟通或购买服务时提交的信息；
                  </PolicyListItem>
                  <PolicyListItem>
                    您使用网站时，由服务器或必要的网站技术自动产生的信息；
                  </PolicyListItem>
                  <PolicyListItem>
                    经您授权，从您的企业、店铺协作者、TikTok Shop
                    或其他与服务相关的平台取得的信息；
                  </PolicyListItem>
                  <PolicyListItem>
                    在法律允许的范围内，从公开渠道取得并经合理核验的信息。
                  </PolicyListItem>
                </PolicyList>
              </PolicySection>

              <Separator />

              <PolicySection id="information" index={3} title="我们处理的信息">
                <p>
                  不同服务需要的信息不同。我们仅处理与您实际选择的功能或服务相关的信息：
                </p>
                <div className="overflow-hidden rounded-xl border">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px] text-left text-sm">
                      <thead className="bg-muted/70 text-foreground">
                        <tr>
                          <th className="w-[20%] px-4 py-3 font-medium">使用场景</th>
                          <th className="w-[45%] px-4 py-3 font-medium">信息类型</th>
                          <th className="px-4 py-3 font-medium">主要用途</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {informationRows.map((row) => (
                          <tr key={row.scene} className="align-top">
                            <td className="px-4 py-3.5 font-medium text-foreground">
                              {row.scene}
                            </td>
                            <td className="px-4 py-3.5">{row.information}</td>
                            <td className="px-4 py-3.5">{row.purpose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <p>
                  当某项信息并非提供基础服务所必需时，我们会在收集时另行说明，
                  您可以选择是否提供。拒绝提供非必要信息通常不会影响其他功能的使用。
                </p>
              </PolicySection>

              <Separator />

              <PolicySection id="sensitive" index={4} title="敏感个人信息处理">
                <div className="flex gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 text-foreground">
                  <CircleAlert className="mt-0.5 size-5 shrink-0 text-amber-600" />
                  <p className="text-sm leading-6">
                    身份证件影像、金融账户、店铺登录凭证及不满十四周岁未成年人的个人信息，
                    可能属于敏感个人信息。泄露或不当使用可能对人身、财产或账户安全造成影响。
                  </p>
                </div>
                <p>
                  我们仅在具有特定目的、充分必要性并采取严格保护措施的情况下处理敏感个人信息。
                  在法律要求时，我们会向您说明处理的必要性和可能影响，并取得您的单独同意。
                  若业务不再需要，我们将及时删除或匿名化处理。
                </p>
                <p>
                  请不要通过公开留言或其他不安全渠道发送身份证件、密码、验证码、支付信息等敏感资料。
                </p>
              </PolicySection>

              <Separator />

              <PolicySection id="purpose" index={5} title="处理目的与处理依据">
                <p>我们可能基于以下目的处理必要信息：</p>
                <PolicyList>
                  <PolicyListItem>响应咨询、确认需求并向您提供报价或方案；</PolicyListItem>
                  <PolicyListItem>订立和履行服务约定，推进材料准备、提交与审核；</PolicyListItem>
                  <PolicyListItem>管理账户、服务进度及售后沟通；</PolicyListItem>
                  <PolicyListItem>保障网站、账户和业务资料安全，处理争议或投诉；</PolicyListItem>
                  <PolicyListItem>履行法律法规规定的义务。</PolicyListItem>
                </PolicyList>
                <p>
                  我们将根据具体场景，基于您的同意、为订立或履行您作为一方当事人的合同所必需、
                  履行法定义务所必需，或法律法规允许的其他情形处理信息。
                  如处理目的、方式或信息种类发生实质变化，我们将依法重新告知并在必要时取得同意。
                </p>
              </PolicySection>

              <Separator />

              <PolicySection
                id="tiktok"
                index={6}
                title="TikTok Shop 资料与账号权限"
              >
                <p>
                  当您选择 TikTok Shop 相关服务时，我们会在服务范围内整理、核对并协助提交您提供的
                  企业资质、品牌授权、联系人、店铺及申请资料。最终审核结果由 TikTok Shop
                  根据其平台规则独立作出。
                </p>
                <p>
                  部分类目报白或权限开通服务可能需要您创建官方支持的店铺子账号。
                  我们只会使用完成约定事项所需的权限，不会利用该账号进行商品发布、资金操作或其他未获授权的活动。
                  服务完成后，您可以在平台后台收回权限或关闭子账号。
                </p>
                <p>
                  当资料提交至 TikTok Shop 后，TikTok Shop 将依据其自身规则独立处理相关信息，
                  建议您同时阅读其届时适用的隐私政策及卖家条款。
                </p>
              </PolicySection>

              <Separator />

              <PolicySection id="sharing" index={7} title="委托处理、共享与披露">
                <p>
                  我们不会出售或出租您的个人信息。为了提供服务，我们可能在必要范围内委托服务商处理信息，
                  或向下列接收方提供必要资料：
                </p>
                <PolicyList>
                  <PolicyListItem>
                    TikTok Shop 及与您所选服务直接相关的平台或官方服务渠道；
                  </PolicyListItem>
                  <PolicyListItem>
                    为网站运行提供支持的云计算、存储、安全及通信服务商；
                  </PolicyListItem>
                  <PolicyListItem>
                    在相关功能正式启用后，为交易提供服务的支付或担保平台；
                  </PolicyListItem>
                  <PolicyListItem>
                    根据法律法规、诉讼程序或行政、司法机关的合法要求需要披露的接收方。
                  </PolicyListItem>
                </PolicyList>
                <p>
                  我们会要求受托服务商按照约定的目的、期限、方式和安全要求处理信息。
                  如发生合并、分立、重组或资产转让并需要转移个人信息，我们将依法告知接收方信息，
                  并要求其继续履行相应保护义务。
                </p>
              </PolicySection>

              <Separator />

              <PolicySection id="cross-border" index={8} title="个人信息跨境传输">
                <p>
                  本网站的部分服务器或技术服务可能部署在中国香港地区；同时，为完成您委托的跨境电商服务，
                  部分必要资料可能被提供给位于中国大陆境外的 TikTok Shop 相关运营主体或技术服务商。
                  因此，相关处理可能构成个人信息出境。
                </p>
                <p>
                  对于需要出境的个人信息，我们将根据适用法律向您告知境外接收方、联系方式、处理目的、
                  处理方式、信息种类及您行使权利的渠道，并在适用时取得您的单独同意，履行个人信息保护影响评估、
                  标准合同备案或其他法定程序。具体信息以服务办理时向您提供的单独告知为准。
                </p>
              </PolicySection>

              <Separator />

              <PolicySection id="cookies" index={9} title="Cookie 与类似技术">
                <p>
                  为保障网站正常运行，我们可能使用必要的 Cookie、本地存储或类似技术，
                  用于维持登录状态、记住界面偏好、防范恶意请求及保持服务稳定。
                </p>
                <p>
                  您可以通过浏览器设置管理或删除 Cookie。禁用必要 Cookie
                  可能导致登录、主题偏好或部分网站功能无法正常使用。
                  如未来启用非必要的统计分析或广告技术，我们将更新本政策，并按适用要求提供选择机制。
                </p>
              </PolicySection>

              <Separator />

              <PolicySection id="storage" index={10} title="信息保存与安全保护">
                <p>
                  我们在实现本政策所述目的所需的最短期限内保存个人信息。
                  具体期限会结合服务周期、账户存续时间、售后与争议处理需要以及法律规定确定。
                  超出保存期限后，我们将删除或匿名化处理相关信息，法律法规另有要求的除外。
                </p>
                <p>
                  我们采取与风险相适应的安全措施，包括访问权限控制、安全传输、数据备份、人员管理和安全事件处置等，
                  尽力防止未经授权的访问、泄露、篡改、丢失或滥用。
                </p>
                <p>
                  互联网环境无法保证绝对安全。如发生或可能发生个人信息安全事件，
                  我们将依法采取补救措施，并通过站内通知、邮件、电话或其他适当方式向您告知。
                </p>
              </PolicySection>

              <Separator />

              <PolicySection id="rights" index={11} title="您的个人信息权利">
                <p>在适用法律规定的范围内，您可以联系我们提出以下请求：</p>
                <PolicyList>
                  <PolicyListItem>查阅、复制、更正或补充您的个人信息；</PolicyListItem>
                  <PolicyListItem>删除符合法定条件的个人信息；</PolicyListItem>
                  <PolicyListItem>撤回基于同意作出的授权；</PolicyListItem>
                  <PolicyListItem>注销账户，或限制、拒绝特定处理活动；</PolicyListItem>
                  <PolicyListItem>要求我们对个人信息处理规则作出解释说明；</PolicyListItem>
                  <PolicyListItem>就个人信息处理活动提出投诉或意见。</PolicyListItem>
                </PolicyList>
                <p>
                  为保障信息安全，我们可能需要先核验您的身份。我们将在收到请求后尽快处理并依法答复。
                  撤回同意不影响撤回前基于同意已经开展的处理活动。
                </p>
              </PolicySection>

              <Separator />

              <PolicySection id="minors" index={12} title="未成年人保护">
                <p>
                  我们的服务主要面向企业客户及具备完全民事行为能力的成年人，
                  不以不满十四周岁的未成年人为服务对象，也不会主动收集其个人信息。
                </p>
                <p>
                  如果您是未成年人的监护人，并发现未成年人未经适当授权向我们提供了个人信息，
                  请通过本政策所列方式联系我们。核实情况后，我们将依法采取删除等处理措施。
                </p>
              </PolicySection>

              <Separator />

              <PolicySection id="updates" index={13} title="政策更新与联系我们">
                <p>
                  我们可能根据法律法规、业务模式或网站功能的变化更新本政策。
                  更新后的版本将在本页面发布并标注新的更新日期；如变更可能对您的权利产生重大影响，
                  我们还会通过网站提示或其他适当方式进行通知。
                </p>

                <Card className="mt-6 shadow-none">
                  <CardContent className="space-y-4 p-5 md:p-6">
                    <div>
                      <p className="font-medium text-foreground">
                        上海异步软件有限责任公司
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        品牌名称：SolDev
                      </p>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      如需行使个人信息权利，或对本政策有任何问题、意见或投诉，
                      请通过以下方式与我们联系。请在邮件中注明“个人信息请求”，
                      并说明您的具体需求。
                    </p>
                    <a
                      href="mailto:wenyao.dev@gmail.com"
                      className="inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      <Mail className="size-4" />
                      wenyao.dev@gmail.com
                      <ExternalLink className="size-3.5 text-muted-foreground" />
                    </a>
                  </CardContent>
                </Card>
              </PolicySection>
            </article>
          </div>
        </div>
      </div>
    </main>
  );
}
