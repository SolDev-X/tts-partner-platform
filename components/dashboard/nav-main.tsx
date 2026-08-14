"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {ChevronRightIcon} from "lucide-react";
import Link from "next/link";
import {usePathname, useSearchParams} from "next/navigation";
import {useState} from "react";

type NavItem = {
  title: string;
  url: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
    count?: number;
  }[];
};

function NavCount({count}: {count?: number}) {
  if (typeof count !== "number" || count <= 0) return null;

  return (
    <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-muted px-1.5 text-[10px] font-medium tabular-nums text-muted-foreground">
      {count > 99 ? "99+" : count}
    </span>
  );
}

function NavMainItem({item}: {item: NavItem}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {state, isMobile} = useSidebar();

  const hasChildren = Boolean(item.items?.length);
  const isInSection =
    pathname === item.url || pathname.startsWith(`${item.url}/`);

  const [open, setOpen] = useState<boolean>(item.isActive || isInSection);

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.title}
          isActive={pathname === item.url}
          render={<Link href={item.url} />}
        >
          {item.icon}
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  /*
   * 桌面端折叠状态：
   * 不在窄栏里硬塞二级菜单，而是像飞书一样从主图标右侧
   * 弹出一个轻量的二级导航面板。
   */
  if (state === "collapsed" && !isMobile) {
    const currentView = searchParams.get("view");

    return (
      <SidebarMenuItem>
        <Popover>
          <PopoverTrigger
            render={
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isInSection}
                aria-label={item.title}
              />
            }
          >
            {item.icon}
            <span>{item.title}</span>
          </PopoverTrigger>

          <PopoverContent
            side="right"
            align="start"
            sideOffset={10}
            className="w-52 rounded-xl p-2 shadow-lg"
          >
            <div className="px-2 pb-2 pt-1">
              <p className="text-sm font-medium">{item.title}</p>
            </div>

            <div className="space-y-1">
              <Link
                href={item.url}
                className={`flex h-9 items-center rounded-md px-2.5 text-sm transition-colors hover:bg-muted ${
                  pathname === item.url && !currentView
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>全部订单</span>
              </Link>

              {item.items?.map((subItem) => {
                const url = new URL(subItem.url, "http://localhost");
                const subView = url.searchParams.get("view");
                const isActive =
                  pathname === url.pathname && currentView === subView;

                return (
                  <Link
                    key={subItem.title}
                    href={subItem.url}
                    className={`flex h-9 items-center rounded-md px-2.5 text-sm transition-colors hover:bg-muted ${
                      isActive
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{subItem.title}</span>
                    <NavCount count={subItem.count} />
                  </Link>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    );
  }

  /*
   * 展开状态 / 移动端：
   * 保留原来的 Collapsible 二级导航。
   */
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="group/collapsible"
      render={<SidebarMenuItem />}
    >
      <SidebarMenuButton
        tooltip={item.title}
        isActive={isInSection}
        render={<Link href={item.url} onClick={() => setOpen(true)} />}
      >
        {item.icon}
        <span>{item.title}</span>
      </SidebarMenuButton>

      <CollapsibleTrigger
        render={
          <SidebarMenuAction
            className="transition-transform duration-200 group-data-open/collapsible:rotate-90"
            aria-label={`${open ? "收起" : "展开"}${item.title}`}
          />
        }
      >
        <ChevronRightIcon />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <SidebarMenuSub>
          {item.items?.map((subItem) => (
            <SidebarMenuSubItem key={subItem.title}>
              <SidebarMenuSubButton
                render={<Link href={subItem.url} />}
                className="text-[12px] text-muted-foreground"
              >
                <span>{subItem.title}</span>
                <NavCount count={subItem.count} />
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function NavMain({items}: {items: NavItem[]}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>工作台</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => (
          <NavMainItem key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
