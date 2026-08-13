"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {
  LoaderCircle,
  MessageCircle,
  Smartphone,
  TriangleAlert,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {authClient} from "@/lib/auth-client";

export function SignupForm({className, ...props}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sentEmail, setSentEmail] = useState<string>();
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = window.setTimeout(() => {
      setCountdown((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown]);

  function normalizeEmail() {
    return email.trim().toLowerCase();
  }

  async function sendVerificationCode() {
    const normalizedEmail = normalizeEmail();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError("请输入有效的邮箱地址。");
      return;
    }

    setError(undefined);
    setIsSending(true);
    const {error: sendError} =
      await authClient.emailOtp.sendVerificationOtp({
        email: normalizedEmail,
        type: "sign-in",
      });
    setIsSending(false);

    if (sendError) {
      setError("验证码发送失败，请稍后重试。");
      return;
    }

    setSentEmail(normalizedEmail);
    setCountdown(60);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = normalizeEmail();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError("请输入有效的邮箱地址。");
      return;
    }

    if (!sentEmail || sentEmail !== normalizedEmail) {
      setError("请先向当前邮箱发送验证码。");
      return;
    }

    if (!/^\d{6}$/.test(verificationCode)) {
      setError("请输入 6 位数字验证码。");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      setError("密码长度需要为 8 至 128 位。");
      return;
    }

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致。");
      return;
    }

    setError(undefined);
    setIsSubmitting(true);

    const {error: verifyError} = await authClient.signIn.emailOtp({
      email: normalizedEmail,
      otp: verificationCode,
      name: "新客户",
    });

    if (verifyError) {
      setIsSubmitting(false);
      setError("验证码无效或已过期，请重新获取。");
      return;
    }

    const roleResponse = await fetch("/api/account/role");
    const roleResult = roleResponse.ok
      ? ((await roleResponse.json()) as {role?: string})
      : undefined;

    if (roleResult?.role !== "CUSTOMER") {
      await authClient.signOut();
      setIsSubmitting(false);
      setError("该邮箱无法注册客户账户，请使用其他邮箱。");
      return;
    }

    const passwordStatusResponse = await fetch("/api/account/password");
    const passwordStatus = passwordStatusResponse.ok
      ? ((await passwordStatusResponse.json()) as {needsOnboarding?: boolean})
      : undefined;

    if (!passwordStatus?.needsOnboarding) {
      await authClient.signOut();
      setIsSubmitting(false);
      setError("该邮箱已注册，请直接登录。");
      return;
    }

    const passwordResponse = await fetch("/api/account/password", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({password, companyName: "新客户"}),
    });

    if (!passwordResponse.ok) {
      await authClient.signOut();
      setIsSubmitting(false);
      setError("账户创建失败，请稍后重试。");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 md:min-h-[34rem]">
        <CardContent className="grid h-full p-0 md:grid-cols-2">
          <form
            className="flex h-full items-center p-6 md:p-10"
            onSubmit={handleSubmit}
            noValidate
          >
            <FieldGroup className="gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">创建您的账户</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  输入邮箱以创建您的账户
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email" className="text-sm">
                  邮箱
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入邮箱"
                  className="h-10 px-3"
                  autoComplete="email"
                  value={email}
                  aria-invalid={Boolean(error)}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError(undefined);
                  }}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email-code" className="text-sm">
                  邮箱验证码
                </FieldLabel>
                <div className="flex gap-3">
                  <Input
                    id="email-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="请输入验证码"
                    className="h-10 px-3"
                    maxLength={6}
                    value={verificationCode}
                    aria-invalid={Boolean(error)}
                    onChange={(event) =>
                      setVerificationCode(event.target.value.replace(/\D/g, ""))
                    }
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 shrink-0 px-4"
                    disabled={isSending || countdown > 0 || isSubmitting}
                    onClick={sendVerificationCode}
                  >
                    {isSending && (
                      <LoaderCircle className="animate-spin" aria-hidden="true" />
                    )}
                    {isSending
                      ? "正在发送"
                      : countdown > 0
                        ? `${countdown} 秒后重发`
                        : "发送验证码"}
                  </Button>
                </div>
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password" className="text-sm">
                      密码
                    </FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      className="h-10 px-3"
                      autoComplete="new-password"
                      value={password}
                      aria-invalid={Boolean(error)}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password" className="text-sm">
                      确认密码
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      className="h-10 px-3"
                      autoComplete="new-password"
                      value={confirmPassword}
                      aria-invalid={Boolean(error)}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      required
                    />
                  </Field>
                </Field>
              </Field>
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive"
                >
                  <TriangleAlert
                    className="mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <p>{error}</p>
                </div>
              )}
              <Field>
                <Button type="submit" className="h-10" disabled={isSubmitting}>
                  {isSubmitting && (
                    <LoaderCircle className="animate-spin" aria-hidden="true" />
                  )}
                  {isSubmitting ? "正在创建" : "创建账户"}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card text-xs">
                或使用以下方式继续
              </FieldSeparator>
              <Field className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button" className="h-10">
                  <MessageCircle aria-hidden="true" />
                  <span className="sr-only">使用微信注册</span>
                </Button>
                <Button variant="outline" type="button" className="h-10">
                  <Smartphone aria-hidden="true" />
                  <span className="sr-only">使用手机号注册</span>
                </Button>
                <Button variant="outline" type="button" className="h-10">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">使用 Google 注册</span>
                </Button>
              </Field>
              <FieldDescription className="text-center text-xs">
                已有账户？<Link href="/login">立即登录</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/placeholder.png"
              alt="注册页面配图"
              fill
              sizes="(min-width: 768px) 50vw, 0px"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-xs">
        继续即表示您同意我们的<a href="#">服务条款</a>和
        <Link href="/privacy">隐私政策</Link>。
      </FieldDescription>
    </div>
  );
}
