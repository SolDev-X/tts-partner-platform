import type {ReactNode} from "react";

import {AppSidebar} from "@/components/dashboard/app-sidebar";
import {DashboardBreadcrumb} from "@/components/dashboard/dashboard-breadcrumb";
import type {WorkspaceVariant} from "@/components/dashboard/workspace-variant";
import {Separator} from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function WorkspaceShell({
  children,
  variant,
}: {
  children: ReactNode;
  variant: WorkspaceVariant;
}) {
  return (
    <SidebarProvider>
      <AppSidebar workspace={variant} />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />

            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />

            <DashboardBreadcrumb workspace={variant} />
          </div>
        </header>

        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
