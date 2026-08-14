import type {ReactNode} from "react";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

import {AppSidebar} from "@/components/dashboard/app-sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {Separator} from "@/components/ui/separator";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({headers: await headers()});

  if (!session) {
    redirect("/login");
  }

  const [actionRequired, processing] = await Promise.all([
    prisma.order.count({
      where: {
        user: {
          is: {
            id: session.user.id,
          },
        },
        status: {
          in: ["PENDING_PAYMENT", "WAITING_FOR_CUSTOMER"],
        },
      },
    }),
    prisma.order.count({
      where: {
        user: {
          is: {
            id: session.user.id,
          },
        },
        status: {
          in: ["PENDING_CONFIRMATION", "PROCESSING", "REFUNDING"],
        },
      },
    }),
  ]);

  return (
    <SidebarProvider>
      <AppSidebar
        orderCounts={{
          actionRequired,
          processing,
        }}
      />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />

            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">控制台</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="hidden md:block" />

                <BreadcrumbItem>
                  <BreadcrumbPage>概览</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
