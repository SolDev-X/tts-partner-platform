"use client";

import {z} from "zod";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useIsMobile} from "@/hooks/use-mobile";

import {adminOrderSchema} from "./orders-table";

type AdminOrder = z.infer<typeof adminOrderSchema>;

export function AdminOrderDrawer({item}: {item: AdminOrder}) {
  const isMobile = useIsMobile();

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
          <div className="flex flex-col gap-4 text-[10px]">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor={`admin-order-service-${item.id}`}>
                  服务项目
                </Label>
                <Input
                  id={`admin-order-service-${item.id}`}
                  value={item.orderInfo}
                  readOnly
                />
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor={`admin-order-number-${item.id}`}>
                  订单编号
                </Label>
                <Input
                  id={`admin-order-number-${item.id}`}
                  value={item.orderId}
                  readOnly
                  className="px-0 text-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor={`admin-order-customer-${item.id}`}>客户</Label>
                <Input
                  id={`admin-order-customer-${item.id}`}
                  value={item.customer}
                  readOnly
                />
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor={`admin-order-status-${item.id}`}>
                  当前状态
                </Label>
                <Input
                  id={`admin-order-status-${item.id}`}
                  value={item.currentStatus}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor={`admin-order-amount-${item.id}`}>
                  订单金额
                </Label>
                <Input
                  id={`admin-order-amount-${item.id}`}
                  value={item.amount}
                  readOnly
                />
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor={`admin-order-created-at-${item.id}`}>
                  创建时间
                </Label>
                <Input
                  id={`admin-order-created-at-${item.id}`}
                  value={item.createdAt}
                  readOnly
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor={`admin-order-updated-at-${item.id}`}>
                更新时间
              </Label>
              <Input
                id={`admin-order-updated-at-${item.id}`}
                value={item.updatedAt}
                readOnly
              />
            </div>
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose render={<Button variant="outline" />}>
            关闭
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
