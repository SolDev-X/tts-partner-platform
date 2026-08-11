-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'REVISION_REQUESTED', 'CONFIRMED');

-- CreateEnum
CREATE TYPE "DeliveryEventType" AS ENUM ('PUBLISHED', 'REVISION_REQUESTED', 'CONFIRMED');

-- AlterTable
ALTER TABLE "Order"
ADD COLUMN "deliveryData" JSONB,
ADD COLUMN "deliveryStatus" "DeliveryStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN "deliveryPublishedAt" TIMESTAMP(3),
ADD COLUMN "deliveryConfirmedAt" TIMESTAMP(3),
ADD COLUMN "deliveryRevisionNote" TEXT;

-- Preserve existing completed deliveries.
UPDATE "Order"
SET
  "deliveryStatus" = 'CONFIRMED',
  "deliveryPublishedAt" = COALESCE("deliveryCompletedAt", "updatedAt"),
  "deliveryConfirmedAt" = COALESCE("deliveryCompletedAt", "updatedAt")
WHERE "deliveryCompletedAt" IS NOT NULL;

-- CreateTable
CREATE TABLE "OrderDeliveryEvent" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "type" "DeliveryEventType" NOT NULL,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OrderDeliveryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderDeliveryEvent_orderId_createdAt_idx" ON "OrderDeliveryEvent"("orderId", "createdAt");

-- AddForeignKey
ALTER TABLE "OrderDeliveryEvent" ADD CONSTRAINT "OrderDeliveryEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
