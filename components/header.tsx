import Link from "next/link";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const services = [
  {
    href: "/",
    label: "定邀/普招代入驻",
  },
  {
    href: "/",
    label: "本土/跨境类目报白",
  },
  {
    href: "/",
    label: "开通全类目&一品多仓",
  },
];

const navLinks = [
  {href: "/about", label: "关于我们"},
  {href: "/contact", label: "联系我们"},
];

export default function Header() {
  return (
    <div className="flex items-center justify-between mx-auto max-w-6xl w-full p-4">
      <Link href="/">
        <Image
          src="/next.svg"
          alt="Tiktok shop跨境服务"
          width={100}
          height={24}
        ></Image>
      </Link>
      <nav className="flex items-center gap-14">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-[16px] font-medium hover:opacity-70">
                服务
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-1 p-1">
                  {services.map((s) => (
                    <li key={s.href}>
                      <NavigationMenuLink href={s.href}>
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
            className="text-[16px] font-medium hover:opacity-70"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
