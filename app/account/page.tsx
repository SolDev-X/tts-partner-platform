import type {Metadata} from "next";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

import {ProfileSettings} from "@/components/account/profile-settings";
import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export const metadata: Metadata = {
  title: "个人中心 | 跨境服务平台",
  description: "管理您的跨境服务平台账户信息和登录密码。",
};

export default async function AccountPage() {
  const session = await auth.api.getSession({headers: await headers()});
  if (!session) redirect("/login");

  const [user, credentialAccount] = await Promise.all([
    prisma.user.findUnique({
      where: {id: session.user.id},
      select: {
        name: true,
        email: true,
        emailVerified: true,
        phoneNumber: true,
        phoneNumberVerified: true,
      },
    }),
    prisma.account.findFirst({
      where: {
        userId: session.user.id,
        providerId: "credential",
        password: {not: null},
      },
      select: {id: true},
    }),
  ]);

  if (!user) redirect("/login");

  return (
    <section className="bg-muted/30 py-12 md:py-16">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">个人中心</h1>
          <p className="mt-2 text-muted-foreground">管理账户信息与登录安全。</p>
        </div>
        <ProfileSettings {...user} hasPassword={Boolean(credentialAccount)} />
      </div>
    </section>
  );
}
