"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {ExternalLinkIcon, LoaderIcon, MailIcon} from "lucide-react";
import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import Image from "next/image";
import {cn} from "@/lib/utils";

interface ContactFormDetailsProps {
  title: string;
  description: string;
  email: string;
  formSubheading: string;
  formHeading: string;
  successMessage: string;
  submitLabel: string;
  submittingLabel: string;
  className?: string;
}

interface ContactProps extends ContactFormDetailsProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
}
type Props = Partial<ContactProps>;

const defaultProps: ContactProps = {
  title: "联系我们",
  description:
    "专注跨境电商店铺入驻与权限代办服务，如有任何疑问，欢迎随时与我们联系。",
  email: "wenyao.dev@gmail.com",
  formSubheading: "我们通常会在当天内回复您。",
  formHeading: "留下您的需求",
  successMessage: "感谢您的留言，我们已收到，会尽快与您联系。",
  submitLabel: "提交",
  submittingLabel: "提交中…",
};

const contactFormSchema = z.object({
  companyName: z.string().min(1, "请填写公司/店铺名称"),
  contact: z.string().min(1, "请填写联系方式"),
  subject: z.string().min(1, "请填写咨询类型"),
  message: z.string().min(1, "请填写需求描述"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const Contact = (props: Props) => {
  const {
    title,
    description,
    email,
    formHeading,
    formSubheading,
    successMessage,
    submitLabel,
    submittingLabel,
    className,
    onSubmit,
  } = {...defaultProps, ...props};

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      companyName: "",
      contact: "",
      subject: "",
      message: "",
    },
  });

  const handleFormSubmit = async (data: ContactFormData) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        console.log("Form submitted:", data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      setIsSubmitted(true);
      setShowSuccess(true);
      form.reset();
      setTimeout(() => setShowSuccess(false), 4500);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch {
      form.setError("root", {
        message: "提交失败，请重试。",
      });
    }
  };

  return (
    <section className={cn("py-68", className)}>
      <div className="container mx-auto items-center">
        <div className="flex flex-col gap-16 lg:flex-row lg:gap-24">
          <div className="flex flex-1 flex-col gap-10">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-semibold tracking-tight text-pretty md:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="text-muted-foreground lg:text-xl lg:text-balance">
                {description}
              </p>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h2 className="font-semibold">企业微信咨询.</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    扫码添加服务顾问
                  </p>
                  <div className="mt-4 w-fit rounded-lg border bg-white p-2">
                    <Image
                      src="/QRcode/wechatQRcode.jpg"
                      alt="企业微信咨询二维码"
                      width={148}
                      height={148}
                      className="size-37"
                    />
                  </div>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    通常当天回复
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold">闲鱼平台下单.</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    查看服务并通过平台交易
                  </p>
                  <div className="mt-4 w-fit rounded-lg border bg-white">
                    <Image
                      src="/QRcode/xianyuQRcode.jpg"
                      alt="闲鱼主页二维码"
                      width={148}
                      height={148}
                      className="size-37"
                    />
                  </div>
                  <Button
                    variant="link"
                    className="mt-2 h-auto p-0 text-sm"
                    nativeButton={false}
                    render={
                      <a
                        href="https://m.tb.cn/h.8STM0HG?tk=y9twTZcE8jl"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    前往闲鱼下单
                    <ExternalLinkIcon aria-hidden />
                  </Button>
                </div>
              </div>

              <div className="mt-7 border-t pt-5">
                <a
                  href={`mailto:${email}`}
                  className="group inline-flex items-center gap-3 text-sm"
                >
                  <MailIcon className="size-5 text-muted-foreground" />
                  <span className="font-medium">邮件联系</span>
                  <span className="text-muted-foreground group-hover:underline">
                    {email}
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="flex flex-col gap-6 rounded-xl bg-muted/50 p-8 md:p-10"
            >
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold tracking-tight text-balance">
                  {formHeading}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {formSubheading}
                </p>
              </div>
              {isSubmitted && (
                <div
                  role="status"
                  aria-live="polite"
                  className={cn(
                    "rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-center transition-opacity duration-500",
                    showSuccess ? "opacity-100" : "opacity-0",
                  )}
                >
                  <p className="text-sm font-medium text-green-600">
                    {successMessage}
                  </p>
                </div>
              )}
              <FieldGroup className="gap-6">
                <Controller
                  control={form.control}
                  name="companyName"
                  render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        公司/店铺名称{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="请填写您的公司或店铺名称"
                        className="bg-background"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="contact"
                  render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        联系方式（微信/手机号）{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="+86 188 8888 8888"
                        className="bg-background"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="subject"
                  render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        咨询类型 <span className="text-destructive">*</span>
                      </FieldLabel>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex items-center gap-5"
                      >
                        <FieldLabel
                          htmlFor="subject-seller"
                          className="flex items-center gap-2 rounded-lg border p-3 text-sm font-normal cursor-pointer has-data-[state=checked]:border-primary"
                        >
                          <RadioGroupItem value="seller" id="subject-seller" />
                          店铺商家
                        </FieldLabel>
                        <FieldLabel
                          htmlFor="subject-agent"
                          className="flex items-center gap-2 rounded-lg border p-3 text-sm font-normal cursor-pointer has-data-[state=checked]:border-primary"
                        >
                          <RadioGroupItem value="agent" id="subject-agent" />
                          代理/合作伙伴
                        </FieldLabel>
                      </RadioGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="message"
                  render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        需求描述 <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="请简单描述您的店铺情况和需求…"
                        rows={4}
                        className="bg-background"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                {form.formState.errors.root && (
                  <p className="text-sm text-destructive">提交失败，请重试。</p>
                )}
                <Button
                  size="lg"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <LoaderIcon className="size-4 animate-spin" aria-hidden />
                  ) : null}
                  {form.formState.isSubmitting ? submittingLabel : submitLabel}
                </Button>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
