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
  const session = await auth.api.getSession({headers: await headers()});

  if (session?.user.role === "ADMIN") redirect("/admin/orders");
  if (session?.user.role === "CUSTOMER") redirect("/account/orders");

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
}
