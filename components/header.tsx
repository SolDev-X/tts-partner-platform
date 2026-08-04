"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {services} from "@/lib/data";
import {authClient} from "@/lib/auth-client";
import {useState} from "react";
import {Button} from "./ui/button";
import {
  ChevronDown,
  LoaderCircle,
  LogOut,
  Menu,
  ShoppingBag,
} from "lucide-react";
import {ModeToggle} from "./mode-toggle";
import Image from "next/image";

const navLinks = [
  {href: "/about", label: "关于我们"},
  {href: "/contact", label: "联系我们"},
];

export default function Header() {
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
    <header className="flex items-center justify-between mx-auto max-w-6xl w-full p-4">
      <h1>
        <Link href="/" className="flex gap-1.5 items-center">
          <Image
            src="/vercel.svg"
            alt="跨境服务平台"
            width="20"
            height="20"
            className="dark:invert"
          />
          <span className="text-base font-bold lg:text-xl">跨境服务平台</span>
        </Link>
      </h1>

      <nav className="hidden items-center gap-14 lg:flex">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>服务</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-1 p-1">
                  {services.map((s) => (
                    <li key={s.id}>
                      <NavigationMenuLink href={`/services/${s.id}`}>
                        <div className="font-medium">{s.label}</div>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[14px] font-medium hover:opacity-70 "
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        {/* 移动端账户菜单 */}
        {!isPending && user && (
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon" aria-label="打开账户菜单">
                    <Avatar size="sm">
                      {user.image && (
                        <AvatarImage src={user.image} alt={user.name} />
                      )}
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
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
                {!isAdmin && (
                  <DropdownMenuItem
                    render={<Link href="/account/orders" />}
                    className="px-2 py-1.5"
                  >
                    <ShoppingBag />
                    我的订单
                  </DropdownMenuItem>
                )}
                {!isAdmin && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  onClick={handleSignOut}
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
          </div>
        )}
        {/* 移动端汉堡菜单 */}
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
            className="w-[300px] sm:w-[340px] p-0 flex flex-col"
          >
            {/* 顶部标题栏 */}
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <SheetTitle className="text-lg font-semibold">菜单</SheetTitle>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              {/* 服务分组 */}
              <div className="mb-8">
                <p className="px-3 mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  服务
                </p>
                <div className="space-y-1">
                  {services.map((s) => (
                    <Link
                      key={s.id}
                      href={`/services/${s.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center px-3 py-3 rounded-lg text-[15px] font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* 其他导航 */}
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center px-3 py-3 rounded-lg text-[15px] font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
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
                  {!isAdmin && (
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
                    nativeButton={false}
                    render={<Link href="/login" onClick={() => setOpen(false)} />}
                  >
                    登录
                  </Button>
                  <Button
                    nativeButton={false}
                    render={
                      <Link href="/register" onClick={() => setOpen(false)} />
                    }
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
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className="h-9 gap-2 px-2">
                    <Avatar size="sm">
                      {user.image && (
                        <AvatarImage src={user.image} alt={user.name} />
                      )}
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span className="max-w-24 truncate">{user.name}</span>
                    <ChevronDown className="size-3.5 text-muted-foreground" />
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
                {!isAdmin && (
                  <DropdownMenuItem
                    render={<Link href="/account/orders" />}
                    className="px-2 py-1.5"
                  >
                    <ShoppingBag />
                    我的订单
                  </DropdownMenuItem>
                )}
                {!isAdmin && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  onClick={handleSignOut}
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
          ) : (
            <>
              <Button
                variant="ghost"
                nativeButton={false}
                render={<Link href="/login" />}
              >
                登录
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/register" />}
              >
                注册
              </Button>
            </>
          )}
        </div>

        {/* 主题切换 */}
        <ModeToggle />
      </div>
    </header>
  );
}
