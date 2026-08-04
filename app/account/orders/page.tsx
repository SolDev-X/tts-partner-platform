import type {Metadata} from "next";
import {headers} from "next/headers";
import Link from "next/link";
import {redirect} from "next/navigation";
import {PackageOpen} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {auth} from "@/lib/auth";

export const metadata: Metadata = {
  title: "我的订单 | 跨境服务平台",
  description: "查看您的跨境服务订单和办理进度。",
};

export default async function OrdersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">我的订单</h1>
        <p className="mt-2 text-muted-foreground">
          查看您的服务订单、付款状态和办理进度。
        </p>
      </div>

      <Card className="mt-8" variant="outline">
        <CardContent className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <PackageOpen className="size-5 text-muted-foreground" />
          </div>
          <h2 className="mt-5 text-lg font-medium">暂无订单</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            您提交或购买的服务订单将在这里显示。
          </p>
          <Button
            className="mt-6"
            nativeButton={false}
            render={<Link href="/#services" />}
          >
            浏览服务
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
