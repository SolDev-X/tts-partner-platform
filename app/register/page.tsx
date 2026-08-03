import type {Metadata} from "next";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

import {RegisterForm} from "@/components/auth/register-form";
import {auth} from "@/lib/auth";

export const metadata: Metadata = {
  title: "注册 | 跨境服务平台",
  description: "创建跨境服务平台账户。",
};

export default async function RegisterPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return (
    <section className="flex min-h-[70svh] items-center bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <RegisterForm />
      </div>
    </section>
  );
}
