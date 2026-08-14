"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";

import {
  BellIcon,
  ChevronsUpDownIcon,
  LoaderCircle,
  LogOutIcon,
  UserRoundIcon,
} from "lucide-react";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {authClient} from "@/lib/auth-client";

export function NavUser() {
  const {isMobile} = useSidebar();
  const router = useRouter();

  const {data: session, isPending} = authClient.useSession();

  const [isSigningOut, setIsSigningOut] = useState(false);

  const user = session?.user;

  const initials = (user?.name || user?.email || "用户")
    .trim()
    .charAt(0)
    .toUpperCase();

  async function handleSignOut() {
    setIsSigningOut(true);

    await authClient.signOut();

    setIsSigningOut(false);

    router.push("/");
    router.refresh();
  }

  // Session 加载中
  if (isPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="size-8 animate-pulse rounded-full bg-muted" />

            <div className="grid flex-1 gap-1">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-3 w-32 animate-pulse rounded bg-muted" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // 没有登录
  if (!user) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar>
              {user.image && <AvatarImage src={user.image} alt={user.name} />}

              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>

              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>

            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
                <UserRoundIcon />
                账户
              </DropdownMenuItem>

              <DropdownMenuItem
                render={<Link href="/dashboard/notifications" />}
              >
                <BellIcon />
                通知
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
              {isSigningOut ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <LogOutIcon />
              )}

              {isSigningOut ? "正在退出" : "登出"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
