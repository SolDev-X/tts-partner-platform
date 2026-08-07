import type {Metadata} from "next";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

import {LoginForm} from "@/components/auth/login-form";
import {auth} from "@/lib/auth";

export const metadata: Metadata = {
  title: "登录 | 跨境服务平台",
  description: "登录跨境服务平台账户。",
};

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect(session.user.role === "ADMIN" ? "/admin/orders" : "/");
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
        />
      </div>
    </section>
  );
}
