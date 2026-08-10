import type {Metadata} from "next";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

import {LoginForm} from "@/components/auth/login-form";
import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export const metadata: Metadata = {
  title: "登录或注册 | 跨境服务平台",
  description: "使用手机号或邮箱登录或创建跨境服务平台账户。",
};

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    if (session.user.role === "ADMIN") {
      redirect("/admin/orders");
    }

    const account = await prisma.user.findUnique({
      where: {id: session.user.id},
      select: {onboardingRequired: true},
    });

    if (!account?.onboardingRequired) {
      redirect("/");
    }
  }

  const phoneAuthEnabled =
    process.env.NODE_ENV !== "production" ||
    process.env.PHONE_AUTH_ENABLED === "true";
  const emailOtpEnabled =
    process.env.NODE_ENV !== "production" ||
    process.env.EMAIL_OTP_ENABLED === "true";
  const googleAuthEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );

  return (
    <section className="flex min-h-[70svh] items-center bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <LoginForm
          phoneAuthEnabled={phoneAuthEnabled}
          emailOtpEnabled={emailOtpEnabled}
          googleAuthEnabled={googleAuthEnabled}
          initialAccountSetup={Boolean(session?.user.role === "CUSTOMER")}
        />
      </div>
    </section>
  );
}
