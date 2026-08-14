"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {
  ChevronsUpDownIcon,
  LayoutDashboardIcon,
  LogOutIcon,
} from "lucide-react";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {authClient} from "@/lib/auth-client";

export function HeaderControls() {
  const router = useRouter();
  const {data: session, isPending} = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";
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

  if (isPending) {
    return (
      <div
        className="size-9 rounded-full bg-muted sm:h-9 sm:w-24 sm:rounded-lg lg:w-44"
        aria-hidden="true"
      />
    );
  }

  if (user) {
    return (
      <AccountMenu
        user={user}
        initials={initials}
        isAdmin={isAdmin}
        isSigningOut={isSigningOut}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="h-9 px-2.5 sm:px-3"
        nativeButton={false}
        render={<Link href="/login" />}
      >
        登录
      </Button>

      <Button
        size="sm"
        className="h-9 px-2.5 sm:px-3"
        nativeButton={false}
        render={<Link href="/signup" />}
      >
        注册
      </Button>
    </div>
  );
}

type AccountMenuProps = {
  user: NonNullable<ReturnType<typeof authClient.useSession>["data"]>["user"];
  initials: string;
  isAdmin: boolean;
  isSigningOut: boolean;
  onSignOut: () => Promise<void>;
};

function AccountMenu({
  user,
  initials,
  isAdmin,
  isSigningOut,
  onSignOut,
}: AccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="h-9 max-w-9 gap-2 px-0 aria-expanded:bg-muted sm:max-w-44 sm:px-2 lg:max-w-64"
            aria-label="打开账户菜单"
          />
        }
      >
        <Avatar className="size-8 shrink-0">
          {user.image && <AvatarImage src={user.image} alt={user.name} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        {/* 平板开始显示名称，桌面再显示邮箱 */}
        <div className="hidden min-w-0 flex-1 text-left text-sm leading-tight sm:grid">
          <span className="truncate font-medium">
            {user.name || "未设置名称"}
          </span>
          <span className="hidden truncate text-xs text-muted-foreground lg:block">
            {user.email}
          </span>
        </div>

        <ChevronsUpDownIcon className="ml-auto hidden size-4 shrink-0 sm:block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={6} className="w-56 sm:w-64">
        <div className="px-2 py-1.5 sm:hidden">
          <p className="truncate text-sm font-medium">
            {user.name || "未设置名称"}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {user.email}
          </p>
        </div>

        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/dashboard" />}>
            <LayoutDashboardIcon />
            控制台
          </DropdownMenuItem>

          {isAdmin && (
            <DropdownMenuItem render={<Link href="/admin/orders" />}>
              <LayoutDashboardIcon />
              管理后台
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={isSigningOut}
          onClick={() => void onSignOut()}
        >
          <LogOutIcon />
          {isSigningOut ? "正在登出..." : "登出"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
