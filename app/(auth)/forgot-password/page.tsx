"use client";

import {LoaderCircle, TriangleAlert} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";

import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    const normalizedEmail = email.trim().toLowerCase();
    if (!emailPattern.test(normalizedEmail)) {
      setError("请输入有效的邮箱地址。");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          email: normalizedEmail,
          redirectTo: `${window.location.origin}/reset-password`,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to request password reset");
      }

      setIsSent(true);
    } catch {
      setError("重置邮件暂时发送失败，请稍后再试。");
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
              重置密码
            </h1>
          </div>

          <Card className="mt-8">
            <CardContent className="px-6 py-7 sm:px-8 sm:py-8">
              {isSent ? (
                <div className="space-y-5 text-center">
                  <h2 className="text-xl font-semibold">请检查您的邮箱</h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    如果该邮箱已注册，我们已发送密码重置链接。链接将在 1
                    小时后失效。
                  </p>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => router.push("/login")}
                  >
                    返回登录
                  </Button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <FieldGroup>
                    <p className="text-sm leading-6 text-muted-foreground">
                      输入已绑定的邮箱，我们将向您发送密码重置链接。手机号账号暂不支持自助找回。
                    </p>
                    <Field data-invalid={Boolean(error)}>
                      <FieldLabel htmlFor="reset-email">邮箱</FieldLabel>
                      <Input
                        id="reset-email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        autoCapitalize="none"
                        spellCheck={false}
                        placeholder="name@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        aria-invalid={Boolean(error)}
                      />
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
                      {isSubmitting ? "正在发送" : "发送重置链接"}
                    </Button>
                  </FieldGroup>
                </form>
              )}
            </CardContent>
          </Card>

          {!isSent && (
            <p className="mt-5 flex items-start gap-2 text-center text-xs leading-5 text-muted-foreground">
              <TriangleAlert
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              为保护账号安全，我们不会显示该邮箱是否已注册。
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
