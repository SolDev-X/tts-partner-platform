"use client";

import {Eye, EyeOff, LoaderCircle} from "lucide-react";
import {useRouter, useSearchParams} from "next/navigation";
import {Suspense, useState} from "react";

import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    if (!token) {
      setError("重置链接无效或已过期，请重新申请。");
      return;
    }
    if (password.length < 8 || password.length > 128) {
      setError("密码长度需为 8 到 128 位。");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({token, newPassword: password}),
      });

      if (!response.ok) {
        throw new Error("Unable to reset password");
      }

      setIsComplete(true);
      window.setTimeout(() => router.push("/login"), 1200);
    } catch {
      setError("重置链接无效或已过期，请重新申请。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="flex min-h-[70svh] items-center bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              设置新密码
            </h1>
          </div>

          <Card className="mt-8">
            <CardContent className="px-6 py-7 sm:px-8 sm:py-8">
              {isComplete ? (
                <div className="space-y-5 text-center">
                  <h2 className="text-xl font-semibold">密码已重置</h2>
                  <p className="text-sm text-muted-foreground">
                    正在返回登录页。
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <FieldGroup>
                    <Field data-invalid={Boolean(error)}>
                      <FieldLabel htmlFor="new-password">新密码</FieldLabel>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="至少 8 位字符"
                          className="pr-11"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          aria-invalid={Boolean(error)}
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
                      <FieldError>{error}</FieldError>
                    </Field>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && (
                        <LoaderCircle
                          className="animate-spin"
                          aria-hidden="true"
                        />
                      )}
                      {isSubmitting ? "正在重置" : "确认重置密码"}
                    </Button>
                    <Button
                      type="button"
                      variant="link"
                      className="text-muted-foreground"
                      onClick={() => router.push("/forgot-password")}
                    >
                      重新获取链接
                    </Button>
                  </FieldGroup>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
