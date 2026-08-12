import {del} from "@vercel/blob";
import {handleUpload, type HandleUploadBody} from "@vercel/blob/client";
import {NextResponse} from "next/server";

import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = [
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
];

type UploadPayload = {
  orderNumber: string;
  fileName: string;
  size: number;
};

export async function POST(
  request: Request,
  {params}: {params: Promise<{orderNumber: string}>},
) {
  const body = (await request.json()) as HandleUploadBody;
  const {orderNumber} = await params;

  try {
    const response = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const session = await auth.api.getSession({headers: request.headers});
        if (!session || session.user.role !== "ADMIN") {
          throw new Error("无权上传交付文件。");
        }

        const payload = JSON.parse(clientPayload ?? "null") as UploadPayload | null;
        if (
          !payload ||
          payload.orderNumber !== orderNumber ||
          !payload.fileName ||
          payload.fileName.length > 200 ||
          !Number.isInteger(payload.size) ||
          payload.size <= 0 ||
          payload.size > MAX_FILE_SIZE ||
          !pathname.startsWith(`orders/${orderNumber}/delivery/`)
        ) {
          throw new Error("交付文件信息不正确。");
        }

        const order = await prisma.order.findUnique({
          where: {orderNumber},
          select: {deliveryStatus: true},
        });
        if (!order) throw new Error("订单不存在。");
        if (order.deliveryStatus === "CONFIRMED") {
          throw new Error("客户已确认交付，无法替换文件。");
        }

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_FILE_SIZE,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify(payload),
        };
      },
      onUploadCompleted: async ({blob, tokenPayload}) => {
        const payload = JSON.parse(tokenPayload ?? "null") as UploadPayload | null;
        if (!payload || payload.orderNumber !== orderNumber) {
          throw new Error("无法保存交付文件信息。");
        }

        const previous = await prisma.order.findUnique({
          where: {orderNumber},
          select: {deliveryFilePathname: true, deliveryStatus: true},
        });
        if (!previous || previous.deliveryStatus === "CONFIRMED") {
          await del(blob.pathname);
          throw new Error("当前订单无法接收交付文件。");
        }

        await prisma.order.update({
          where: {orderNumber},
          data: {
            deliveryFileName: payload.fileName,
            deliveryFilePathname: blob.pathname,
            deliveryFileMimeType: blob.contentType,
            deliveryFileSize: payload.size,
          },
        });

        if (
          previous.deliveryFilePathname &&
          previous.deliveryFilePathname !== blob.pathname
        ) {
          await del(previous.deliveryFilePathname).catch(() => undefined);
        }
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {error: error instanceof Error ? error.message : "上传失败。"},
      {status: 400},
    );
  }
}
