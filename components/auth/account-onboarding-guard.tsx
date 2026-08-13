"use client";

import {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";

import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {authClient} from "@/lib/auth-client";

export function AccountOnboardingGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const {data: session, isPending} = authClient.useSession();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (isPending || session?.user.role !== "CUSTOMER") {
      return;
    }

    let isActive = true;

    void fetch("/api/account/password")
      .then(async (response) => {
        if (!response.ok) return;
        const result = (await response.json()) as {needsOnboarding?: boolean};
        if (isActive) {
          setNeedsOnboarding(Boolean(result.needsOnboarding));
        }
      })
      .catch(() => undefined);

    return () => {
      isActive = false;
    };
  }, [isPending, session?.user.role]);

  useEffect(() => {
    if (session?.user.role !== "CUSTOMER" || !needsOnboarding) return;

    function preventNavigation(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a[href]");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("/login")) return;

      event.preventDefault();
      event.stopPropagation();
      setDialogOpen(true);
    }

    document.addEventListener("click", preventNavigation, true);
    return () => document.removeEventListener("click", preventNavigation, true);
  }, [needsOnboarding, pathname, session?.user.role]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>请先完善账户信息</DialogTitle>
          <DialogDescription>
            新账户需要填写公司名称并设置登录密码，完成后才可以继续访问其他页面。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => {
              setDialogOpen(false);
              if (pathname !== "/login") router.push("/login");
            }}
          >
            去完善
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
