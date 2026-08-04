"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {Eye, EyeOff, LoaderCircle, TriangleAlert} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {authClient} from "@/lib/auth-client";

const emailLoginSchema = z.object({
  email: z.string().trim().email("请输入有效的邮箱地址"),
  password: z
    .string()
    .min(8, "密码至少需要 8 位")
    .max(128, "密码不能超过 128 位"),
});

const phoneSchema = z.string().regex(/^1[3-9]\d{9}$/, "请输入有效的手机号");
const emailSchema = z.string().trim().toLowerCase().email();
const otpSchema = z.string().regex(/^\d{6}$/, "请输入 6 位数字验证码");

type EmailLoginValues = z.infer<typeof emailLoginSchema>;
type LoginMethod = "otp" | "password";
type OtpIdentifier = {
  type: "phone" | "email";
  value: string;
  display: string;
};

interface LoginFormProps {
  phoneAuthEnabled?: boolean;
  emailOtpEnabled?: boolean;
  googleAuthEnabled?: boolean;
}

export function LoginForm({
  phoneAuthEnabled = false,
  emailOtpEnabled = false,
  googleAuthEnabled = false,
}: LoginFormProps) {
  const otpAuthEnabled = phoneAuthEnabled || emailOtpEnabled;
  const [method, setMethod] = useState<LoginMethod>(
    otpAuthEnabled ? "otp" : "password",
  );
  const [isGooglePending, setIsGooglePending] = useState(false);
  const [googleError, setGoogleError] = useState<string>();

  async function signInWithGoogle() {
    setGoogleError(undefined);
    setIsGooglePending(true);

    const {error} = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    if (error) {
      setGoogleError("Google 登录暂时不可用，请稍后重试。");
      setIsGooglePending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          登录或注册
        </h1>
      </div>

      <Card className="mt-8" variant="default">
        <CardContent className="space-y-6 px-6 py-7 sm:px-8 sm:py-8">
          {googleAuthEnabled && (
            <>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                disabled={isGooglePending}
                onClick={signInWithGoogle}
              >
                {isGooglePending ? (
                  <LoaderCircle className="animate-spin" aria-hidden="true" />
                ) : (
                  <span
                    className="flex size-5 items-center justify-center rounded-full border text-xs font-semibold"
                    aria-hidden="true"
                  >
                    G
                  </span>
                )}
                {isGooglePending ? "正在前往 Google" : "使用 Google 继续"}
              </Button>

              <FieldError>{googleError}</FieldError>

              <div className="flex items-center gap-4" aria-hidden="true">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">或</span>
                <Separator className="flex-1" />
              </div>
            </>
          )}

          {method === "otp" && otpAuthEnabled ? (
            <IdentifierOtpFields
              phoneAuthEnabled={phoneAuthEnabled}
              emailOtpEnabled={emailOtpEnabled}
            />
          ) : (
            <EmailLoginFields />
          )}

          <div className="space-y-3 text-center text-sm">
            {otpAuthEnabled && (
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-muted-foreground"
                onClick={() =>
                  setMethod(method === "otp" ? "password" : "otp")
                }
              >
                {method === "otp"
                  ? "使用邮箱密码登录"
                  : "使用手机号或邮箱验证码登录"}
              </Button>
            )}
          </div>

          <p className="text-center text-xs leading-5 text-muted-foreground">
            继续即表示您已阅读并同意
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-foreground"
            >
              隐私政策
            </Link>
            。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function parseOtpIdentifier(identifier: string): OtpIdentifier | undefined {
  const normalizedIdentifier = identifier.trim();

  if (phoneSchema.safeParse(normalizedIdentifier).success) {
    return {
      type: "phone",
      value: `+86${normalizedIdentifier}`,
      display: normalizedIdentifier,
    };
  }

  const emailResult = emailSchema.safeParse(normalizedIdentifier);
  if (emailResult.success) {
    return {
      type: "email",
      value: emailResult.data,
      display: emailResult.data,
    };
  }
}

interface IdentifierOtpFieldsProps {
  phoneAuthEnabled: boolean;
  emailOtpEnabled: boolean;
}

function IdentifierOtpFields({
  phoneAuthEnabled,
  emailOtpEnabled,
}: IdentifierOtpFieldsProps) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [sentIdentifier, setSentIdentifier] = useState<OtpIdentifier>();
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = window.setTimeout(() => {
      setCountdown((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown]);

  async function sendOtp() {
    const parsedIdentifier = parseOtpIdentifier(identifier);
    if (!parsedIdentifier) {
      setError("请输入有效的手机号或邮箱地址。");
      return;
    }

    if (parsedIdentifier.type === "phone" && !phoneAuthEnabled) {
      setError("手机号验证码暂未开放，请使用邮箱继续。");
      return;
    }

    if (parsedIdentifier.type === "email" && !emailOtpEnabled) {
      setError("邮箱验证码暂未开放，请使用手机号继续。");
      return;
    }

    setError(undefined);
    setIsSending(true);
    const {error: sendError} =
      parsedIdentifier.type === "phone"
        ? await authClient.phoneNumber.sendOtp({
            phoneNumber: parsedIdentifier.value,
          })
        : await authClient.emailOtp.sendVerificationOtp({
            email: parsedIdentifier.value,
            type: "sign-in",
          });
    setIsSending(false);

    if (sendError) {
      setError("验证码发送失败，请稍后重试。");
      return;
    }

    setSentIdentifier(parsedIdentifier);
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

    if (!sentIdentifier) {
      setError("请先获取验证码。");
      return;
    }

    setError(undefined);
    setIsVerifying(true);
    const {error: verifyError} =
      sentIdentifier.type === "phone"
        ? await authClient.phoneNumber.verify({
            phoneNumber: sentIdentifier.value,
            code: otp,
            disableSession: false,
            updatePhoneNumber: false,
          })
        : await authClient.signIn.emailOtp({
            email: sentIdentifier.value,
            otp,
          });
    if (verifyError) {
      setIsVerifying(false);
      setError("验证码无效或已过期，请重新获取。");
      return;
    }

    const passwordStatusResponse = await fetch("/api/account/password");
    if (!passwordStatusResponse.ok) {
      setIsVerifying(false);
      setError("账户状态检查失败，请重新登录后再试。");
      return;
    }

    const passwordStatus = (await passwordStatusResponse.json()) as {
      hasPassword: boolean;
    };
    setIsVerifying(false);

    if (passwordStatus.hasPassword) {
      router.push("/");
      router.refresh();
      return;
    }

    setNeedsPassword(true);
    setError(undefined);
  }

  async function submitPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 8 || password.length > 128) {
      setError("密码长度需要为 8 至 128 位。");
      return;
    }

    setError(undefined);
    setIsSettingPassword(true);
    const response = await fetch("/api/account/password", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({password}),
    });
    setIsSettingPassword(false);

    if (!response.ok) {
      setError("密码设置失败，请稍后重试。");
      return;
    }

    router.push("/");
    router.refresh();
  }

  function changeIdentifier() {
    setOtpSent(false);
    setSentIdentifier(undefined);
    setOtp("");
    setCountdown(0);
    setNeedsPassword(false);
    setPassword("");
    setError(undefined);
  }

  if (needsPassword) {
    return (
      <form onSubmit={submitPassword} noValidate>
        <FieldGroup>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">设置登录密码</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              验证码已通过，请为该账户设置登录密码。
            </p>
          </div>

          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="new-password">密码</FieldLabel>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                placeholder="至少 8 位字符"
                className="pr-11"
                value={password}
                aria-invalid={Boolean(error)}
                onChange={(event) => setPassword(event.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
                aria-label={showPassword ? "隐藏密码" : "显示密码"}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" />
                ) : (
                  <Eye aria-hidden="true" />
                )}
              </Button>
            </div>
          </Field>

          <FieldError>{error}</FieldError>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSettingPassword}
          >
            {isSettingPassword && (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            )}
            {isSettingPassword ? "正在设置" : "设置密码并继续"}
          </Button>
        </FieldGroup>
      </form>
    );
  }

  if (otpSent && sentIdentifier) {
    return (
      <form onSubmit={verifyOtp} noValidate>
        <FieldGroup>
          <div className="text-center text-sm leading-6 text-muted-foreground sm:text-base">
            <p>请输入发送至以下账号的验证码</p>
            <p className="break-all font-medium text-foreground">
              {sentIdentifier.display}
            </p>
          </div>

          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="otp" className="sr-only">
              验证码
            </FieldLabel>
            <Input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              autoFocus
              placeholder="请输入验证码"
              className="h-14 text-center text-lg tracking-[0.18em] sm:text-xl"
              value={otp}
              aria-invalid={Boolean(error)}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
            />
          </Field>

          <FieldError>{error}</FieldError>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isVerifying}
          >
            {isVerifying && (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            )}
            {isVerifying ? "正在验证" : "验证并继续"}
          </Button>

          <div className="space-y-1 text-center text-sm text-muted-foreground">
            <p>
              没有收到验证码？{" "}
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-current"
                disabled={countdown > 0 || isSending}
                onClick={sendOtp}
              >
                {isSending
                  ? "正在发送"
                  : countdown > 0
                    ? `${countdown} 秒后重新发送`
                    : "重新发送"}
              </Button>
            </p>
            <p>
              账号有误？{" "}
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-current"
                onClick={changeIdentifier}
              >
                更换手机号或邮箱
              </Button>
            </p>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            开发验证码请查看服务端终端。
          </p>
        </FieldGroup>
      </form>
    );
  }

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void sendOtp();
        }}
        noValidate
      >
        <FieldGroup>
          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="identifier">手机号或邮箱</FieldLabel>
            <Input
              id="identifier"
              type="text"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="请输入手机号或邮箱"
              value={identifier}
              aria-invalid={Boolean(error)}
              onChange={(event) => setIdentifier(event.target.value)}
            />
          </Field>

          <FieldError>{error}</FieldError>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSending}
          >
            {isSending && (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            )}
            {isSending ? "正在发送" : "发送验证码"}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        未注册的手机号或邮箱验证后将自动创建账户。
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

        {form.formState.errors.root && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
          >
            <TriangleAlert
              className="mt-0.5 size-5 shrink-0"
              aria-hidden="true"
            />
            <div className="space-y-1 leading-4">
              <p>{form.formState.errors.root.message}</p>
              <p>
                还没有注册账号？{" "}
                <Link
                  href="/register"
                  className="font-medium underline underline-offset-4"
                >
                  前往注册账号
                </Link>
              </p>
            </div>
          </div>
        )}

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
  );
}
