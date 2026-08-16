"use client";

import {usePathname} from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function DashboardBreadcrumb() {
  const pathname = usePathname();

  const pageTitle =
    pathname === "/dashboard/orders" ||
    pathname.startsWith("/dashboard/orders/")
      ? "我的订单"
      : "概览";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/dashboard">控制台</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator className="hidden md:block" />

        <BreadcrumbItem>
          <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
