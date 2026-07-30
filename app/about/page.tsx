import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/kibo-ui/marquee";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

interface AboutProps {
  className?: string;
  title: string;
  description?: string;
  mainImage: {
    src: string;
    alt: string;
  };
  secondaryImage: {
    src: string;
    alt: string;
  };
  breakout: {
    src?: string;
    alt?: string;
    title: string;
    description: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  companies?: Array<{
    src: string;
    alt: string;
  }> | null;
  achievementsTitle?: string;
  achievementsDescription?: string;
  achievements?: Array<{
    label: string;
    value: string;
  }>;
  contentSections?: Array<{
    title: string;
    content: string;
  }>;
}

const About = ({
  className,
  title = "关于我们",
  description = "我们是一支专注跨境电商入驻与合规服务的团队,深耕行业多年,熟悉主流平台的入驻规则与审核标准,致力于帮助商家高效、稳妥地拓展海外市场。",
  mainImage = {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/annie-spratt-MChSQHxGZrQ-unsplash.jpg",
    alt: "about",
  },
  secondaryImage = {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/annie-spratt-AkftcHujUmk-unsplash.jpg",
    alt: "about",
  },
  breakout = {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg",
    alt: "logo",
    title: "为什么选择我们",
    description: "从资料准备到审核通过,专人全程跟进,让入驻流程更省心、更高效。",
    buttonText: "查看服务",
    buttonUrl: "/services",
  },

  achievementsTitle = "我们的服务数据",
  achievementsDescription = "用扎实的服务经验,帮助更多商家顺利拓展海外市场。",
  achievements = [
    {label: "服务卖家", value: "800+"},
    {label: "完成订单", value: "1000+"},
    {label: "客户满意度", value: "95%"},
    {label: "覆盖站点", value: "10+"},
  ],
  contentSections = [
    {
      title: "我们的理念",
      content:
        "跨境电商的规则复杂多变,从入驻申请到类目报白,每一个环节都可能因为一点疏漏而被驳回、耽误上线时间。\n\n我们成立的初衷,就是把这些繁琐的流程交给专业的人来处理,让商家可以把精力放在真正重要的事情上——做好产品、做好运营。\n\n我们相信,专业的服务能让出海这件事变得更简单、更顺畅。",
    },
    {
      title: "我们的团队",
      content:
        "我们的团队长期专注跨境电商入驻与合规服务,熟悉各平台最新的审核规则与变化,能第一时间响应政策调整带来的影响。\n\n从需求沟通、资料准备到审核跟进,我们全程陪伴,用专业和耐心,帮助每一位商家顺利完成入驻,快速开启海外市场之旅。",
    },
  ],
}: AboutProps) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto">
        <div className="mb-14 flex flex-col gap-5 lg:w-2/3">
          <h1 className="text-5xl font-semibold tracking-tighter lg:text-6xl">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            {description}
          </p>
        </div>
        <div className="grid gap-7 lg:grid-cols-3">
          <img
            src={mainImage.src}
            alt={mainImage.alt}
            className="size-full max-h-[620px] rounded-xl object-cover lg:col-span-2"
          />
          <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
            <div className="flex flex-col justify-between gap-6 rounded-xl bg-muted p-7 md:w-1/2 lg:w-auto">
              <img
                src={breakout.src}
                alt={breakout.alt}
                className="mr-auto h-12 dark:invert"
              />
              <div>
                <p className="mb-2 text-lg font-semibold">{breakout.title}</p>
                <p className="text-muted-foreground">{breakout.description}</p>
              </div>
              <Button
                variant="outline"
                className="mr-auto"
                render={<a href={breakout.buttonUrl} target="_blank" />}
                nativeButton={false}
              >
                {breakout.buttonText}
              </Button>
            </div>
            <img
              src={secondaryImage.src}
              alt={secondaryImage.alt}
              className="grow basis-0 rounded-xl object-cover md:w-1/2 lg:min-h-0 lg:w-auto"
            />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-muted p-7 md:p-16">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <h2 className="text-3xl font-medium md:text-4xl">
              {achievementsTitle}
            </h2>
            <p className="max-w-xl text-muted-foreground">
              {achievementsDescription}
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:flex md:flex-wrap md:justify-between">
            {achievements.map((item, idx) => (
              <div
                className="flex flex-col gap-2 text-center md:text-left"
                key={item.label + idx}
              >
                <span className="font-mono text-4xl font-semibold md:text-5xl">
                  {item.value}
                </span>
                <p className="text-sm md:text-base">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        {contentSections && contentSections.length > 0 && (
          <div className="mx-auto grid max-w-5xl gap-16 py-28 md:grid-cols-2 md:gap-28">
            {contentSections.map((section, idx) => (
              <div key={section.title + idx}>
                <h2 className="mb-5 text-4xl font-medium">{section.title}</h2>
                <p className="text-lg leading-7 whitespace-pre-line text-muted-foreground">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default About;
