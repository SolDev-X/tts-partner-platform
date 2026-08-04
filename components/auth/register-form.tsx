"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {LoaderCircle} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";
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
import {authClient} from "@/lib/auth-client";

const registerSchema = z
  .object({
    email: z.string().trim().email("请输入有效的邮箱地址"),
    password: z
      .string()
      .min(8, "密码至少需要 8 位")
      .max(128, "密码不能超过 128 位"),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterValues) {
    form.clearErrors("root");

    const {error} = await authClient.signUp.email({
      name: values.email.split("@")[0]?.slice(0, 50) || "用户",
      email: values.email,
      password: values.password,
    });

    if (error) {
      form.setError("root", {
        message:
          error.status === 422
            ? "该邮箱已注册，请直接登录。"
            : "注册失败，请稍后重试。",
      });
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <Card className="mx-auto w-full max-w-md" variant="default">
      <CardHeader className="space-y-2 px-6 pt-7 sm:px-8 sm:pt-8">
        <CardTitle className="text-2xl">邮箱注册</CardTitle>
        <CardDescription className="leading-6">
          使用邮箱和密码创建账户。
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-7 sm:px-8 sm:pb-8">
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={Boolean(form.formState.errors.email)}>
              <FieldLabel htmlFor="register-email">邮箱</FieldLabel>
              <Input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                aria-invalid={Boolean(form.formState.errors.email)}
                {...form.register("email")}
              />
              <FieldError errors={[form.formState.errors.email]} />
            </Field>

            <Field data-invalid={Boolean(form.formState.errors.password)}>
              <FieldLabel htmlFor="register-password">密码</FieldLabel>
              <Input
                id="register-password"
                type="password"
                autoComplete="new-password"
                placeholder="至少 8 位字符"
                aria-invalid={Boolean(form.formState.errors.password)}
                {...form.register("password")}
              />
              <FieldError errors={[form.formState.errors.password]} />
            </Field>

            <Field
              data-invalid={Boolean(form.formState.errors.confirmPassword)}
            >
              <FieldLabel htmlFor="confirm-password">确认密码</FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                placeholder="请再次输入密码"
                aria-invalid={Boolean(form.formState.errors.confirmPassword)}
                {...form.register("confirmPassword")}
              />
              <FieldError errors={[form.formState.errors.confirmPassword]} />
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
              {form.formState.isSubmitting ? "正在注册" : "注册"}
            </Button>
          </FieldGroup>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          已有邮箱账户？{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            前往登录
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
