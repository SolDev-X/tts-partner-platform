"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {
  LogOutIcon,
  LayoutDashboardIcon,
  ChevronsUpDownIcon,
} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {authClient} from "@/lib/auth-client";

export function HeaderControls() {
  const router = useRouter();
  const {data: session, isPending} = authClient.useSession();
  const [open, setOpen] = useState(false);
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
    setOpen(false);
    setIsSigningOut(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      {!isPending && user && (
        <div className="lg:hidden">
          <AccountMenu
            user={user}
            initials={initials}
            isAdmin={isAdmin}
            isSigningOut={isSigningOut}
            onSignOut={handleSignOut}
            compact
          />
        </div>
      )}

      <div className="hidden items-center gap-1 lg:flex">
        {isPending ? (
          <div className="h-8 w-28" aria-hidden="true" />
        ) : user ? (
          <AccountMenu
            user={user}
            initials={initials}
            isAdmin={isAdmin}
            isSigningOut={isSigningOut}
            onSignOut={handleSignOut}
          />
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              nativeButton={false}
              render={<Link href="/login" />}
            >
              登录
            </Button>
            <Button nativeButton={false} render={<Link href="/signup" />}>
              注册
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

type AccountMenuProps = {
  user: NonNullable<ReturnType<typeof authClient.useSession>["data"]>["user"];
  initials: string;
  isAdmin: boolean;
  isSigningOut: boolean;
  onSignOut: () => Promise<void>;
  compact?: boolean;
};

function AccountMenu({user, onSignOut}: AccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="h-auto w-auto gap-2 px-2 py-1.5 aria-expanded:bg-muted"
          />
        }
      >
        <Avatar className="hidden sm:flex">
          <AvatarImage src={user.email} alt={user.name} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{user.name}</span>
          <span className="truncate text-xs">{user.email}</span>
        </div>
        <ChevronsUpDownIcon className="ml-auto size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={4}>
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/dashboard" />}>
            <LayoutDashboardIcon />
            控制台
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>
          <LogOutIcon />
          登出
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
