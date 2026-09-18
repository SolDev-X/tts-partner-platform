import type {ReactNode} from "react";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

import {WorkspaceShell} from "@/components/dashboard/workspace-shell";
import {auth} from "@/lib/auth";

export default async function AdminLayout({children}: {children: ReactNode}) {
  const session = await auth.api.getSession({headers: await headers()});

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <WorkspaceShell variant="admin">{children}</WorkspaceShell>;
}
