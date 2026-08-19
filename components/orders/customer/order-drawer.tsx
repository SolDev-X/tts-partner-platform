"use client";

import {useIsMobile} from "@/hooks/use-mobile";
import {Button} from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {z} from "zod";
import {schema} from "./orders-table";
import type {OrderStatus} from "@/lib/generated/prisma";
import {OrderInfo} from "./order-info";

const orderActions: Record<
  OrderStatus,
  {
    primary: string | null;
    secondary: string;
  }
> = {
  PENDING_CONFIRMATION: {
    primary: null,
    secondary: "取消订单",
  },

  PENDING_PAYMENT: {
    primary: "立即付款",
    secondary: "取消订单",
  },

  WAITING_FOR_CUSTOMER: {
    primary: "提交材料",
    secondary: "申请退款",
  },

  PROCESSING: {
    primary: "查看进度",
    secondary: "关闭",
  },

  COMPLETED: {
    primary: "查看交付",
    secondary: "关闭",
  },

  CANCELLED: {
    primary: null,
    secondary: "关闭",
  },

  REFUNDING: {
    primary: "联系客服",
    secondary: "关闭",
  },

  REFUNDED: {
    primary: null,
    secondary: "关闭",
  },
};

export function OrderDrawer({item}: {item: z.infer<typeof schema>}) {
  const isMobile = useIsMobile();
  const actions = orderActions[item.status];
  return (
    <Drawer swipeDirection={isMobile ? "down" : "right"}>
      <DrawerTrigger
        render={
          <Button
            variant="link"
            className="w-fit px-0 text-left text-foreground"
          />
        }
      >
        {item.orderInfo}
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{item.orderInfo}</DrawerTitle>
        </DrawerHeader>
        <div className="mt-4 px-4 text-sm">
          <OrderInfo item={item} />
        </div>
        <DrawerFooter>
          {actions.primary && <Button>{actions.primary}</Button>}

          <DrawerClose render={<Button variant="outline" />}>
            {actions.secondary}
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
