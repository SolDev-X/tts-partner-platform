"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {
  ChevronDown,
  LoaderCircle,
  LogOut,
  Menu,
  ShoppingBag,
  UserRound,
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
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {authClient} from "@/lib/auth-client";
import {services} from "@/lib/data";

const navLinks = [
  {href: "/about", label: "关于我们"},
  {href: "/contact", label: "联系我们"},
];

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

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">打开菜单</span>
            </Button>
          }
        />
        <SheetContent
          side="right"
          className="flex w-[300px] flex-col p-0 sm:w-[340px]"
        >
          <div className="flex items-center justify-between border-b px-6 py-5">
            <SheetTitle className="text-lg font-semibold">菜单</SheetTitle>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="mb-8">
              <p className="mb-3 px-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                服务
              </p>
              <div className="space-y-1">
                {services.map((service) => (
                  <Link
                    key={service.id}
                    href={`/services/${service.id}`}
                    onClick={() => setOpen(false)}
                    className="flex rounded-lg px-3 py-3 text-[15px] font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {service.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex rounded-lg px-3 py-3 text-[15px] font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="border-t p-4">
            {isPending ? (
              <div className="h-9" aria-hidden="true" />
            ) : user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-2">
                  <Avatar>
                    {user.image && (
                      <AvatarImage src={user.image} alt={user.name} />
                    )}
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                {isAdmin ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    nativeButton={false}
                    render={
                      <Link
                        href="/admin/orders"
                        onClick={() => setOpen(false)}
                      />
                    }
                  >
                    <ShoppingBag />
                    订单管理
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    nativeButton={false}
                    render={
                      <Link
                        href="/account/orders"
                        onClick={() => setOpen(false)}
                      />
                    }
                  >
                    <ShoppingBag />
                    我的订单
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  nativeButton={false}
                  render={
                    <Link href="/account" onClick={() => setOpen(false)} />
                  }
                >
                  <UserRound />
                  账户设置
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <LogOut />
                  )}
                  {isSigningOut ? "正在退出" : "退出登录"}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  nativeButton={false}
                  render={<Link href="/login" onClick={() => setOpen(false)} />}
                >
                  登录
                </Button>
                <Button
                  className="w-full"
                  nativeButton={false}
                  render={<Link href="/signup" onClick={() => setOpen(false)} />}
                >
                  注册
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

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

function AccountMenu({
  user,
  initials,
  isAdmin,
  isSigningOut,
  onSignOut,
  compact = false,
}: AccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size={compact ? "icon" : "default"}
            className={compact ? undefined : "h-9 gap-2 px-2"}
            aria-label={compact ? "打开账户菜单" : undefined}
          >
            <Avatar size="sm">
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            {!compact && (
              <>
                <span className="max-w-24 truncate">{user.name}</span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </>
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 font-normal">
            <span className="block truncate text-sm font-medium text-foreground">
              {user.name}
            </span>
            <span className="block truncate text-xs">{user.email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {isAdmin ? (
          <DropdownMenuItem
            render={<Link href="/admin/orders" />}
            className="px-2 py-1.5"
          >
            <ShoppingBag />
            订单管理
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            render={<Link href="/account/orders" />}
            className="px-2 py-1.5"
          >
            <ShoppingBag />
            我的订单
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          render={<Link href="/account" />}
          className="px-2 py-1.5"
        >
          <UserRound />
          账户设置
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onSignOut}
          disabled={isSigningOut}
          className="px-2 py-1.5"
        >
          {isSigningOut ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <LogOut />
          )}
          {isSigningOut ? "正在退出" : "退出登录"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
