CREATE TYPE "ProgressStep" AS ENUM (
  'ORDER_CREATED',
  'PAYMENT_SUCCESS',
  'MATERIALS_READY',
  'PROCESSING',
  'COMPLETED'
);

CREATE TABLE "OrderProgressEvent" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "step" "ProgressStep" NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "OrderProgressEvent_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Order" ADD COLUMN "deliveryDescription" TEXT;
ALTER TABLE "Order" ADD COLUMN "deliveryInvitationCode" TEXT;
ALTER TABLE "Order" ADD COLUMN "deliveryStoreNumber" TEXT;
ALTER TABLE "Order" ADD COLUMN "deliveryFileName" TEXT;
ALTER TABLE "Order" ADD COLUMN "deliveryCompletedAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN "deliveryVisibleAfterPayment" BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX "OrderProgressEvent_orderId_step_createdAt_idx" ON "OrderProgressEvent"("orderId", "step", "createdAt");

ALTER TABLE "OrderProgressEvent" ADD CONSTRAINT "OrderProgressEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
