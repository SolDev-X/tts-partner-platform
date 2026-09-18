"use client";

import {usePathname} from "next/navigation";

import type {WorkspaceVariant} from "@/components/dashboard/workspace-variant";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function DashboardBreadcrumb({
  workspace = "customer",
}: {
  workspace?: WorkspaceVariant;
}) {
  const pathname = usePathname();
  const isAdmin = workspace === "admin";
  const ordersPath = isAdmin ? "/admin/orders" : "/dashboard/orders";
  const homePath = isAdmin ? "/admin" : "/dashboard";

  const pageTitle =
    pathname === ordersPath || pathname.startsWith(`${ordersPath}/`)
      ? isAdmin
        ? "订单"
        : "我的订单"
      : "概览";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href={homePath}>
            {isAdmin ? "管理后台" : "控制台"}
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator className="hidden md:block" />

        <BreadcrumbItem>
          <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
