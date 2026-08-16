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
import {LayoutDashboard, Package} from "lucide-react";

type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

export function AppSidebar(props: AppSidebarProps) {
  const navMain = [
    {
      title: "概览",
      url: "/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      title: "我的订单",
      url: "/dashboard/orders",
      icon: <Package />,
    },
  ];

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
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
