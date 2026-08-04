"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {LoaderCircle} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {authClient} from "@/lib/auth-client";

const emailLoginSchema = z.object({
  email: z.string().trim().email("请输入有效的邮箱地址"),
  password: z
    .string()
    .min(8, "密码至少需要 8 位")
    .max(128, "密码不能超过 128 位"),
});

const phoneSchema = z.string().regex(/^1[3-9]\d{9}$/, "请输入有效的手机号");
const otpSchema = z.string().regex(/^\d{6}$/, "请输入 6 位数字验证码");

type EmailLoginValues = z.infer<typeof emailLoginSchema>;
type LoginMethod = "phone" | "email";

interface LoginFormProps {
  phoneAuthEnabled?: boolean;
}

export function LoginForm({phoneAuthEnabled = false}: LoginFormProps) {
  const [method, setMethod] = useState<LoginMethod>(
    phoneAuthEnabled ? "phone" : "email",
  );

  return (
    <Card className="mx-auto w-full max-w-md" variant="default">
      <CardHeader className="space-y-2 px-6 pt-7 sm:px-8 sm:pt-8">
        <CardTitle className="text-2xl">登录或注册</CardTitle>
        <CardDescription className="leading-6">
          选择手机号验证码或邮箱密码继续。
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-7 sm:px-8 sm:pb-8">
        {phoneAuthEnabled && (
          <div
            role="tablist"
            aria-label="登录方式"
            className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1"
          >
            <Button
              type="button"
              role="tab"
              aria-selected={method === "phone"}
              variant={method === "phone" ? "secondary" : "ghost"}
              className="w-full shadow-none"
              onClick={() => setMethod("phone")}
            >
              手机验证码
            </Button>
            <Button
              type="button"
              role="tab"
              aria-selected={method === "email"}
              variant={method === "email" ? "secondary" : "ghost"}
              className="w-full shadow-none"
              onClick={() => setMethod("email")}
            >
              邮箱密码
            </Button>
          </div>
        )}

        {method === "phone" && phoneAuthEnabled ? (
          <PhoneLoginFields />
        ) : (
          <EmailLoginFields />
        )}
      </CardContent>
    </Card>
  );
}

function PhoneLoginFields() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = window.setTimeout(() => {
      setCountdown((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown]);

  const fullPhoneNumber = `+86${phone}`;

  async function sendOtp() {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }

    setError(undefined);
    setIsSending(true);
    const {error: sendError} = await authClient.phoneNumber.sendOtp({
      phoneNumber: fullPhoneNumber,
    });
    setIsSending(false);

    if (sendError) {
      setError("验证码发送失败，请稍后重试。");
      return;
    }

    setOtpSent(true);
    setCountdown(60);
  }

  async function verifyOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = otpSchema.safeParse(otp);
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }

    setError(undefined);
    setIsVerifying(true);
    const {error: verifyError} = await authClient.phoneNumber.verify({
      phoneNumber: fullPhoneNumber,
      code: otp,
      disableSession: false,
      updatePhoneNumber: false,
    });
    setIsVerifying(false);

    if (verifyError) {
      setError("验证码无效或已过期，请重新获取。");
      return;
    }

    router.push("/");
    router.refresh();
  }

  function changePhoneNumber() {
    setOtpSent(false);
    setOtp("");
    setCountdown(0);
    setError(undefined);
  }

  return (
    <>
      <form onSubmit={verifyOtp} noValidate>
        <FieldGroup>
          <Field data-invalid={Boolean(error && !otpSent)}>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="phone">手机号</FieldLabel>
              {otpSent && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto p-0"
                  onClick={changePhoneNumber}
                >
                  更换手机号
                </Button>
              )}
            </div>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>+86</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={11}
                placeholder="请输入手机号"
                value={phone}
                disabled={otpSent}
                aria-invalid={Boolean(error && !otpSent)}
                onChange={(event) =>
                  setPhone(event.target.value.replace(/\D/g, "").slice(0, 11))
                }
              />
            </InputGroup>
          </Field>

          {otpSent && (
            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor="otp">验证码</FieldLabel>
              <Input
                id="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="请输入 6 位验证码"
                value={otp}
                aria-invalid={Boolean(error)}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  开发验证码请查看服务端终端。
                </p>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto shrink-0 p-0"
                  disabled={countdown > 0 || isSending}
                  onClick={sendOtp}
                >
                  {countdown > 0 ? `${countdown} 秒后重试` : "重新获取"}
                </Button>
              </div>
            </Field>
          )}

          <FieldError>{error}</FieldError>

          {otpSent ? (
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isVerifying}
            >
              {isVerifying && (
                <LoaderCircle className="animate-spin" aria-hidden="true" />
              )}
              {isVerifying ? "正在验证" : "确认并继续"}
            </Button>
          ) : (
            <Button
              type="button"
              size="lg"
              className="w-full"
              disabled={isSending}
              onClick={sendOtp}
            >
              {isSending && (
                <LoaderCircle className="animate-spin" aria-hidden="true" />
              )}
              {isSending ? "正在发送" : "发送验证码"}
            </Button>
          )}
        </FieldGroup>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        首次使用该手机号时，将自动为您创建账户。
      </p>
    </>
  );
}

function EmailLoginFields() {
  const router = useRouter();
  const form = useForm<EmailLoginValues>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: EmailLoginValues) {
    form.clearErrors("root");

    const {error} = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: true,
    });

    if (error) {
      form.setError("root", {
        message: "邮箱或密码错误，请重新检查。",
      });
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Field data-invalid={Boolean(form.formState.errors.email)}>
            <FieldLabel htmlFor="email">邮箱</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              aria-invalid={Boolean(form.formState.errors.email)}
              {...form.register("email")}
            />
            <FieldError errors={[form.formState.errors.email]} />
          </Field>

          <Field data-invalid={Boolean(form.formState.errors.password)}>
            <FieldLabel htmlFor="password">密码</FieldLabel>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="请输入密码"
              aria-invalid={Boolean(form.formState.errors.password)}
              {...form.register("password")}
            />
            <FieldError errors={[form.formState.errors.password]} />
          </Field>

          <FieldError errors={[form.formState.errors.root]} />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            )}
            {form.formState.isSubmitting ? "正在登录" : "登录"}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        还没有账户？{" "}
        <Link
          href="/register"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          立即注册
        </Link>
      </p>
    </>
  );
}
