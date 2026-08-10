CREATE TYPE "MaterialStatus" AS ENUM (
  'PENDING',
  'SUBMITTED',
  'APPROVED',
  'NEEDS_REVISION'
);

CREATE TABLE "OrderMaterial" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "status" "MaterialStatus" NOT NULL DEFAULT 'PENDING',
  "fileName" TEXT,
  "storageKey" TEXT,
  "mimeType" TEXT,
  "size" INTEGER,
  "customerNote" TEXT,
  "adminFeedback" TEXT,
  "submittedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "OrderMaterial_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OrderMaterial_orderId_key_key"
ON "OrderMaterial"("orderId", "key");

CREATE INDEX "OrderMaterial_orderId_status_idx"
ON "OrderMaterial"("orderId", "status");

ALTER TABLE "OrderMaterial"
ADD CONSTRAINT "OrderMaterial_orderId_fkey"
FOREIGN KEY ("orderId") REFERENCES "Order"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
