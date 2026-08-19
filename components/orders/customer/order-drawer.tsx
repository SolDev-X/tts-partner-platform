"use client";

import * as React from "react";
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
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Separator} from "@/components/ui/separator";
import {OrderStatusBadge} from "@/components/orders/shared/order-status-badge";
import {orderStatusMeta} from "@/lib/order-status";
import {z} from "zod";
import {schema} from "./orders-table";
import type {OrderStatus} from "@/lib/generated/prisma";

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
  const statusMeta = orderStatusMeta[item.status];
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

        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <Separator />

              <div className="grid gap-2">
                <div className="leading-none font-medium">订单进度</div>

                <div className="flex items-start gap-2">
                  <OrderStatusBadge status={item.status} />

                  <div className="text-muted-foreground">
                    {statusMeta.nextStep}
                  </div>
                </div>
              </div>

              <Separator />
            </>
          )}

          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="orderInfo">订单信息</Label>

              <Input id="orderInfo" defaultValue={item.orderInfo} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="currentStatus">当前状态</Label>

                <Select defaultValue={item.currentStatus}>
                  <SelectTrigger id="currentStatus" className="w-full">
                    <SelectValue placeholder="选择当前状态" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="待确认">待确认</SelectItem>
                    <SelectItem value="待付款">待付款</SelectItem>
                    <SelectItem value="待补资料">待补资料</SelectItem>
                    <SelectItem value="办理中">办理中</SelectItem>
                    <SelectItem value="已完成">已完成</SelectItem>
                    <SelectItem value="已取消">已取消</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="pendingAction">待处理</Label>

                <Select defaultValue={item.orderId}>
                  <SelectTrigger id="pendingAction" className="w-full">
                    <SelectValue placeholder="选择待处理事项" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="等待平台确认">等待平台确认</SelectItem>
                    <SelectItem value="完成付款">完成付款</SelectItem>
                    <SelectItem value="补充资料">补充资料</SelectItem>
                    <SelectItem value="无需处理">无需处理</SelectItem>
                    <SelectItem value="确认交付">确认交付</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="amount">订单金额</Label>

                <Input id="amount" defaultValue={item.amount} />
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="createdAt">创建时间</Label>

                <Input id="createdAt" defaultValue={item.createdAt} />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="updatedAt">更新时间</Label>

              <Select defaultValue={item.updatedAt}>
                <SelectTrigger id="updatedAt" className="w-full">
                  <SelectValue placeholder="选择更新时间" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="2026/8/16">2026/8/16</SelectItem>
                  <SelectItem value="2026/8/15">2026/8/15</SelectItem>
                  <SelectItem value="2026/8/14">2026/8/14</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
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
