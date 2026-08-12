-- AlterTable
ALTER TABLE "Order"
DROP COLUMN "adminNote",
ADD COLUMN "deliveryFilePathname" TEXT,
ADD COLUMN "deliveryFileMimeType" TEXT,
ADD COLUMN "deliveryFileSize" INTEGER;
