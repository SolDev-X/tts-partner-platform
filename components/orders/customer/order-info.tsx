"use client";

import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

import {schema} from "./orders-table";
import {z} from "zod";

export function OrderInfo({item}: {item: z.infer<typeof schema>}) {
  return (
    <div className="flex flex-col gap-4 text-[10px]">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="orderInfo">服务项目</Label>
          <Input id="orderInfo" value={item.orderInfo} readOnly />
        </div>

        <div className="flex flex-col gap-3 ">
          <Label htmlFor="orderId">订单编号</Label>
          <Input
            id="orderId"
            value={item.orderId}
            readOnly
            className="px-0 text-center"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="currentStatus">当前状态</Label>
          <Input id="currentStatus" value={item.currentStatus} readOnly />
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="amount">订单金额</Label>
          <Input id="amount" value={item.amount} readOnly />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="createdAt">创建时间</Label>
          <Input id="createdAt" value={item.createdAt} readOnly />
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="updatedAt">更新时间</Label>
          <Input id="updatedAt" value={item.updatedAt} readOnly />
        </div>
      </div>
    </div>
  );
}
