"use server";

import {prisma} from "@/lib/prisma";

export async function submitContact(formData: FormData) {
  const name = formData.get("name") as string;
  const wechat = formData.get("wechat") as string;
  const message = formData.get("message") as string;

  if (!name || !wechat) {
    return {success: false, error: "请填写姓名和微信号"};
  }

  await prisma.contactSubmission.create({
    data: {name, wechat, message: message || null},
  });

  return {success: true};
}
