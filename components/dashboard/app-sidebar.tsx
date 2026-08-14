"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import {NavMain} from "@/components/dashboard/nav-main";
import {NavUser} from "@/components/dashboard/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {LayoutDashboard, ShoppingBag} from "lucide-react";

// TODO: user 先用占位数据，接入真实登录用户后替换成 session 里的 name/email/image
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "概览",
      url: "/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      title: "我的订单",
      url: "/dashboard/orders",
      icon: <ShoppingBag />,
      isActive: true,
      // 订单筛选做成子菜单，对应 /dashboard/orders 页面里的状态筛选
      items: [
        {title: "全部", url: "/dashboard/orders"},
        {title: "待我处理", url: "/dashboard/orders?status=pending"},
        {title: "办理中", url: "/dashboard/orders?status=processing"},
        {title: "已完成", url: "/dashboard/orders?status=done"},
        {title: "已取消", url: "/dashboard/orders?status=cancelled"},
      ],
    },
  ],
};

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/" />}
              className="flex items-center gap-1.5 group-data-[collapsible=icon]:justify-center"
            >
              <Image
                src="/vercel.svg"
                alt="跨境服务平台"
                width={20}
                height={20}
                className="shrink-0"
              />

              <span className="truncate text-base font-bold lg:text-xl group-data-[collapsible=icon]:hidden">
                跨境服务平台
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
