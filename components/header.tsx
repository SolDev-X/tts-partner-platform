"use client";

import Link from "next/link";
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
import {services} from "@/lib/data";
import {useState, useEffect} from "react";
import {Button} from "./ui/button";
import {Menu} from "lucide-react";
import {ModeToggle} from "./mode-toggle";
import Image from "next/image";

const navLinks = [
  {href: "/about", label: "关于我们"},
  {href: "/contact", label: "联系我们"},
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <span className="font-bold text-base md:text-xl">跨境服务平台</span>
        </Link>
      </h1>

      <nav className="hidden md:flex items-center gap-8 lg:gap-14">
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
        {/* 移动端汉堡菜单 */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden">
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
          </SheetContent>
        </Sheet>
        {/* 主题切换 */}
        <ModeToggle />
      </div>
    </header>
  );
}
