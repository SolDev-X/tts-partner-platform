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
import {services, navLinks} from "@/lib/data";
import {useState, useEffect} from "react";
import {SiTiktok} from "@icons-pack/react-simple-icons";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-50
       ${scrolled ? "bg-white/70 backdrop-blur-md rounded-b-lg" : ""} `}
    >
      <header className="flex items-center justify-between mx-auto max-w-6xl w-full p-4">
        <h1>
          <Link href="/" className="flex gap-1.5 items-center">
            <SiTiktok size={20} />
            <span className="font-black  text-2xl">TTS</span>
            <span className="font-bold text-xl">跨境服务</span>
          </Link>
        </h1>

        <nav className="flex items-center gap-14">
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
              className="text-[14px] font-medium hover:opacity-70"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
    </div>
  );
}
