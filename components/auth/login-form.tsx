"use client";

import {useState} from "react";
import {LoaderCircle, MessageCircle, Smartphone, TriangleAlert} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";

import {cn} from "@/lib/utils";
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

export function LoginForm({className, ...props}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loginType, setLoginType] = useState<"customer" | "admin">("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError("请输入有效的邮箱地址。");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      setError("密码长度需要为 8 至 128 位。");
      return;
    }

    setError(undefined);
    setIsSubmitting(true);

    const {error: signInError} = await authClient.signIn.email({
      email: normalizedEmail,
      password,
      rememberMe: true,
    });

    if (signInError) {
      setIsSubmitting(false);
      setError("邮箱或密码错误，请重新检查。");
      return;
    }

    const roleResponse = await fetch("/api/account/role");
    const roleResult = roleResponse.ok
      ? ((await roleResponse.json()) as {role?: string})
      : undefined;
    const expectedRole = loginType === "admin" ? "ADMIN" : "CUSTOMER";

    if (roleResult?.role !== expectedRole) {
      await authClient.signOut();
      setIsSubmitting(false);
      setError(
        loginType === "admin"
          ? "该账号不是管理员，请使用客户登录。"
          : "该账号为管理员，请使用管理员登录入口。",
      );
      return;
    }

    router.push(loginType === "admin" ? "/admin/orders" : "/");
    router.refresh();
  }

  function changeLoginType(type: "customer" | "admin") {
    setLoginType(type);
    setError(undefined);
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
              <div className="grid grid-cols-2 rounded-lg bg-muted p-1">
                <Button
                  type="button"
                  variant={loginType === "customer" ? "default" : "ghost"}
                  className="h-7 w-full text-xs"
                  onClick={() => changeLoginType("customer")}
                  disabled={isSubmitting}
                >
                  客户登录
                </Button>
                <Button
                  type="button"
                  variant={loginType === "admin" ? "default" : "ghost"}
                  className="h-7 w-full text-xs"
                  onClick={() => changeLoginType("admin")}
                  disabled={isSubmitting}
                >
                  管理员登录
                </Button>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  {loginType === "admin" ? "管理员登录" : "欢迎回来"}
                </h1>
                <p className="text-balance text-muted-foreground">
                  {loginType === "admin"
                    ? "登录平台管理后台"
                    : "登录您的跨境服务平台账户"}
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
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-sm">
                    密码
                  </FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-xs underline-offset-2 hover:underline"
                  >
                    忘记密码？
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  className="h-10 px-3"
                  autoComplete="current-password"
                  value={password}
                  aria-invalid={Boolean(error)}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </Field>
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive"
                >
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <p>{error}</p>
                </div>
              )}
              <Field>
                <Button type="submit" className="h-10" disabled={isSubmitting}>
                  {isSubmitting && (
                    <LoaderCircle className="animate-spin" aria-hidden="true" />
                  )}
                  {isSubmitting
                    ? "正在登录"
                    : loginType === "admin"
                      ? "管理员登录"
                      : "登录"}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card text-xs">
                或使用以下方式继续
              </FieldSeparator>
              <Field className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button" className="h-10">
                  <MessageCircle aria-hidden="true" />
                  <span className="sr-only">使用微信登录</span>
                </Button>
                <Button variant="outline" type="button" className="h-10">
                  <Smartphone aria-hidden="true" />
                  <span className="sr-only">使用手机号登录</span>
                </Button>
                <Button variant="outline" type="button" className="h-10">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">使用 Google 登录</span>
                </Button>
              </Field>
              <FieldDescription className="text-center text-xs">
                还没有账户？<Link href="/signup">立即注册</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/placeholder.png"
              alt="登录页面配图"
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
