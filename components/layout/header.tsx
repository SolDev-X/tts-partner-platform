"use client";

import Image from "next/image";
import Link from "next/link";
import {ChevronDown} from "lucide-react";
import {useEffect, useRef, useState} from "react";

import {services} from "@/lib/data";
import {HeaderControls} from "@/components/layout/header-controls";

const navLinks = [
  {href: "/about", label: "关于我们"},
  {href: "/contact", label: "联系我们"},
];

export default function Header() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesMenuRef = useRef<HTMLDetailsElement>(null);

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

  return (
    <header className="bg-white  rounded-b-2xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between p-4 ">
        <h1>
          <Link href="/" className="flex items-center gap-1.5">
            <Image
              src="/vercel.svg"
              alt="跨境服务平台"
              width={20}
              height={20}
            />
            <span className="text-base font-bold lg:text-xl">跨境服务平台</span>
          </Link>
        </h1>

        <nav className="hidden items-center gap-14 lg:flex" aria-label="主导航">
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
              className="text-[14px] font-medium hover:opacity-70"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <HeaderControls />
      </div>
    </header>
  );
}
