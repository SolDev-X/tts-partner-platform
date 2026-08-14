"use client";

import Image from "next/image";
import Link from "next/link";
import {ChevronDown, Menu, X} from "lucide-react";
import {useEffect, useRef, useState} from "react";

import {services} from "@/lib/data";
import {HeaderControls} from "@/components/layout/header-controls";

const navLinks = [
  {href: "/about", label: "关于我们"},
  {href: "/contact", label: "联系我们"},
];

export default function Header() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const servicesMenuRef = useRef<HTMLDetailsElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!servicesOpen) return;

    function closeOnOutsidePointerDown(event: PointerEvent) {
      if (!servicesMenuRef.current?.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointerDown);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsidePointerDown);
  }, [servicesOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    function closeOnOutsidePointerDown(event: PointerEvent) {
      if (!mobileMenuRef.current?.contains(event.target as Node)) {
        setMobileMenuOpen(false);
        setMobileServicesOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointerDown);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsidePointerDown);
  }, [mobileMenuOpen]);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  }

  return (
    <header className="relative rounded-b-2xl bg-background">
      <div className="mx-auto flex min-h-14 w-full max-w-6xl items-center gap-2 px-3 py-2 sm:min-h-16 sm:gap-3 sm:px-4 lg:px-6">
        <h1 className="min-w-0 shrink-0">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-1.5"
            aria-label="返回首页"
          >
            <Image
              src="/vercel.svg"
              alt=""
              width={20}
              height={20}
              className="shrink-0"
              priority
            />

            <span className="whitespace-nowrap text-sm font-bold sm:text-base lg:text-xl">
              <span className="sm:hidden">跨境服务</span>
              <span className="hidden sm:inline">跨境服务平台</span>
            </span>
          </Link>
        </h1>

        {/* 桌面端主导航 */}
        <nav
          className="hidden flex-1 items-center justify-center gap-8 xl:gap-14 lg:flex"
          aria-label="主导航"
        >
          <details
            ref={servicesMenuRef}
            className="group relative"
            open={servicesOpen}
            onToggle={(event) => setServicesOpen(event.currentTarget.open)}
          >
            <summary className="flex h-9 cursor-pointer list-none items-center rounded-lg px-2.5 py-1.5 text-[14px] font-medium outline-none transition-all hover:bg-muted hover:opacity-70 focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
              服务
              <ChevronDown className="ml-1 size-3 transition-transform group-open:rotate-180" />
            </summary>

            <ul className="absolute left-0 top-full z-50 mt-2 grid w-[300px] gap-1 rounded-lg bg-popover p-1 text-popover-foreground shadow ring-1 ring-foreground/10">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.id}`}
                    onClick={() => setServicesOpen(false)}
                    className="block rounded-md p-2 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-[14px] font-medium hover:opacity-70"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div
          ref={mobileMenuRef}
          className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2"
        >
          {/* 手机 / 平板端导航入口 */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="inline-flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
            aria-label={mobileMenuOpen ? "关闭导航菜单" : "打开导航菜单"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="size-4.5" />
            ) : (
              <Menu className="size-4.5" />
            )}
          </button>

          <HeaderControls />

          {/* 手机 / 平板端二级导航面板 */}
          {mobileMenuOpen && (
            <div className="absolute left-3 right-3 top-full z-50 mt-2 rounded-xl border bg-popover p-2 text-popover-foreground shadow-lg sm:left-auto sm:right-4 sm:w-80 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileServicesOpen((value) => !value)}
                className="flex h-10 w-full items-center rounded-lg px-3 text-left text-sm font-medium transition-colors hover:bg-muted"
                aria-expanded={mobileServicesOpen}
              >
                <span>服务</span>
                <ChevronDown
                  className={`ml-auto size-4 transition-transform ${
                    mobileServicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {mobileServicesOpen && (
                <div className="mb-1 ml-2 border-l pl-2">
                  {services.map((service) => (
                    <Link
                      key={service.id}
                      href={`/services/${service.id}`}
                      onClick={closeMobileMenu}
                      className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {service.label}
                    </Link>
                  ))}
                </div>
              )}

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="flex h-10 items-center rounded-lg px-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
