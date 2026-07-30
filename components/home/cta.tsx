import {Button} from "@/components/ui/button";

import {cn} from "@/lib/utils";

interface Button {
  text: string;
  href: string;
  icon?: React.ReactNode;
}
interface Buttons {
  primary?: Button;
  secondary?: Button;
}

interface CtaSimpleProps {
  heading: string;
  description: string;
  buttons?: Buttons;
  className?: string;
}

type CtaProps = CtaSimpleProps;
type Props = Partial<CtaProps>;

const defaultProps: CtaProps = {
  heading: "入驻资料反复被拒？流程不用你自己摸索",
  description:
    "熟悉各平台审核规则与常见拒审原因，减少反复提交、被驳回浪费的时间成本。",
  buttons: {
    primary: {
      text: "团队介绍",
      href: "/contact",
    },
    secondary: {
      text: "查看服务",
      href: "#services",
    },
  },
};

const Cta = (props: Props) => {
  const {heading, description, buttons, className} = {
    ...defaultProps,
    ...props,
  };

  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto">
        <div className="mx-auto max-w-5xl rounded-lg bg-accent p-8 md:rounded-xl lg:p-12">
          <div className="flex flex-col gap-4 lg:gap-6">
            <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
              {heading}
            </h2>
            <p className="text-muted-foreground lg:text-lg">{description}</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-4">
              {buttons?.primary && (
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  render={<a href={buttons.primary.href} />}
                  nativeButton={false}
                >
                  {buttons.primary.text}
                </Button>
              )}
              {buttons?.secondary && (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  render={<a href={buttons.secondary.href} />}
                  nativeButton={false}
                >
                  {buttons.secondary.text}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
